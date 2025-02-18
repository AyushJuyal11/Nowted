import { useEffect, useState } from "react";
import Folders from "./folders";
import More from "./more";
import Recents from "./recents";
import axiosApi from "../../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import useQueryParams from "../customHooks/UseQueryParams";

interface sidebarComponentProps {
  setAddNoteClicked: React.Dispatch<React.SetStateAction<boolean>>;
  addNoteClicked: boolean;
}

export default function Sidebar({
  setAddNoteClicked,
  addNoteClicked,
}: sidebarComponentProps) {
  const [searchIconVisible, setSearchIconVisible] = useState(false);
  const [searchNote, setSearchNote] = useState<string>("");
  const navigate = useNavigate();
  const { folderId, folderName } = useQueryParams();

  const onClickHandler = () => {
    setSearchIconVisible((prev) => !prev);
  };

  const addNewNoteClickHandler = () => {
    setAddNoteClicked((prev) => !prev);
  };

  const addNote = async () => {
    const payload = {
      folderId: folderId,
      title: "brand new empty note",
      content: "",
      isFavorite: false,
      isArchived: false,
    };

    await axiosApi
      .post("/notes", payload)
      .then((res) => {
        const noteId = res.data?.id;
        navigate(
          `notes/noteAdded?noteId=${noteId}&folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (addNoteClicked) {
      addNote();
      setAddNoteClicked(false);
    }
  }, [addNoteClicked]);

  return (
    <div className="flex flex-col gap-y-8 h-[100vh] w-[20%]">
      <div className="flex justify-between">
        <img
          className="px-8 py-4"
          src="/src/assets/images/Logo.png"
          alt="Nowted logo"
        />
        <button onClick={onClickHandler}>
          <img
            className="px-8 py-4"
            src="/src/assets/images/SearchIcon.png"
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
                src="/src/assets/images/SearchIcon.png"
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
      <Recents noteState={addNoteClicked} />
      <Folders />
      <More />
    </div>
  );
}
