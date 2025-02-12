import axios from "axios";
import { useEffect, useState } from "react";
import { folder } from "../models/folder";

export default function Folders() {
  type folders = {
    folders: folder[];
  };

  const [allfolders, setFolders] = useState<folder[]>([]);

  const getFolders = async () => {
    await axios
      .get<folders>("api/folders")
      .then((res) => {
        setFolders([...res.data.folders]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex justify-between">
        <h1 className="text-sm text-white60 font-semibold px-8">Folders</h1>
        <img src="./src/assets/images/AddFolder.png" alt="Add Folder" />
      </div>
      <ul className="flex flex-col gap-y-4">
        {allfolders.map((item) => {
          return (
            <li key={item.id} className="flex gap-x-2 px-8">
              <img src="./src/assets/images/Folder.png" alt="folder icon" />
              <span className="text-white60 font-semibold">{item.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
