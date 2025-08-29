import React, { useState, useEffect } from 'react';
import FolderComponent from './Folder';
import { folderAPI } from '../services/api';
import { Folder, FolderTree } from '../types';

const FolderStructure: React.FC = () => {
  const [folders, setFolders] = useState<FolderTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await folderAPI.getFolders();
      const foldersData: Folder[] = response.data;
      
      // Convert flat list to tree structure
      const buildTree = (parentId: string | null): FolderTree[] => {
        return foldersData
          .filter(folder => folder.parent === parentId)
          .map(folder => ({
            ...folder,
            children: buildTree(folder._id)
          }));
      };
      
      setFolders(buildTree(null));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setLoading(false);
    }
  };

  const handleAddRootFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    try {
      await folderAPI.createFolder(newFolderName, null);
      setNewFolderName('');
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  if (loading) return <div>Loading folders...</div>;

  return (
    <div className="folder-structure">
      <h2>Folder Structure</h2>
      
      <form className="add-root-folder" onSubmit={handleAddRootFolder}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New root folder name"
        />
        <button type="submit">Add Root Folder</button>
      </form>
      
      <div className="folders-container">
        {folders.map(folder => (
          <FolderComponent
            key={folder._id}
            folder={folder}
            onFolderUpdate={fetchFolders}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderStructure;