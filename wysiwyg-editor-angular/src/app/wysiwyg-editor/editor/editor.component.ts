import { Component } from '@angular/core';
import { ContentService } from '../shared/content.service';
//import {  } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  contentControl = this.contentService.getContentControl();
  activeField: HTMLElement = {} as HTMLElement;

  constructor(private contentService: ContentService) { }

  onChange(event: any): void {
    this.contentService.onSelection.next(event.editor.selection.getNode());
    this.deactivateAllSelectedCells(event);
    this.activateSelectedCell(event);
  }
  
  deactivateAllSelectedCells(event: any): void {
    let element = this.activeField as HTMLElement;
    if(this.activeField != null && element.nodeName == 'TD'){
      event.editor.dom.setStyle(this.activeField, 'background-color', 'transparent');
      event.editor.dom.setStyle(this.activeField, 'border', '1px solid #ccc');
    }
  }

  activateSelectedCell(event: any) {
    this.activeField = event.editor.selection.getNode();
    if(this.activeField != event.editor.getBody()){
      let element = this.activeField as any;
      while(element.nodeName != 'TD' && element.nodeName != 'BODY') {
        this.activeField = element.parentNode;
        element = element.parentNode;
      }
      if(element.nodeName == 'TD') {
        event.editor.dom.setStyle(this.activeField, 'background-color', '#cce9ff');
        event.editor.dom.setStyle(this.activeField, 'border', 'solid #5591cf');
      }
    }
  }
  
}
