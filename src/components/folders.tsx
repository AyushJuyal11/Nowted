import { useContext, useEffect, useState } from "react";
import { folder } from "../models/folder";
import { FolderContext } from "../contexts/folderContext";
import axiosApi from "../../axiosConfig";
import { ActiveFolderContext } from "../contexts/activeFolderContext";
import { NotesContext } from "../contexts/notesContext";
import Folder from "./folder";
import { useNavigate } from "react-router-dom";
import useQueryParams from "../customHooks/UseQueryParams";

export default function Folders() {
  type folders = {
    folders: folder[];
  };

  const notes = useContext(NotesContext);
  const activeFolder = useContext(ActiveFolderContext);
  const folder = useContext(FolderContext);
  const [addFolderClicked, setAddFolderClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  const { folderId } = useQueryParams();

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
    if (location.pathname.includes("folders/deleted")) getFolders();
  }, [location.pathname]);

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    activeFolder.setActiveFolder({
      activeFolderId: folder.allFolders[0]?.id,
      activeFolderName: folder.allFolders[0]?.name,
    });
    // navigate(
    //   `folders?folderId=${activeFolder.activeFolder.activeFolderId}&folderName=${activeFolder.activeFolder.activeFolderName}`
    // );
  }, [folder.allFolders]);

  useEffect(() => {
    if (notes.noteDeleted) {
      activeFolder.setActiveFolder({
        activeFolderId: folder.allFolders[0]?.id,
        activeFolderName: folder.allFolders[0]?.name,
      });
      notes.setNoteDeleted(false);
    }
  }, [notes.noteDeleted]);

  useEffect(() => {
    async () => {
      if (deleteButtonClicked) {
        await axiosApi
          .delete(`/folders/${folderId}`)
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
          <img src="/src/assets/images/AddFolder.png" alt="Add Folder" />
        </button>
      </div>
      <ul className="flex flex-col gap-y-2 overflow-auto">
        {folder.allFolders.map((item) => {
          return <Folder key={item.id} item={item} />;
        })}
      </ul>
    </div>
  );
}
