export interface Folder {
  _id: string;
  name: string;
  parent: string | null;
  isRoot: boolean;
  children?: Folder[];
}

export interface FolderTree extends Folder {
  children: FolderTree[];
}