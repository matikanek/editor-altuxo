import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructureComponent } from './structure/structure.component';
import { EditorComponent } from './editor/editor.component';
import { PropertiesComponent } from './properties/properties.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ColorSketchModule } from 'ngx-color/sketch';
import { NzInputModule } from 'ng-zorro-antd/input';

const components = [
  StructureComponent,
  EditorComponent,
  PropertiesComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    EditorModule,
    ReactiveFormsModule,
    FormsModule,
    CdkTreeModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    NzSelectModule,
    ColorSketchModule,
    NzInputModule
  ],
  exports: [
    ...components
  ]
})
export class WysiwygEditorModule { }
