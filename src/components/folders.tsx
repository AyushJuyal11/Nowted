import { useContext, useEffect, useState } from "react";
import { folder } from "../models/folder";
import { FolderContext } from "../contexts/folderContext";
import axiosApi from "../../axiosConfig";
import { ActiveFolderContext } from "../contexts/activeFolderContext";
import { NotesContext } from "../contexts/notesContext";
import Folder from "./folder";
import useQueryParams from "../customHooks/UseQueryParams";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

export default function Folders() {
  type folders = {
    folders: folder[];
  };

  const notes = useContext(NotesContext);
  const activeFolder = useContext(ActiveFolderContext);
  const folder = useContext(FolderContext);
  const [addFolderClicked, setAddFolderClicked] = useState<boolean>(false);
  const { folderId } = useQueryParams();
  const [loading, setLoading] = useState(false);

  const [deleteButtonClicked, setDeleteButtonClicked] =
    useState<boolean>(false);

  const getFolders = async () => {
    setLoading(true);
    await axiosApi
      .get<folders>("/folders")
      .then((res) => {
        folder.setFolders([...res.data.folders]);
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const addFolder = async () => {
    setLoading(true);
    await axiosApi
      .post<string>("/folders", { name: "My new Folder" })
      .then(() => {
        getFolders();
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (addFolderClicked) {
      addFolder();
      setAddFolderClicked(false);
    }
  }, [addFolderClicked]);

  useEffect(() => {
    if (
      location.pathname.includes("folders/deleted") ||
      location.pathname.includes("folders/renamed")
    )
      getFolders();
  }, [location.pathname]);

  useEffect(() => {
    getFolders();
  }, []);

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
        setLoading(true);
        await axiosApi
          .delete(`/folders/${folderId}`)
          .then(() => {
            toast.success("Folder deleted");
          })
          .catch((err) => {
            const error = err as AxiosError;
            toast.error(error.message);
          })
          .finally(() => setLoading(false));
      }
      setDeleteButtonClicked(false);
    };
  }, [deleteButtonClicked]);

  return (
    <div className="flex flex-col gap-y-4 h-[40%]">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}
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
