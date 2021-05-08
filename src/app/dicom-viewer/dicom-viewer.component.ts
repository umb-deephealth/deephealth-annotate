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
  
  @ViewChild(CornerstoneDirective, { static: true }) viewPort: CornerstoneDirective; // the main cornerstone viewport
  @ViewChildren(ThumbnailDirective) thumbnails: Array<ThumbnailDirective>;

  @Input() public enableViewerTools = false; // enable viewer tools
  @Input() public enablePlayTools = false;   // enable Play Clip tools
  @Input() public downloadImagesURL = ''     // download images URL
  @Input() public maxImagesToLoad = 9999999; // limit for the automatic loading of study images

  public seriesList = []; // list of series on the images being displayed
  public currentSeriesIndex = 0;
  public currentSeries: any = {};
  public imageCount = 0; // total image count being viewed

  private loadedImages = [];
  private imageIdList = [];
  private element: any;
  private targetImageCount = 0;
  public loadingImages = false;

  private annotationsList = []; // keep track of all tools/annotations used
  private toolList = ["Pan", "Zoom", "Wwwc", "RectangleRoi", "Length"];
  private selectedTool = '';


  constructor() { }


  ngOnInit() {
    this.element = this.viewPort.element;
  }
  

  // control message for more images to load
  public get moreImagestoLoad(): string {
    if (this.loadedImages.length < this.imageIdList.length && !this.loadingImages) { // are there any more images to load?
      const imagesToLoad = (this.maxImagesToLoad <= 0) ? (this.imageIdList.length - this.loadedImages.length) : Math.min(this.maxImagesToLoad, this.imageIdList.length - this.loadedImages.length);
      return imagesToLoad.toString();
    } else return '';
  }


  // control display of a loading images progress indicator
  public get showProgress(): any { return { display: (this.loadingImages) ? 'inline' : 'none' } };


  // control styling of a button for a tool that can be selected
  public showSelectedTool(tool: string): any { 
    if (tool == this.selectedTool) { 
      return { 'color': 'rgb(211, 34, 81)', 'border': 'inset 2px', 'border-color': 'whitesmoke', 'background-color': '#343434' }; 
    } 
    else {
      return { 'color': 'white', 'border-color': '#888888' };
    }
  };


  // control styling of the StackScroll toggle button
  public get showButtonToggleEnabled(): any { 
    if (this.viewPort.isScrollEnabled) { 
      return { 'color': 'rgb(211, 34, 81)', 'border': 'inset 2px', 'border-color': 'whitesmoke', 'background-color': '#343434' }; 
    } 
    else {
      return { 'color': 'white', 'border-color': '#888888' };
    }
  };


  // control styling of the Play/Stop button
  public get showPlayStop(): any { 
    if (this.viewPort.isClipPlaying) { 
      return { 'border-color': 'whitesmoke', 'border-style': 'inset 2px' }; 
    } 
    else {
      return { 'color': 'white', 'border-color': '#888888' };
    }
  };


  /**
   * Load dicom images for display
   *
   * @param imageIdList list of imageIds to load and display
   */
  loadStudyImages(imageIdList: Array<any>) {
    this.element = this.viewPort.element;
    this.imageIdList = imageIdList;
    this.viewPort.resetViewer();
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


  /**
   *
   * @param imageData the dicom image data
   */
  private imageLoaded(imageData) {
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

    this.enablePan();
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
    if (this.imageCount > 1 && this.viewPort.currentIndex < this.imageCount && !this.viewPort.isClipPlaying) {
      this.viewPort.nextImage();
    }
  }


  public previousImage() {
    if (this.viewPort.currentIndex > 0 && !this.viewPort.isClipPlaying) {
      this.viewPort.previousImage();
    }
  }


  /**
   * Methods to activate/deactivate viewer tools
   */
  // deactivate all tools
  public resetAllTools() {
    if (this.imageCount > 0) {
      this.selectedTool = this.toolList[0];
      this.viewPort.resetAllTools();
      if (this.viewPort.isClipPlaying) {
        this.stopClip();
      }
    }
  }


  // activate windowing
  public enableWindowing() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Wwwc', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.selectedTool = this.toolList[2];
    }
  }


  // activate zoom
  public enableZoom() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Zoom', { mouseButtonMask: 1 }, ['Mouse']); // zoom left mouse
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.selectedTool = this.toolList[1];
    }
  }


  // activate pan
  public enablePan() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.selectedTool = this.toolList[0];
    }
  }


  // activate image scroll
  public enableScroll() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'StackScroll', { mouseButtonMask: 1 }, ['Mouse']);
    }
  }


  public toggleScroll() {
    if (!this.viewPort.isClipPlaying) {
      this.viewPort.toggleScroll();
    }
  }


  // activate length measurement
  public enableLength() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'Length', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.annotationsList.push('Length');
      this.selectedTool = this.toolList[4];
    }
  }


  // Download data as a .json file
  public download(filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


  // save tool states - download annotation data for all images
  public saveToolState() {
    let exportArray = [];

    // Save viewer state to restore later
    let lastSeriesSeen = this.currentSeriesIndex;
    let lastCurrentImageIndex = this.viewPort.currentIndex;
    
    for (let i = 0; i < this.seriesList.length; ++i) {

      this.showSeries(i);

      for (let image of this.seriesList[i].imageList) {
        
        let getter = cornerstoneTools.getElementToolStateManager(this.element).get;
        let lengthToolData = getter(this.element, 'Length');
        let rectangleRoiToolData = getter(this.element, 'RectangleRoi');

        let imageAnnotations = {
          studyID: image.data.string('x0020000d'),
          seriesID: image.data.string('x0020000e'),
          SOPInstanceUID: image.data.string('x00080018'),
          annotations: {
            lengthData: lengthToolData,
            rectangleData: rectangleRoiToolData
          }
        }

        if (!lengthToolData)       imageAnnotations.annotations.lengthData = "null"
        if (!rectangleRoiToolData) imageAnnotations.annotations.rectangleData = "null"

        if (lengthToolData || rectangleRoiToolData) {
          exportArray.push(imageAnnotations);
        }

        this.nextImage();
      }

    }

    // Restore viewer state after iterating through images
    this.showSeries(lastSeriesSeen);

    while (this.viewPort.currentIndex < lastCurrentImageIndex) {
      this.viewPort.nextImage();
    }

    this.download("annotations", JSON.stringify(exportArray));
  }


  // activate Rectangle ROI
  public enableRectangle() {
    if (this.imageCount > 0) {
      cornerstoneTools.setToolActiveForElement(this.element, 'RectangleRoi', { mouseButtonMask: 1 }, ['Mouse']);
      cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 2 }, ['Mouse']); // pan right mouse
      this.annotationsList.push('RectangleRoi');
      this.selectedTool = this.toolList[3];
    }
  }


  // Toggle clip playing
  public togglePlay() {
    if (this.viewPort.isClipPlaying) {
      this.stopClip();
    }
    else {
      this.playClip();
    }
  }

  
  // Play Clip
  public playClip() {
    if (this.imageCount > 0) {
      if (this.viewPort.isScrollEnabled) {
        this.viewPort.toggleScroll(); // Important to not change image while clip playing
      }
      let frameRate = 10;
      let stackState = cornerstoneTools.getToolState(this.element, 'stack');
      if (stackState) {
        frameRate = stackState.data[0].frameRate;
        // Play at a default 10 FPS if the framerate is not specified
        if (frameRate === undefined || frameRate === null || frameRate === 0) {
          frameRate = 10;
        }
      }
      this.viewPort.togglePlayClip();
      cornerstoneTools.playClip(this.element, frameRate);
    }
  }


  // Stop Clip
  public stopClip() {
    this.viewPort.togglePlayClip();
    cornerstoneTools.stopClip(this.element);
    this.viewPort.refreshImage();
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
  /*
  This method currently removes all annotations from the last used tool. 
  Example: if the user used the Length tool twice, followed by the RectangleROI tool twice, and then 
  clicks "Undo", this method will clear both of the rectangle annotations. If the user clicks undo again,
  this method will clear both of the length annotations.
  */
  public undoAnnotation() {
    let popped = this.annotationsList.pop();
    cornerstoneTools.clearToolState(this.element, popped);
    this.viewPort.displayImage(this.viewPort.imageList[this.viewPort.currentIndex]);
  }


  // reset image
  public resetImage() {
    if (confirm("Are you sure you want to reset all annotations?") == true) {
      if (this.imageCount > 0) {
        cornerstoneTools.clearToolState(this.element, "Length");
        cornerstoneTools.clearToolState(this.element, "Angle");
        cornerstoneTools.clearToolState(this.element, "Probe");
        cornerstoneTools.clearToolState(this.element, "EllipticalRoi");
        cornerstoneTools.clearToolState(this.element, "RectangleRoi");

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
