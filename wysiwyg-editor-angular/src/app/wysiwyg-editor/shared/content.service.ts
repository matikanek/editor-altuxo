import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private contentControl = new FormControl('');
  public onSelection = new Subject<HTMLElement>();

  public getContentControl(): FormControl {
    return this.contentControl;
  }

  public setContent(content: string): void {
    this.contentControl.setValue(content);
  }

  public getContent$(): Observable<string> {
    return this.contentControl.valueChanges;
  }
}