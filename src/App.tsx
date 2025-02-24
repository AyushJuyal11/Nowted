import { ActiveFolderProvider } from "./contexts/activeFolderContext";
import { NotesProvider } from "./contexts/notesContext";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
import MidSection from "./components/midSection";
import MainSection from "./components/mainSection";
import { ToastContainer } from "react-toastify";
import Folders from "./components/folders";

function App() {
  return (
    <NotesProvider>
      <ActiveFolderProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-full flex bg-main-black">
                <Sidebar />
                <MidSection />
                <MainSection />
              </div>
            }
          >
            <Route path="folders" element={<Folders />} />
            <Route path="notes/:noteId" element={<MidSection />} />
            <Route path="more" element={<MidSection />} />
            <Route path="notes/noteAdded" element={<MidSection />} />
            <Route path="noteDeleted/:noteId" element={<MidSection />} />
            <Route path="noteRestored/:noteId" element={<MidSection />} />
            <Route path="folders/renamed" element={<Sidebar />} />
            <Route path="folders/deleted" element={<Sidebar />} />
            <Route path="noteUpdated/:noteId" element={<Sidebar />} />
            <Route path="more/:noteId" element={<MainSection />} />
            <Route path="notes" element={<MidSection />} />
          </Route>
        </Routes>
      </ActiveFolderProvider>
    </NotesProvider>
  );
}

export default App;
