import express from 'express';
import {
  getFolders,
  getFolderTree,
  createFolder,
  deleteFolder
} from '../controllers/folderController.js';

const router = express.Router();

// GET /api/folders - Get all folders as flat list
router.get('/', getFolders);

// GET /api/folders/tree - Get folders as hierarchical tree
router.get('/tree', getFolderTree);

// POST /api/folders - Create a new folder
router.post('/', createFolder);

// DELETE /api/folders/:id - Delete a folder and its contents
router.delete('/:id', deleteFolder);

export default router;