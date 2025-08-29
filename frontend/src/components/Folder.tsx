import React, { useState } from 'react';
import { FolderTree } from '../types';
import { folderAPI } from '../services/api';

interface FolderProps {
  folder: FolderTree;
  onFolderUpdate: () => void;
  level: number;
}

const FolderComponent: React.FC<FolderProps> = ({ folder, onFolderUpdate, level }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    try {
      await folderAPI.createFolder(newFolderName, folder._id);
      setNewFolderName('');
      setIsAdding(false);
      onFolderUpdate();
      if (!isExpanded) setIsExpanded(true);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };
  
  const handleDeleteFolder = async () => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}" and all its contents?`)) {
      try {
        await folderAPI.deleteFolder(folder._id);
        onFolderUpdate();
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  return (
    <div className="folder-item" style={{ marginLeft: `${level * 20}px` }}>
      <div className="folder-header">
        <button className="toggle-btn" onClick={toggleExpand}>
          {folder.children.length > 0 ? (isExpanded ? '▼' : '►') : '•'}
        </button>
        <span className="folder-name">{folder.name}</span>
        <button className="action-btn" onClick={() => setIsAdding(true)}>+</button>
        {!folder.isRoot && (
          <button className="action-btn delete" onClick={handleDeleteFolder}>
            ×
          </button>
        )}
      </div>
      
      {isAdding && (
        <form className="add-folder-form" onSubmit={handleAddFolder}>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            autoFocus
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </form>
      )}
      
      {isExpanded && folder.children.length > 0 && (
        <div className="children-container">
          {folder.children.map((child) => (
            <FolderComponent
              key={child._id}
              folder={child}
              onFolderUpdate={onFolderUpdate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderComponent;