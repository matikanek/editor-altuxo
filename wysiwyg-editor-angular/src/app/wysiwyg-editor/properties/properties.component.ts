import { Component, OnInit } from '@angular/core';
import { ColorEvent } from 'ngx-color';
import { ContentService } from '../shared/content.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  currentElement: HTMLElement = {} as HTMLElement;
  currentElementExist: boolean = false;
  availableSizes = ['10px', '12px', '14px', '16px', '18px', '20px'];
  currentElementSize = '';
  availableWeights = ['200', '300', '400', '500', '600', '700'];
  currentElementWeight = '';
  currentElementColor = '';
  availableFonts = ['Arial', 'Courier', 'Georgia', 'fantasy'];
  currentElementFont = '';
  isImage: boolean = false;
  urlImage = '';
  urlXCoord: number = 0;
  urlYCoord: number = 0;
  urlWidth: number = 0;
  urlHeight: number = 0;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.onSelection.subscribe((element)=>{
      this.currentElementExist = true;
      this.currentElement = element;
      if(this.currentElement.nodeName != 'IMG') {
        this.isImage = false;
        this.currentElementFont = window.getComputedStyle(element, null).getPropertyValue('font-family');
        this.currentElementSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        this.currentElementWeight = window.getComputedStyle(element, null).getPropertyValue('font-weight');
        this.currentElementColor = window.getComputedStyle(element, null).getPropertyValue('color');
      }
      else {
        this.isImage = true;
        this.urlImage = (this.currentElement as any).src;
        this.urlXCoord = Math.round(this.currentElement.getBoundingClientRect().x);
        this.urlYCoord = Math.round(this.currentElement.getBoundingClientRect().y);
        this.urlWidth = Math.round(this.currentElement.getBoundingClientRect().width);
        this.urlHeight = Math.round(this.currentElement.getBoundingClientRect().height);
      }
    });
  }

  changeFont(font: string): void {
    this.currentElement.style.fontFamily = font;
  }

  changeSize(size: string): void {
    this.currentElement.style.fontSize = size;
  }

  changeWeight(weight: string): void {
    this.currentElement.style.fontWeight = weight;
  }

  changeColor(event: ColorEvent): void {
    this.currentElement.style.color = event.color.hex;
  }

  changeImageWidth(width: number): void {
    (this.currentElement as HTMLImageElement).width = width;
  }

  changeImageHeight(height: number): void {
    (this.currentElement as HTMLImageElement).height = height;
  }
}
