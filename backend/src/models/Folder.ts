import mongoose, { Schema, Model } from 'mongoose';
import type { IFolder } from '../types';

const FolderSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  isRoot: {
    type: Boolean,
    default: false
  },
  path: {
    type: String,
    // required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
FolderSchema.index({ parent: 1 });
FolderSchema.index({ path: 1 });

// Pre-save middleware to set path and isRoot
FolderSchema.pre('save', async function(next) {
  const folder = this as unknown as {
    isNew: boolean;
    parent: mongoose.Types.ObjectId | null;
    isRoot: boolean;
    path: string;
    name: string;
  };
  
  console.log('Pre-save middleware running for folder:', folder.name);
  console.log('Folder isNew:', folder.isNew);
  console.log('Folder parent:', folder.parent);
  
  if (folder.isNew) {
    if (!folder.parent) {
      folder.isRoot = true;
      folder.path = folder.name;
      console.log('Setting as root folder with path:', folder.path);
    } else {
      folder.isRoot = false;
      try {
        // Use the model after it's been compiled
        const FolderModel = mongoose.model('Folder');
        const parentFolder = await FolderModel.findById(folder.parent);
        if (parentFolder) {
          const parent = parentFolder as unknown as { path: string };
          folder.path = `${parent.path}/${folder.name}`;
          console.log('Setting as child folder with path:', folder.path);
        } else {
          // If parent doesn't exist, treat it as a root folder
          folder.isRoot = true;
          folder.path = folder.name;
          console.log('Parent not found, setting as root folder with path:', folder.path);
        }
      } catch (error) {
        console.error('Error finding parent folder:', error);
        // If model lookup fails, treat as root folder
        folder.isRoot = true;
        folder.path = folder.name;
        console.log('Model lookup failed, setting as root folder with path:', folder.path);
      }
    }
  }
  
  console.log('Final folder path:', folder.path);
  next();
});

const Folder: Model<IFolder> = mongoose.model<IFolder>('Folder', FolderSchema);

export default Folder;