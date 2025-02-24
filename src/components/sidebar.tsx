import { useEffect, useState } from "react";
import Folders from "./folders";
import More from "./more";
import Recents from "./recents";
import axiosApi from "../../axiosConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import useQueryParams from "../customHooks/UseQueryParams";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { SyncLoader } from "react-spinners";

export default function Sidebar() {
  const [searchIconVisible, setSearchIconVisible] = useState(false);
  const [searchNote, setSearchNote] = useState<string>("");
  const navigate = useNavigate();
  const { folderId, folderName } = useQueryParams();
  const [loading, setLoading] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDeboundedSearch] = useState("");

  const onClickHandler = () => {
    setSearchIconVisible((prev) => !prev);
  };

  const addNewNoteClickHandler = () => {
    addNote();
  };

  const addNote = () => {
    const payload = {
      folderId: folderId,
      title: "brand new empty note",
      content: "",
      isFavorite: false,
      isArchived: false,
    };

    setLoading(true);
    axiosApi
      .post("/notes", payload)
      .then((res) => {
        const noteId = res.data?.id;
        toast.success("note added");
        navigate(
          `/notes/noteAdded?noteId=${noteId}&folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prevParams) => {
        if (debouncedSearch) {
          prevParams.set("search", debouncedSearch);
        } else {
          prevParams.delete("search");
        }
        return prevParams;
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [debouncedSearch, setSearchParams]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchNote(e.target.value);
    setDeboundedSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-y-8 h-[100vh] w-[20%]">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}
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
                onChange={onChangeHandler}
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
      <Recents />
      <Folders />
      <More />
    </div>
  );
}
