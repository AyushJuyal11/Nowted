import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../contexts/notesContext";
import axiosApi from "../../axiosConfig";
import { Link, useNavigate, useParams } from "react-router-dom";
import UseQueryParams from "../customHooks/UseQueryParams";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

export default function MidSection() {
  const notes = useContext(NotesContext);
  const navigate = useNavigate();
  const [folderOptionsDiv, setFolderOptionsDiv] = useState<{
    display: string;
  }>({ display: "hidden" });
  const [deleteButtonClicked, setDeleteButtonClicked] =
    useState<boolean>(false);
  const params = UseQueryParams();
  const folderId: string = params["folderId"] ?? "";
  const noteId = useParams();
  const [loading, setLoading] = useState(false);
  //const [renameFolderClicked, setRenameFolderClicked] = useState(false);
  const folderName: string | undefined = params["folderName"] ?? "";
  //const [folderTitle, setFolderTitle] = useState<string>(folderName);
  //const [updateFolderName, callUpdateFolderName] = useState<boolean>(false);

  const searchParams = {
    archived: false,
    favorite: false,
    deleted: false,
    folderId: folderId,
    page: "1",
    limit: "10",
    search: "",
  };

  switch (folderName) {
    case "Favorites":
      searchParams["favorite"] = true;
      break;
    case "Trash":
      searchParams["deleted"] = true;
      break;
    case "Archived":
      searchParams["archived"] = true;
      break;
  }

  const getNotes = async () => {
    setLoading(true);
    await axiosApi
      .get(`/notes`, { params: searchParams })
      .then((res) => {
        const data = res.data;
        notes.setNotes([...data.notes]);
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
  }, [folderId, folderName, noteId, location.pathname]);

  useEffect(() => {
    if (
      location.pathname.includes("folders/renamed") ||
      location.pathname.includes("noteArchived") ||
      location.pathname.includes("noteDeleted") ||
      location.pathname.includes("noteRestored")
    ) {
      getNotes();
    }
  }, [location.pathname]);

  const deleteFolder = async () => {
    if (deleteButtonClicked) {
      setLoading(true);
      await axiosApi
        .delete(`/folders/${folderId}`)
        .catch((err) => {
          const error = err as AxiosError;
          toast.error(error.message);
        })
        .finally(() => setLoading(false));
      navigate(`folders/deleted`);
    }
  };

  // const updateFolder = async () => {
  //   setLoading(true);
  //   await axiosApi
  //     .patch(`/folders/${folderId}`, { name: folderTitle })
  //     .then(() => toast.success("Folder name updated."))
  //     .catch((err) => {
  //       const error = err as AxiosError;
  //       toast.error(error.message);
  //     });
  //   navigate(`folders/renamed?folderName=${folderTitle}&folderId=${folderId}`);
  // };

  useEffect(() => {
    deleteFolder();
    setDeleteButtonClicked(false);
  }, [deleteButtonClicked]);

  // useEffect(() => {
  //   if (renameFolderClicked) {
  //     updateFolder();
  //     callUpdateFolderName(false);
  //     setRenameFolderClicked(false);
  //   }
  // }, [renameFolderClicked]);

  const onClickHandler = (id: string) => {
    navigate(`notes/${folderName}/${folderId}/${id}`);
  };

  const onFolderOptionsClickHandler = () => {
    setFolderOptionsDiv({
      display: folderOptionsDiv.display === "block" ? "hidden" : "block",
    });
  };

  const deleteButtonClickHandler = () => {
    setDeleteButtonClicked((prev) => !prev);
    setFolderOptionsDiv({
      ...folderOptionsDiv,
      display: "hidden",
    });
  };

  return (
    <div className="bg-dark-gray flex flex-col gap-y-4 w-[20%] h-[100vh]">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}

      <div className="flex justify-between px-3 py-3">
        <h1
          //onClick={() => setRenameFolderClicked(true)}
          className="text-xl text-white grow font-semibold px-4 py-4"
        >
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
                  <span className="text-sm text-white60 px-2">
                    {item.content}
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
