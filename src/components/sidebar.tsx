import { useContext, useEffect, useState } from "react";
import Folders from "./folders";
import More from "./more";
import Recents from "./recents";
import axiosApi from "../../axiosConfig";
import { ActiveFolderContext } from "../contexts/activeFolderContext";

interface sidebarComponentProps {
  onFolderSelect: (id: string, title: string) => void;
  onNoteSelect: (id: string) => void;
}

export default function Sidebar({
  onFolderSelect,
  onNoteSelect,
}: sidebarComponentProps) {
  const [searchIconVisible, setSearchIconVisible] = useState(false);
  const [addNoteClicked, setAddNoteClicked] = useState(false);
  const [searchNote, setSearchNote] = useState<string>("");
  const activeFolder = useContext(ActiveFolderContext);

  const onClickHandler = () => {
    setSearchIconVisible((prev) => !prev);
  };

  const addNewNoteClickHandler = () => {
    setAddNoteClicked((prev) => !prev);
  };

  const addNote = async () => {
    const payload = {
      folderId: activeFolder.activeFolder.activeFolderId,
      title: "brand new empty note",
      content: "",
      isFavorite: false,
      isArchived: false,
    };

    await axiosApi
      .post("/notes", payload)
      .then((res) => {
        onFolderSelect(
          activeFolder.activeFolder.activeFolderId,
          activeFolder.activeFolder.activeFolderName
        );
      })
      .catch((err) => {
        console.error(err);
      });
    setAddNoteClicked(false);
  };

  useEffect(() => {
    if (addNoteClicked) {
      addNote();
      setAddNoteClicked(false);
      onFolderSelect(
        activeFolder.activeFolder.activeFolderId,
        activeFolder.activeFolder.activeFolderName
      );
    }
  }, [addNoteClicked]);

  return (
    <>
      <div className="flex flex-col gap-y-8 h-full w-[20%]">
        <div className="flex justify-between">
          <img
            className="px-8 py-4"
            src="./src/assets/images/Logo.png"
            alt="Nowted logo"
          />
          <button onClick={onClickHandler}>
            <img
              className="px-8 py-4"
              src="./src/assets/images/SearchIcon.png"
              alt="Search button"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {
              onClickHandler;
            }}
            className="bg-background w-[86%] py-2 rounded-sm font-sans "
          >
            {searchIconVisible ? (
              <div className="flex gap-x-2">
                <img
                  className="px-2"
                  src="./src/assets/images/SearchIcon.png"
                  alt="search icon"
                />
                <input
                  type="search"
                  className="font-sans text-white font-medium"
                  placeholder="Search note"
                  value={searchNote}
                  id="search"
                />
              </div>
            ) : (
              <p onClick={addNewNoteClickHandler}>
                <span className="text-xl text-white font-semibold">+</span>
                <span className="text-white font-semibold">New Note</span>
              </p>
            )}
          </button>
        </div>
        <Recents noteState={addNoteClicked} onNoteSelect={onNoteSelect} />
        <Folders onFolderSelect={onFolderSelect} />
        <More />
      </div>
    </>
  );
}
