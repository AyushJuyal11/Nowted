import { useState } from "react";
import MainSection from "./components/mainSection";
import MidSection from "./components/midSection";
import Sidebar from "./components/sidebar";
import { FoldersProvider } from "./contexts/folderContext";
import { ActiveFolderProvider } from "./contexts/activeFolderContext";
import { NotesProvider } from "./contexts/notesContext";
import { Route, Routes } from "react-router-dom";

type currFolder = {
  name: string;
  id: string;
};

type currentNote = {
  id: string;
};

function App() {
  const [currentFolder, setCurrentFolder] = useState<currFolder>({
    name: "",
    id: "",
  });

  const [currentNote, setCurrentNote] = useState<currentNote>({ id: "" });

  const handleFolderSelect = (id: string, name: string) => {
    setCurrentFolder({ id, name });
  };

  const handleNoteSelect = (id: string) => {
    setCurrentNote({ id: id });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-full flex bg-main-black">
            <NotesProvider>
              <ActiveFolderProvider>
                <FoldersProvider>
                  <Sidebar
                    onNoteSelect={handleNoteSelect}
                    onFolderSelect={handleFolderSelect}
                  />
                  <MidSection
                    folder={currentFolder}
                    onNoteSelect={handleNoteSelect}
                  />
                  <MainSection note={currentNote} />
                </FoldersProvider>
              </ActiveFolderProvider>
            </NotesProvider>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
