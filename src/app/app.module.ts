import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DicomViewerModule } from './dicom-viewer/dicom-viewer.module';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragdropDirective } from './dragdrop/dragdrop.directive';

@NgModule({
  declarations: [
    AppComponent,
    InfoDialogComponent,
    DragdropDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    DicomViewerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }