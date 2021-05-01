import { Component, ViewChild, OnInit, Input, ViewChildren } from '@angular/core';
import { CornerstoneDirective } from './cornerstone.directive';
import { ThumbnailDirective } from './thumbnail.directive';


declare const cornerstone;
declare const cornerstoneTools;


@Component({
  selector: 'dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DICOMViewerComponent implements OnInit {

  @Input() public enableViewerTools = false; // enable viewer tools
  @Input() public enablePlayTools = false; // enable Play Clip tools
  @Input() public downloadImagesURL = '' // download images URL
  @Input() public maxImagesToLoad = 1000000; // limit for the automatic loading of study images

  public seriesList = []; // list of series on the images being displayed
  public currentSeriesIndex = 0;
  public currentSeries: any = {};
  public imageCount = 0; // total image count being viewed

  public LastUpdatedElement;


  // control message for more images to load
  public get moreImagestoLoad(): string {
    if (this.loadedImages.length < this.imageIdList.length && !this.loadingImages) { // are there any more images to load?
      const imagesToLoad = (this.maxImagesToLoad <= 0) ? (this.imageIdList.length - this.loadedImages.length) : Math.min(this.maxImagesToLoad, this.imageIdList.length - this.loadedImages.length);
      return imagesToLoad.toString();
    } else return '';
  }

  // control exhibition of a loading images progress indicator
  public loadingImages = false;
  public get showProgress(): any { return { display: (this.loadingImages) ? 'inline' : 'none' } };
  
  // control styling of a button that can be toggled on/off
  public get showButtonToggleEnabled(): any { 
    if (this.viewPort.scrollEnabled) { 
      return { 'color': 'rgb(211, 34, 81)', 'border-color': 'whitesmoke', 'border-style': 'inset' }; 
    } 
    else {
      return { 'color': 'white', 'border-color': '#868686' };
    }
  };

  @ViewChild(CornerstoneDirective, { static: true }) viewPort: CornerstoneDirective; // the main cornerstone viewport
  @ViewChildren(ThumbnailDirective) thumbnails: Array<ThumbnailDirective>;

  private loadedImages = [];
  private imageIdList = [];
  private element: any;
  private targetImageCount = 0;

  constructor() { }

  ngOnInit() {
    this.element = this.viewPort.element;
  }
 
  /**
   * Load dicom images for display
   *
   * @param imageIdList list of imageIds to load and display
   */
  loadStudyImages(imageIdList: Array<any>) {
    this.element = this.viewPort.element;
    this.imageIdList = imageIdList;
    this.viewPort.resetViewer();
    // maybe here we can add a loading icon/animation while DICOM files are loading
    this.viewPort.resetImageCache(); // clean up image cache
    this.seriesList = []; // start a new series list
    this.currentSeriesIndex = 0; // always display first series
    this.loadedImages = []; // reset list of images already loaded

    // loop thru all imageIds, load and cache them for exhibition (up the the maximum limit defined)
    const maxImages = (this.maxImagesToLoad <= 0) ? imageIdList.length : Math.min(this.maxImagesToLoad, imageIdList.length);
    this.loadingImages = true; // activate progress indicator
    this.targetImageCount = maxImages;
    for (let index = 0; index < maxImages; index++) {
      const imageId = imageIdList[index];
      cornerstone.loadAndCacheImage(imageId).then(imageData => { this.imageLoaded(imageData) });
    }
  }

  public download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /**
   *
   * @param imageData the dicom image data
   */
  private imageLoaded(imageData) {
    //console.log(imageData.imageId)
    // build list of series in all loadded images
    const series = {
      studyID: imageData.data.string('x0020000d'),
      seriesID: imageData.data.string('x0020000e'),
      seriesNumber: imageData.data.intString('x00200011'),
      studyDescription: imageData.data.string('x00081030'),
      seriesDescription: imageData.data.string('x0008103e'),
      imageCount: 1,
      imageList: [imageData]
    }
    // if this is a new series, add it to the list
    let seriesIndex = this.seriesList.findIndex(item => item.seriesID === series.seriesID);
    if (seriesIndex < 0) {
      seriesIndex = this.seriesList.length;
      this.seriesList.push(series);
      this.seriesList.sort((a, b) => {
        if (a.seriesNumber > b.seriesNumber) return 1;
        if (a.seriesNumber < b.seriesNumber) return -1;
        return 0;
      })
    } else {
      let seriesItem = this.seriesList[seriesIndex];
      seriesItem.imageCount++;
      seriesItem.imageList.push(imageData);
      seriesItem.imageList.sort((a, b) => {
        if (a.data.intString('x00200013') > b.data.intString('x00200013')) return 1;
        if (a.data.intString('x00200013') < b.data.intString('x00200013')) return -1;
        return 0;
      })
    }

    this.loadedImages.push(imageData); // save to images loaded

    if (seriesIndex === this.currentSeriesIndex) {
      this.showSeries(this.currentSeriesIndex)
    }

    if (this.loadedImages.length >= this.targetImageCount) { // did we finish loading images?
      this.loadingImages = false; // deactivate progress indicator
    }

  }

  public showSeries(index) {
    this.currentSeriesIndex = index;
    this.currentSeries = this.seriesList[index];
    this.imageCount = this.currentSeries.imageCount; // get total image count
    this.viewPort.resetImageCache(); // clean up image cache

    for (let i = 0; i < this.currentSeries.imageList.length; i++) {
      const imageData = this.currentSeries.imageList[i];
      this.viewPort.addImageData(imageData);
    }
  }

  /**
   * Image scroll methods
   */
  public nextImage() {
    if (this.viewPort.currentIndex < this.imageCount) {
      this.viewPort.nextImage();
    }
  }

  public previousImage() {
    if (this.viewPort.currentIndex > 0) {
      this.viewPort.previousImage();
    }
  }

  /**
   * Methods to activate/deactivate viewer tools
   */

  // deactivate all tools
  public resetAllTools() {
    if (this.imageCount > 0) {
      this.viewPort.resetAllTools()
      this.stopClip();
    }
  }

  // activate windowing
  public enableWindowing() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Wwwc', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
    }
  }

  // activate zoom
  public enableZoom() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Zoom', { mouseButtonMask: 1 }, ['Mouse']); // zoom left mouse
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
    }
  }

  // activate pan
  public enablePan() {
    if (this.imageCount > 0) {
      this.resetAllTools();
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 1 }, ['Mouse']);
    }
  }

  // activate image scroll
  public enableScroll() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'StackScroll', { mouseButtonMask: 1 }, ['Mouse']);
    }
  }

  public toggleScroll() {
    this.viewPort.toggleScroll();
  }

  // activate length measurement
  public enableLength() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Length', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.LastUpdatedElement = 'Length'
    }
  }
  // activate angle measurement
  public enableAngle() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Angle', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
    }
  }

  // activate pixel probe
  public enableProbe() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Probe', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
    }
  }

  // activate Elliptical ROI
  // from Sahmeer's branch: this method is used to download tool data (a new method name is not recognized in dicom-viewer.component.html)
  public saveToolState() {
    if (this.imageCount > 0) {
      var Rois = new Array("RectangleRoi", "Length");
      var toolArray = new Array()

      Rois.forEach(element => {
        var tooldata = cornerstoneTools.getToolState(this.element, element)
        if (tooldata != undefined) {
          toolArray.push(tooldata) 
        }
      });
    }
    
    this.download("Annotations", JSON.stringify(toolArray));
  }

  public enableElliptical() {
    var allPageArrays = new Array()
    this.loadedImages.forEach(element => {
      //allPageArrays.push(this.onePageReturn())
    });
    this.download("Annotations", JSON.stringify(allPageArrays));
  }

  // activate Rectangle ROI
  public enableRectangle() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'RectangleRoi', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.LastUpdatedElement = 'RectangleRoi';
    }
  }

  // Play Clip
  public playClip() {
    if (this.imageCount > 0) {
      let frameRate = 10;
      let stackState = cornerstoneTools.getToolState(this.element, 'stack');
      if (stackState) {
        frameRate = stackState.data[0].frameRate;
        // Play at a default 10 FPS if the framerate is not specified
        if (frameRate === undefined || frameRate === null || frameRate === 0) {
          frameRate = 10;
        }
      }
      cornerstoneTools.playClip(this.element, frameRate);
    }
  }

  // Stop Clip
  public stopClip() {
    cornerstoneTools.stopClip(this.element);
  }

  // invert image
  public invertImage() {
    if (this.imageCount > 0) {
      let viewport = cornerstone.getViewport(this.element);
      // Toggle invert
      viewport.invert = !viewport.invert;
      cornerstone.setViewport(this.element, viewport);
    }
  }

  // Undo Last Annotation
  public undoAnnotation() {

  }

  // reset image
  public resetImage() {
    if (confirm("Are you sure you want to reset all annotations?") == true) {
      if (this.imageCount > 0) {
        let toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);
        // Note that this only works on ImageId-specific tool state managers (for now)
        //toolStateManager.clear(this.element);
        cornerstoneTools.clearToolState(this.element, "Length");
        cornerstoneTools.clearToolState(this.element, "Angle");
        cornerstoneTools.clearToolState(this.element, "Probe");
        cornerstoneTools.clearToolState(this.element, "EllipticalRoi");
        cornerstoneTools.clearToolState(this.element, "RectangleRoi");
        cornerstone.updateImage(this.element);
        this.resetAllTools();
        this.viewPort.displayImage(this.viewPort.imageList[this.viewPort.currentIndex]);
      } 
    }
  }


  public clearImage() {
    this.viewPort.resetViewer();
    this.viewPort.resetImageCache();
    this.seriesList = []; // list of series on the images being displayed
    this.currentSeriesIndex = 0;
    this.currentSeries = {};
    this.imageCount = 0; // total image count being viewed
  }
}
