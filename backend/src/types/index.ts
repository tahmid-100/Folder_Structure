import { Document, Types } from 'mongoose';

export interface IFolder extends Document {
  _id: Types.ObjectId;
  name: string;
  parent: Types.ObjectId | null;
  isRoot: boolean;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFolderRequest {
  name: string;
  parentId: string | null;
}

export interface FolderResponse {
  _id: string;
  name: string;
  parent: string | null;
  isRoot: boolean;
  path: string;
  createdAt: string;
  updatedAt: string;
}