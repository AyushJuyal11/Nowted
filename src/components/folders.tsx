import { useEffect, useState } from "react";
import { folder } from "../models/folder";
import axiosApi from "../../axiosConfig";
import Folder from "./folder";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

export default function Folders() {
  type folders = {
    folders: folder[];
  };

  const [loading, setLoading] = useState(false);
  const [allFolders, setFolders] = useState<folder[]>([]);

  const getFolders = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .get<folders>("/folders")
      .then((res) => {
        setFolders([...res.data.folders]);
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const addFolder = () => {
    setLoading(true);
    axiosApi
      .post<string>("/folders", { name: "My new Folder" })
      .then(() => {
        toast.success("Folder added");
        getFolders();
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (
      location.pathname.includes("folders/deleted") ||
      location.pathname.includes("folders/renamed")
    ) {
      getFolders();
    }
  }, [location.pathname]);

  useEffect(() => {
    getFolders();
  }, []);

  const addFolderClickedHandler = () => {
    addFolder();
  };

  return (
    <div className="flex flex-col gap-y-4 h-[40%]">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}
      <div className="flex justify-between">
        <h1 className="text-sm text-white60 font-semibold px-8">Folders</h1>
        <button onClick={addFolderClickedHandler} className="px-8">
          <img src="/src/assets/images/AddFolder.png" alt="Add Folder" />
        </button>
      </div>
      <ul className="flex flex-col gap-y-2 overflow-auto">
        {allFolders.map((item) => {
          return <Folder key={item.id} item={item} />;
        })}
      </ul>
    </div>
  );
}
