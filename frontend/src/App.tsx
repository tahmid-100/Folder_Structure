import React from 'react';
import FolderStructure from './components/FolderStructure';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Folder Structure Viewer</h1>
      </header>
      <main>
        <FolderStructure />
      </main>
    </div>
  );
};

export default App;