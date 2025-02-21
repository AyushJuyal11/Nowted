import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../contexts/notesContext";
import axiosApi from "../../axiosConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
import UseQueryParams from "../customHooks/UseQueryParams";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { noteSearchParams } from "../types/noteSearchParams";

export default function MidSection() {
  const notes = useContext(NotesContext);
  const navigate = useNavigate();
  const [folderOptionsDiv, setFolderOptionsDiv] = useState<{
    display: string;
  }>({ display: "hidden" });
  const params = UseQueryParams();
  const folderId: string = params["folderId"] ?? "";
  const noteId = useParams();
  const [loading, setLoading] = useState(false);
  const folderName: string = params["folderName"] ?? "";
  const searchQuery: string = params["search"] ?? "";
  const noteTitle: string = params["noteTitle"] ?? "";
  const [searchParams, setSearchParams] = useState<noteSearchParams>({
    archived: false,
    favorite: false,
    deleted: false,
    folderId:
      folderName === "Favorites" ||
      folderName === "Trash" ||
      folderName === "Archived"
        ? ""
        : folderId,
    page: 1,
    limit: 10,
    search: searchQuery,
  });

  const getNotes = () => {
    setLoading(true);
    switch (folderName) {
      case "Favorites":
        setSearchParams({ ...searchParams, favorite: true });
        break;
      case "Trash":
        setSearchParams({ ...searchParams, deleted: true });
        break;
      case "Archived":
        setSearchParams({ ...searchParams, archived: true });
        break;
    }
    axiosApi
      .get(`/notes`, { params: searchParams })
      .then((res) => {
        const data = res.data;
        notes.setNotes([...notes.notes, ...data.notes]);
        if (notes.noteDeleted) {
          notes.setNoteDeleted(false);
        }
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (folderId !== undefined) {
      getNotes();
    }
  }, [folderId, folderName, noteId, searchParams.page, noteTitle]);

  useEffect(() => {
    if (
      location.pathname.includes("folders/renamed") ||
      location.pathname.includes("noteUpdated") ||
      location.pathname.includes("noteDeleted") ||
      location.pathname.includes("noteRestored")
    ) {
      getNotes();
    }
  }, [location.pathname]);

  const deleteFolder = () => {
    setLoading(true);
    axiosApi
      .delete<string>(`/folders/${folderId}`)
      .then(() => {
        toast.success("Folder deleted");
        navigate(`folders/deleted`);
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const onClickHandler = (id: string) => {
    if (
      folderName === "Favorites" ||
      folderName === "Trash" ||
      folderName === "Archived"
    ) {
      navigate(`more/${id}?folderName=${folderName}`);
    } else {
      navigate(`notes/${folderName}/${folderId}/${id}`);
    }
  };

  const onFolderOptionsClickHandler = () => {
    setFolderOptionsDiv({
      display: folderOptionsDiv.display === "block" ? "hidden" : "block",
    });
  };

  const deleteButtonClickHandler = () => {
    setFolderOptionsDiv({
      ...folderOptionsDiv,
      display: "hidden",
    });
    deleteFolder();
  };

  return (
    <div className="bg-dark-gray flex flex-col gap-y-4 w-[20%] h-[100vh]">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}

      <div className="flex justify-between px-3 py-3">
        <h1 className="text-xl text-white grow font-semibold px-4 py-4">
          {folderName === "" ? "Recent Notes" : folderName}
        </h1>

        <div className="flex flex-col gap-y-3 relative">
          <img
            onClick={onFolderOptionsClickHandler}
            className="px-2 py-4 size-fit"
            src="/src/assets/images/FolderOptions.png"
            alt=""
          />
          <div
            className={`absolute top-[30px] ${folderOptionsDiv.display} bg-white60 rounded-md px-3 py-3`}
          >
            <ul className="flex flex-col gap-y-2 list-none">
              <li
                className="text-white font-semibold"
                onClick={deleteButtonClickHandler}
              >
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 px-4 py-4 grow overflow-y-auto">
        {notes.notes.map((item) => {
          return (
            <Link
              key={item.id}
              to={{
                pathname: `notes/${item.id}`,
                search: `?folderId=${item.folder.id}&folderName=${item.folder.name}`,
              }}
            >
              <div
                onClick={() => {
                  onClickHandler(item.id);
                }}
                className="flex flex-col gap-y-2 bg-background py-4 px-4 rounded-md"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p>
                  <span className="text-[#FFFFFF66]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-white60 px-2 text-ellipsis">
                    {item.preview}
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="px-4 py-2">
        <p
          onClick={() => {
            setSearchParams({ ...searchParams, page: searchParams.page + 1 });
          }}
          className="text-white font-semibold text-xl cursor-pointer"
        >
          Load More...
        </p>
      </div>
    </div>
  );
}
