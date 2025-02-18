import { FoldersProvider } from "./contexts/folderContext";
import { ActiveFolderProvider } from "./contexts/activeFolderContext";
import { NotesProvider } from "./contexts/notesContext";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import MidSection from "./components/midSection";
import MainSection from "./components/mainSection";
import { useState } from "react";

function App() {
  const [addNoteClicked, setAddNoteClicked] = useState(false);

  return (
    <NotesProvider>
      <ActiveFolderProvider>
        <FoldersProvider>
          <Routes>
            <Route
              path="/"
              element={
                <div className="h-full flex bg-main-black">
                  <Sidebar
                    addNoteClicked={addNoteClicked}
                    setAddNoteClicked={setAddNoteClicked}
                  />
                  <MidSection />
                  <MainSection />
                </div>
              }
            >
              <Route
                path="folders"
                element={
                  <Sidebar
                    addNoteClicked={addNoteClicked}
                    setAddNoteClicked={setAddNoteClicked}
                  />
                }
              />
              <Route path="notes/:noteId" element={<MidSection />} />
              <Route path="more" element={<MidSection />} />
            </Route>
          </Routes>
        </FoldersProvider>
      </ActiveFolderProvider>
    </NotesProvider>
  );
}

export default App;
