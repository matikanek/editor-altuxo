import { Component, OnInit } from '@angular/core';
import { ContentService } from '../shared/content.service';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FlatNode } from '../models/flat-node.model';
import { pairwise } from 'rxjs/internal/operators';


@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.css']
})
export class StructureComponent implements OnInit {
  html = document.createElement('HTMLElement');
  tree_data: FlatNode[] = [];
  prev_tree_data: FlatNode[] = [];
  prev_expanded_nodes: FlatNode[] = [];
  prev_currentElement: HTMLElement = {} as HTMLElement;
  currentElement: HTMLElement = {} as HTMLElement;
  listOfTags = ['table', 'tr', 'td', 'img', 'p'];
  dictionaryTagNames = {'TABLE': 'Table', 'TR': 'Row', 'TD': 'Col', 'IMG': 'Image', 'P': 'Paragraph'};
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  dataSource = new ArrayDataSource(this.tree_data);

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.contentService.getContent$().subscribe((content) => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(content, 'text/html');
      this.html = doc.body;
      this.initTree();
    });
    this.contentService.onSelection
      .pipe(pairwise())
      .subscribe(([prev, current]) => {
        this.prev_currentElement = prev;
        this.currentElement = current;
        this.prev_currentElement = this.deactivateSelectedCell(this.prev_currentElement);
        this.currentElement = this.activateSelectedCell(this.currentElement);
        while(current.parentElement != null && current.nodeName != 'BODY') {
          current = current.parentNode as HTMLElement;
        }
        this.html = current;
        this.initTree();
    });
  }

  deactivateSelectedCell(element: HTMLElement): HTMLElement {
    if(element != null && element.nodeName == 'TD') {
      element.style.backgroundColor = 'transparent';
      element.style.border = '1px solid #ccc';
    }
    return element;
  }

  activateSelectedCell(element: HTMLElement): HTMLElement {
    while(element.nodeName != 'TD' && element.nodeName != 'BODY') {
      element = element.parentNode as HTMLElement;
    }
    if(element.nodeName == 'TD') {
      element.style.backgroundColor = '#cce9ff';
      element.style.border = 'solid #5591cf';
    }
    return element;
  }

  initTree(): void {
    this.prev_tree_data = this.tree_data;
    this.getPrevExtendedNodes();
    this.tree_data = [];
    this.createTree(this.html);
    this.dataSource = new ArrayDataSource(this.tree_data);
  }

  getPrevExtendedNodes(): void {
    this.prev_expanded_nodes = [];
    for(let i=0; i<this.prev_tree_data.length; i++) {
      if(this.prev_tree_data[i].isExpanded) {
        this.prev_expanded_nodes.push(this.prev_tree_data[i]);
      }
    }
  }

  createTree(currentNode: HTMLElement): void {
    this.createFlatNodeItem(currentNode);
    if(currentNode.children.length != 0 ) {
      for(let i=0; i<currentNode.children.length; i++){
        this.createTree(currentNode.children[i] as HTMLElement);
      }
    }
    else {
      if(this.tree_data.length != 0) {
        this.tree_data[this.tree_data.length-1].expandable = false;
      }
      return; 
    }
  }

  createFlatNodeItem(currentNode: HTMLElement): void {
    if(this.listOfTags.includes(currentNode.nodeName.toLocaleLowerCase())){
      let flatNodeItem: FlatNode = {
        name: '', 
        level: 0, 
        locationVector: [] as number[], 
        isActive: false, 
        expandable: true, 
        isExpanded: false
      };
      flatNodeItem = this.itemSetName(flatNodeItem, currentNode);
      flatNodeItem = this.itemSetLevel(flatNodeItem, currentNode);
      flatNodeItem = this.itemSetlocationVector(flatNodeItem, currentNode);
      flatNodeItem = this.itemSetIsActive(flatNodeItem, currentNode);
      flatNodeItem = this.itemSetIsExpanded(flatNodeItem, currentNode);
      this.tree_data.push(flatNodeItem);
    }
  }

  itemSetName(flatNodeItem: FlatNode, node: HTMLElement): FlatNode {
    let name = '';
    name = node.nodeName == 'TABLE' ? this.dictionaryTagNames['TABLE'] : name;
    name = node.nodeName == 'TR' ? this.dictionaryTagNames['TR'] : name;
    name = node.nodeName == 'TD' ? this.dictionaryTagNames['TD'] : name;
    name = node.nodeName == 'IMG' ? this.dictionaryTagNames['IMG'] : name;
    name = node.nodeName == 'P' ? this.dictionaryTagNames['P'] : name;
    flatNodeItem.name = name;
    return flatNodeItem;
  }

  itemSetLevel(flatNodeItem: FlatNode, node: HTMLElement): FlatNode {
    let lvl = 0;
    while((node.parentNode as HTMLElement).nodeName != 'BODY'){
      if(this.listOfTags.includes((node.parentNode as HTMLElement).nodeName.toLocaleLowerCase())){
        lvl += 1;
      }
      node = node.parentNode as HTMLElement;
    }  
    flatNodeItem.level = lvl;
    return flatNodeItem;
  }

  itemSetlocationVector(flatNodeItem: FlatNode, node: HTMLElement): FlatNode {
    let vector = [] as number[];
    let order = 0;
    while(node.nodeName != 'BODY') {
      while(node.previousElementSibling != null) {
        order++;
        node = node.previousElementSibling as HTMLElement;
      }
      vector.push(order);
      order = 0;
      node = node.parentElement as HTMLElement;
    }
    flatNodeItem.locationVector = vector;
    return flatNodeItem;
  }

  itemSetIsActive(flatNodeItem: FlatNode, node: HTMLElement): FlatNode {
    while((node.parentNode as HTMLElement).nodeName != 'BODY' && node.nodeName != 'TD'){
      node = node.parentNode as HTMLElement;
    }
    if(node.style.backgroundColor == 'rgb(204, 233, 255)'){
      flatNodeItem.isActive = true;
    }
    else { flatNodeItem.isActive = false; }
    return flatNodeItem;
  }

  itemSetIsExpanded(flatNodeItem: FlatNode, node: HTMLElement): FlatNode {
    for(let i=0; i<this.prev_expanded_nodes.length; i++) {
      if(
        this.prev_expanded_nodes[i].name == flatNodeItem.name &&
        this.prev_expanded_nodes[i].level == flatNodeItem.level &&
        this.arrayEquals(this.prev_expanded_nodes[i].locationVector, flatNodeItem.locationVector)
      ) {
        flatNodeItem.isExpanded = true;
        break;
      }
    }
    return flatNodeItem;
  }

  arrayEquals(a: number[], b: number[]): boolean {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
  }

  clickOnTreeItem(flatNode: FlatNode): void {
    this.currentElement = this.findActiveElementInEditor();
    this.currentElement = this.deactivateSelectedCell(this.currentElement);
    this.prev_currentElement = this.currentElement;
    let selectedNodeToActivateInEditor = this.html;
    for(let i=flatNode.locationVector.length-1; i>=0; i--) {
      selectedNodeToActivateInEditor = selectedNodeToActivateInEditor.children[flatNode.locationVector[i]] as HTMLElement;
    }
    selectedNodeToActivateInEditor = this.activateSelectedCell(selectedNodeToActivateInEditor);
    this.currentElement = selectedNodeToActivateInEditor;
    this.contentService.setContent(this.html.outerHTML);
  }

  findActiveElementInEditor(): HTMLElement {
    let element: HTMLElement = {} as HTMLElement;
    let allNodeElementsInEditor = this.html.getElementsByTagName('*');
    for(let i=0; i<allNodeElementsInEditor.length; i++) {
      if((allNodeElementsInEditor[i] as HTMLElement).style.backgroundColor == 'rgb(204, 233, 255)' &&
        (allNodeElementsInEditor[i] as HTMLElement).style.border == 'solid rgb(85, 145, 207)') {
          element = allNodeElementsInEditor[i] as HTMLElement;
          break;
      }
    }
    return element;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getParentNode(node: FlatNode) {
    const nodeIndex = this.tree_data.indexOf(node);
    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (this.tree_data[i].level === node.level - 1) {
        return this.tree_data[i];
      }
    }
    return null;
  }

  shouldRender(node: FlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }
}
