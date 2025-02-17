import { useState } from "react";
import MainSection from "./components/mainSection";
import MidSection from "./components/midSection";
import Sidebar from "./components/sidebar";
import { FoldersProvider } from "./contexts/folderContext";
import { ActiveFolderProvider } from "./contexts/activeFolderContext";
import { NotesProvider } from "./contexts/notesContext";
import { Route, Routes } from "react-router-dom";
import Folders from "./components/folders";
import Recents from "./components/recents";
import Folder from "./components/folder";

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
              <Route path="folder" element={<Folders />}>
                <Route path=":folderName/:folderId" element={<Folder />} />
              </Route>
              <Route
                path="notes"
                element={<Recents noteState={addNoteClicked} />}
              ></Route>
              <Route path="notes/:noteId" element={<MidSection />} />
            </Route>
          </Routes>
        </FoldersProvider>
      </ActiveFolderProvider>
    </NotesProvider>
  );
}

export default App;
