import { useContext, useEffect, useState } from "react";
import { folder } from "../models/folder";
import { FolderContext } from "../contexts/folderContext";
import axiosApi from "../../axiosConfig";
import { ActiveFolderContext } from "../contexts/activeFolderContext";
import { NotesContext } from "../contexts/notesContext";

interface FoldersComponentProps {
  onFolderSelect: (id: string, title: string) => void;
}

export default function Folders({ onFolderSelect }: FoldersComponentProps) {
  type folders = {
    folders: folder[];
  };

  const notes = useContext(NotesContext);
  const activeFolder = useContext(ActiveFolderContext);
  const folder = useContext(FolderContext);
  const [addFolderClicked, setAddFolderClicked] = useState<boolean>(false);
  const [folderOptionsDiv, setFolderOptionsDiv] = useState<{
    display: string;
    x: number;
    y: number;
  }>({ display: "hidden", x: 0, y: 0 });

  const [deleteButtonClicked, setDeleteButtonClicked] =
    useState<boolean>(false);

  const getFolders = async () => {
    await axiosApi
      .get<folders>("/folders")
      .then((res) => {
        folder.setFolders([...res.data.folders]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addFolder = async () => {
    await axiosApi
      .post<string>("/folders", { name: "My new Folder" })
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

  useEffect(() => {
    activeFolder.setActiveFolder({
      activeFolderId: folder.allFolders[0]?.id,
      activeFolderName: folder.allFolders[0]?.name,
    });
    onFolderSelect(folder.allFolders[0]?.id, folder.allFolders[0]?.name);
  }, [folder.allFolders]);

  useEffect(() => {
    if (notes.noteDeleted) {
      activeFolder.setActiveFolder({
        activeFolderId: folder.allFolders[0]?.id,
        activeFolderName: folder.allFolders[0]?.name,
      });
      onFolderSelect(folder.allFolders[0]?.id, folder.allFolders[0]?.name);
      notes.setNoteDeleted(false);
    }
  }, [notes.noteDeleted]);

  useEffect(() => {
    async () => {
      if (deleteButtonClicked) {
        await axiosApi
          .delete(`/folders/${activeFolder.activeFolder.activeFolderId}`)
          .then(() => {
            getFolders();
          })
          .catch((err) => {
            console.error(err);
          });
      }
      setDeleteButtonClicked(false);
    };
  }, [deleteButtonClicked]);

  const onClickHandler = (folderId: string, folderTitle: string) => {
    activeFolder.setActiveFolder({
      activeFolderId: folderId,
      activeFolderName: folderTitle,
    });
    onFolderSelect(folderId, folderTitle);
  };

  const onFolderOptionsClickHandler = (
    e: React.MouseEvent<HTMLImageElement>
  ) => {
    e.stopPropagation();
    setFolderOptionsDiv({
      display: folderOptionsDiv.display === "block" ? "hidden" : "block",
      x: e.clientX - 80,
      y: e.clientY + 10,
    });
  };

  const deleteButtonClickHandler = () => {
    setDeleteButtonClicked(true);
  };

  return (
    <div className="flex flex-col gap-y-4 h-[40%]">
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
      <ul className="flex flex-col gap-y-2 overflow-auto">
        {folder.allFolders.map((item) => {
          return (
            <li
              onClick={() => {
                onClickHandler(item.id, item.name);
              }}
              key={item.id}
              className={`flex gap-x-2 px-8 ${
                activeFolder.activeFolder.activeFolderId === item.id
                  ? "bg-white3"
                  : ""
              } py-1`}
            >
              <img
                src={
                  activeFolder.activeFolder.activeFolderId === item.id
                    ? "./src/assets/images/OpenedFolder.png"
                    : "./src/assets/images/Folder.png"
                }
                alt="folder icon"
              />
              <span
                className={`${
                  activeFolder.activeFolder.activeFolderId === item.id
                    ? "text-white"
                    : "text-white60"
                } font-semibold grow`}
              >
                {item.name}
              </span>
              <img
                onClick={onFolderOptionsClickHandler}
                className="self-end size-fit"
                src="./src/assets/images/FolderOptions.png"
                alt="three dots"
              />
              <div
                className={`absolute ${folderOptionsDiv.display} bg-white3 rounded-md px-3 py-3`}
                style={{ top: folderOptionsDiv.y, left: folderOptionsDiv.x }}
              >
                <ul className="flex flex-col gap-y-2 list-none">
                  <li onClick={deleteButtonClickHandler}>Delete</li>
                  <li>Rename</li>
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
