import { useContext, useState } from "react";
import { folder } from "../models/folder";
import { Link, useNavigate } from "react-router-dom";
import axiosApi from "../../axiosConfig";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ActiveFolderContext } from "../contexts/activeFolderContext";
import folderIcon from "../assets/images/Folder.png";
import openedFolderIcon from "../assets/images/OpenedFolder.png";
import closeIcon from "../assets/images/close.svg";

type FolderComponentProps = {
  item?: folder;
};

export default function Folder({ item }: FolderComponentProps) {
  const activeFolder = useContext(ActiveFolderContext);
  const [folderName, setFolderName] = useState("");
  const [renameFolderClicked, setRenameFolderClicked] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const onClickHandler = (folderId: string, folderTitle: string) => {
    activeFolder.setActiveFolder({
      activeFolderId: folderId,
      activeFolderName: folderTitle,
    });
  };

  const updateFolder = () => {
    axiosApi
      .patch<string>(`/folders/${item?.id}`, { name: folderName })
      .then(() => {
        toast.success("Folder name updated.");
        navigate(
          `folders/renamed?folderName=${folderName}&folderId=${item?.id}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      });
  };

  const onDoubleClickHandler = () => {
    setRenameFolderClicked(true);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setRenameFolderClicked(false);
      updateFolder();
    }
  };

  return (
    <Link
      to={{
        pathname: `folders`,
        search: `?folderName=${item?.name}&folderId=${item?.id}`,
      }}
    >
      <li
        onClick={() => {
          onClickHandler(item?.id ?? "", item?.name ?? "");
        }}
        key={item?.id}
        className={`flex gap-x-2 px-8 ${
          activeFolder.activeFolder.activeFolderId === item?.id
            ? "bg-white3"
            : ""
        } py-1 `}
      >
        <img
          src={
            activeFolder.activeFolder.activeFolderId === item?.id
              ? openedFolderIcon
              : folderIcon
          }
          alt="folder icon"
        />
        {renameFolderClicked ? (
          <div className="flex gap-x-2">
            <input
              className="text-white font-semibold border-white border-1 relative"
              onChange={onChangeHandler}
              onKeyDown={onKeyDownHandler}
              type="text"
              id="title"
              value={folderName}
            />
            <img
              onClick={() => setRenameFolderClicked(false)}
              src={closeIcon}
              alt=""
            />
          </div>
        ) : (
          <span
            onDoubleClick={onDoubleClickHandler}
            className={`${
              activeFolder.activeFolder.activeFolderId === item?.id
                ? "text-white"
                : "text-white60"
            } font-semibold grow hover:text-white`}
          >
            {item?.name}
          </span>
        )}
      </li>
    </Link>
  );
}
