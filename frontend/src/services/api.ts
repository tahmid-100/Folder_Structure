import axios from 'axios';
import { Folder } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL!;

export const folderAPI = {
  getFolders: (): Promise<{ data: Folder[] }> => 
    axios.get(`${API_BASE_URL}/folders`),
  
  createFolder: (name: string, parentId: string | null): Promise<{ data: Folder }> => 
    axios.post(`${API_BASE_URL}/folders`, { name, parentId }),
  
  deleteFolder: (id: string): Promise<{ data: { message: string } }> => 
    axios.delete(`${API_BASE_URL}/folders/${id}`)
};