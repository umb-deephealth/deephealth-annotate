import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component'
import { DICOMViewerComponent } from './dicom-viewer/dicom-viewer.component';
import hotkeys from 'hotkeys-js';


declare const cornerstone;
declare const cornerstoneWADOImageLoader;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(DICOMViewerComponent, { static: true }) viewPort: DICOMViewerComponent;


  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    // Initialize the cornerstoneWADOImageLoaderCodecs
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
        webWorkerPath: './assets/cornerstone/webworkers/cornerstoneWADOImageLoaderWebWorker.js',
        taskConfiguration: {
            'decodeTask': {
                codecsPath: '../codecs/cornerstoneWADOImageLoaderCodecs.js'
            }
        }
    });

    // Setup all Keyboard Shortcuts here
    hotkeys('p,z,w,i,r,l,alt+enter,u,esc,left,right,up,down,/,s', function(event, handler){
      event.preventDefault();
      document.getElementById("viewer").focus();
      switch(handler.key) {
        case 'p':
          document.getElementById('pan_bttn').click();
          break;
        case 'z':
          document.getElementById('zoom_bttn').click();
          break;
        case 'w':
          document.getElementById('windowing_bttn').click();
          break;
        case 'i':
          document.getElementById('invert_bttn').click();
          break;
        case 'r':
          document.getElementById('rectangleroi_bttn').click();
          break;
        case 'l': 
          document.getElementById('length_bttn').click();
          break;
        case 'alt+enter':
          document.getElementById('export_bttn').click();
          break;
        case 'u':
          document.getElementById('undo_bttn').click();
          break;
        case 'esc':
          document.getElementById('reset_bttn').click();
          break;
        case 'left':
        case 'up':
          document.getElementById('previous_image_bttn').click();
          break;
        case 'right':
        case 'down':
          document.getElementById('next_image_bttn').click();
          break;
        case '/':
          document.getElementById('play_bttn').click();
          break;
        case 's':
          document.getElementById('stackscroll_bttn').click();
          break;
      }
    });
  }


  ngAfterViewChecked(): void {
    document.documentElement.focus();
  }


  openDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      panelClass: 'custom-modalbox',
      autoFocus: false
    });
    
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }


  // File drag & drop handler, event contains a FileList
  onFileDropped(event) {
    let fileType = event[0].type;
    let fileList: Array<File> = Array.from(event);
    let file: File = fileList[0];

    if (fileList.length == 1 && fileType == 'application/json') {
      this.viewPort.loadToolState(event);
    }
    else {
      this.loadDICOMImages(event);
    }
  }


  /**
   * Load selected DICOM images
   *
   * @param files list of selected dicom files
   */
  loadDICOMImages(files: FileList) {
    if (files && files.length > 0) {
      const imageList = [];
      const fileList: Array<File> = Array.from(files);
      fileList.sort((a, b) => {
        if ( a.name > b.name ) { return 1; }
        if ( b.name > a.name ) { return -1; }
        return 0;
      });
      cornerstoneWADOImageLoader.wadouri.dataSetCacheManager.purge();

      // loop thru the File list and build a list of wadouri imageIds (dicomfile:)
      for (let i = 0; i < fileList.length; i++) {
        const dicomFile: File = fileList[i];
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(dicomFile);
        imageList.push(imageId);
      }

      this.viewPort.resetAllTools();

      // now load all Images, using their wadouri
      this.viewPort.loadStudyImages(imageList);

    } else { alert('Choose DICOM images to display.'); }
  }
}
