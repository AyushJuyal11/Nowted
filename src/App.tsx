import { useState } from "react";
import MainSection from "./components/mainSection";
import MidSection from "./components/midSection";
import Sidebar from "./components/sidebar";
import { FoldersProvider } from "./contexts/folderContext";

type currFolder = {
  name: string;
  id: string;
};

function App() {
  const [currentFolder, setCurrentFolder] = useState<currFolder>({
    name: "",
    id: "",
  });

  const handleFolderSelect = (id: string, name: string) => {
    setCurrentFolder({ id, name });
  };

  return (
    <>
      <div className="h-full flex bg-main-black">
        <FoldersProvider>
          <Sidebar onFolderSelect={handleFolderSelect} />
          <MidSection folder={currentFolder} />
          <MainSection />
        </FoldersProvider>
      </div>
    </>
  );
}

export default App;
