import { createContext, useState } from "react";
import { folder } from "../models/folder";

interface foldersType {
  allFolders: folder[];
  setFolders: React.Dispatch<React.SetStateAction<folder[]>>;
}

export const FolderContext = createContext<foldersType>({} as foldersType);

export const FoldersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [allFolders, setFolders] = useState<folder[]>([]);
  return (
    <FolderContext.Provider value={{ allFolders, setFolders }}>
      {children}
    </FolderContext.Provider>
  );
};
