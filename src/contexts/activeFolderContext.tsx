import { createContext, useState } from "react";

interface activeFolder {
  activeFolderId: string;
  activeFolderName: string;
}

interface activeFolderType {
  activeFolder: activeFolder;
  setActiveFolder: React.Dispatch<React.SetStateAction<activeFolder>>;
}

export const ActiveFolderContext = createContext<activeFolderType>(
  {} as activeFolderType
);

export const ActiveFolderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeFolder, setActiveFolder] = useState<activeFolder>(
    {} as activeFolder
  );
  return (
    <ActiveFolderContext.Provider value={{ activeFolder, setActiveFolder }}>
      {children}
    </ActiveFolderContext.Provider>
  );
};
