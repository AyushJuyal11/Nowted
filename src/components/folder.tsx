import { useContext } from "react";
import { ActiveFolderContext } from "../contexts/activeFolderContext";
import { folder } from "../models/folder";
import { Link } from "react-router-dom";

type FolderComponentProps = {
  item?: folder;
};

export default function Folder({ item }: FolderComponentProps) {
  const activeFolder = useContext(ActiveFolderContext);

  const onClickHandler = (folderId: string, folderTitle: string) => {
    activeFolder.setActiveFolder({
      activeFolderId: folderId,
      activeFolderName: folderTitle,
    });
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
        } py-1`}
      >
        <img
          src={
            activeFolder.activeFolder.activeFolderId === item?.id
              ? "/src/assets/images/OpenedFolder.png"
              : "/src/assets/images/Folder.png"
          }
          alt="folder icon"
        />
        <span
          className={`${
            activeFolder.activeFolder.activeFolderId === item?.id
              ? "text-white"
              : "text-white60"
          } font-semibold grow`}
        >
          {item?.name}
        </span>
      </li>
    </Link>
  );
}
