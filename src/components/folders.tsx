import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { folder } from "../models/folder";
import { FolderContext } from "../contexts/folderContext";

interface FoldersComponentProps {
  onFolderSelect: (id: string, title: string) => void;
}

export default function Folders({ onFolderSelect }: FoldersComponentProps) {
  type folders = {
    folders: folder[];
  };

  const folder = useContext(FolderContext);
  const [addFolderClicked, setAddFolderClicked] = useState(false);

  const getFolders = async () => {
    await axios
      .get<folders>("api/folders")
      .then((res) => {
        folder.setFolders([...res.data.folders]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addFolder = async () => {
    await axios
      .post<string>("api/folders", { name: "My new Folder" })
      .then(() => {
        getFolders();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (addFolderClicked) {
      addFolder();
      setAddFolderClicked(false);
    }
  }, [addFolderClicked]);

  useEffect(() => {
    getFolders();
  }, []);

  const onClickHandler = (folderId: string, folderTitle: string) => {
    onFolderSelect(folderId, folderTitle);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <h1 className="text-sm text-white60 font-semibold px-8">Folders</h1>
        <button
          onClick={() => {
            setAddFolderClicked(true);
          }}
          className="px-8"
        >
          <img src="./src/assets/images/AddFolder.png" alt="Add Folder" />
        </button>
      </div>
      <ul className="flex flex-col gap-y-2 overflow-y-scroll overscroll-contain">
        {folder.allFolders.map((item, index) => {
          return (
            <li
              onClick={() => {
                onClickHandler(item.id, item.name);
              }}
              key={item.id}
              className={`flex gap-x-2 px-8 ${
                index === 0 ? "bg-white3" : ""
              } py-1`}
            >
              <img
                src={
                  index === 0
                    ? "./src/assets/images/OpenedFolder.png"
                    : "./src/assets/images/Folder.png"
                }
                alt="folder icon"
              />
              <span
                className={`${
                  index === 0 ? "text-white" : "text-white60"
                } font-semibold`}
              >
                {item.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
