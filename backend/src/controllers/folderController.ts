import type { Request, Response } from 'express';
import Folder from '../models/Folder.js';
import { buildFolderTree, deleteFolderRecursively } from '../utils/treeUtils.js';
import type { IFolder, CreateFolderRequest, FolderResponse } from '../types';

export const getFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const folders = await Folder.find().sort({ path: 1 });
    
    // Return flat list for frontend to build tree
    const folderResponses: FolderResponse[] = folders.map(folder => ({
      _id: folder._id.toString(),
      name: folder.name,
      parent: folder.parent ? folder.parent.toString() : null,
      isRoot: folder.isRoot,
      path: folder.path,
      createdAt: folder.createdAt.toISOString(),
      updatedAt: folder.updatedAt.toISOString()
    }));
    
    res.status(200).json(folderResponses);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Server error while fetching folders' });
  }
};

export const getFolderTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const folders = await Folder.find().sort({ path: 1 });
    const folderTree = buildFolderTree(folders);
    
    res.status(200).json(folderTree);
  } catch (error) {
    console.error('Error building folder tree:', error);
    res.status(500).json({ message: 'Server error while building folder tree' });
  }
};

export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, parentId }: CreateFolderRequest = req.body;
    
    if (!name || name.trim() === '') {
      res.status(400).json({ message: 'Folder name is required' });
      return;
    }
    
    // Check if parent exists if parentId is provided
    if (parentId) {
      const parentFolder = await Folder.findById(parentId);
      if (!parentFolder) {
        res.status(404).json({ message: 'Parent folder not found' });
        return;
      }
    }
    
    // Check if folder with same name already exists in the same parent
    const existingFolder = await Folder.findOne({ 
      name, 
      parent: parentId || null 
    });
    
    if (existingFolder) {
      res.status(409).json({ message: 'Folder with this name already exists in this location' });
      return;
    }
    
    const newFolder = new Folder({
      name: name.trim(),
      parent: parentId || null
    });
    
    await newFolder.save();
    
    const response: FolderResponse = {
      _id: newFolder._id.toString(),
      name: newFolder.name,
      parent: newFolder.parent ? newFolder.parent.toString() : null,
      isRoot: newFolder.isRoot,
      path: newFolder.path,
      createdAt: newFolder.createdAt.toISOString(),
      updatedAt: newFolder.updatedAt.toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ message: 'Server error while creating folder' });
  }
};

export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const folder = await Folder.findById(id);
    
    if (!folder) {
      res.status(404).json({ message: 'Folder not found' });
      return;
    }
    
    if (folder.isRoot) {
      res.status(400).json({ message: 'Cannot delete root folder' });
      return;
    }
    
  
if (!id) {
  res.status(400).json({ message: 'Folder ID is required' });
  return;
}
 await deleteFolderRecursively(id, Folder);

    
    res.status(200).json({ message: 'Folder and its contents deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Server error while deleting folder' });
  }
};