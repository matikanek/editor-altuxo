export interface FlatNode {
  name: string;
  level: number;
  locationVector: number[];
  isActive: boolean
  expandable: boolean;
  isExpanded: boolean;
}