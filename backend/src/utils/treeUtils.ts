import type { IFolder } from '../types';

export const buildFolderTree = (folders: IFolder[]): any[] => {
  const folderMap = new Map();
  const roots: any[] = [];
  
  // Create a map of all folders
  folders.forEach(folder => {
    folderMap.set(folder._id.toString(), { 
      ...folder.toObject(), 
      children: [] 
    });
  });
  
  // Build the tree structure
  folders.forEach(folder => {
    const folderObj = folderMap.get(folder._id.toString());
    
    if (folder.parent) {
      const parent = folderMap.get(folder.parent.toString());
      if (parent) {
        parent.children.push(folderObj);
      }
    } else {
      roots.push(folderObj);
    }
  });
  
  return roots;
};

export const deleteFolderRecursively = async (folderId: string, FolderModel: any): Promise<void> => {
  const children = await FolderModel.find({ parent: folderId });
  
  for (const child of children) {
    await deleteFolderRecursively(child._id, FolderModel);
  }
  
  await FolderModel.findByIdAndDelete(folderId);
};