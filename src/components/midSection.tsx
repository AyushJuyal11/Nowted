import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { NotesContext } from "../contexts/notesContext";
import axiosApi from "../../axiosConfig";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import UseQueryParams from "../customHooks/UseQueryParams";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { NoteQueryParams } from "../models/noteQueryParams";
import { note } from "../models/note";
import folderOptionsIcon from "../assets/images/FolderOptions.png";

export default function MidSection() {
  const notes = useContext(NotesContext);
  const navigate = useNavigate();
  const [folderOptionsDiv, setFolderOptionsDiv] = useState<{
    display: string;
  }>({ display: "hidden" });
  const params = UseQueryParams();
  const { folderId, folderName, noteTitle, search } = params;
  const noteId = useParams();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState<NoteQueryParams>({
    favorite: false,
    deleted: false,
    folderId: folderId ?? "",
    archived: false,
    search: search ?? "",
    limit: 10,
    page: 1,
  });
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPageRef = useRef(1);

  const getNotes = () => {
    if (loading) return;
    setLoading(true);

    axiosApi
      .get<{ notes: note[]; total: number }>(`/notes`, { params: queryParams })
      .then((res) => {
        const data = res.data;
        if (currentPageRef.current > 1) {
          notes.setNotes((prev) => {
            return [...prev, ...data.notes];
          });
        } else {
          notes.setNotes([...data.notes]);
        }
        if (notes.noteDeleted) {
          notes.setNoteDeleted(false);
        }
        setTotalNotes(data.total - currentPageRef.current * 10);
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  // to set current page to 1 if folderId changes
  useEffect(() => {
    if (folderId) {
      notes.setNotes([]);
      currentPageRef.current = 1;
      setCurrentPage(currentPageRef.current);
    }
  }, [folderId]);

  useEffect(() => {
    if (currentPageRef.current !== 1) {
      setCurrentPage(currentPageRef.current);
    }
    searchParams.set("page", currentPageRef.current.toString());
    setSearchParams(searchParams);
    updateQueryParams();
  }, [folderName, currentPage, search]);

  const updateQueryParams = useCallback(() => {
    setQueryParams((prev) => {
      return {
        ...prev,
        favorite: folderName === "Favorites",
        deleted: folderName === "Trash",
        archived: folderName === "Archived",
        page: currentPageRef.current,
        search: search,
        folderId: folderId,
      };
    });
  }, [noteId, folderId, folderName, currentPage]);

  useEffect(() => {
    getNotes();
  }, [queryParams]);

  useEffect(() => {
    if (
      location.pathname.includes("noteUpdated") ||
      location.pathname.includes("noteAdded") ||
      location.pathname.includes("noteDeleted") ||
      location.pathname.includes("noteRestored")
    ) {
      getNotes();
    }
  }, [location.pathname, noteTitle]);

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
          {folderName ? folderName : "All Notes"}
        </h1>

        <div className="flex flex-col gap-y-3 relative">
          <img
            onClick={onFolderOptionsClickHandler}
            className="px-2 py-4 size-fit"
            src={folderOptionsIcon}
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
                pathname: `${
                  location.pathname.includes("more") ? "notes" : "more"
                }/${item.id}`,
                search: `?folderId=${
                  location.pathname.includes("more") ? "" : item.folder.id
                }&folderName=${folderName}`,
              }}
            >
              <div
                onClick={() => {
                  notes.setActiveNote("");
                }}
                className="flex flex-col gap-y-2 bg-background py-4 px-4 rounded-md hover:shadow-lg hover:shadow-white60"
              >
                <p className="font-semibold text-white">{item.title}</p>
                <p>
                  <span className="text-[#FFFFFF66]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-white60 px-2 text-ellipsis">
                    {item.preview?.slice(0, 20)}
                    {(item.preview?.length ?? 0) > 20 ? "..." : ""}
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      {totalNotes > 0 ? (
        <div className="px-4 py-2">
          <p
            onClick={() => {
              currentPageRef.current = currentPageRef.current + 1;
              setCurrentPage((prev) => prev + 1);
            }}
            className="text-white font-semibold text-xl cursor-pointer"
          >
            Load More...
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
