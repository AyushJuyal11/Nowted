import { useContext, useEffect, useState } from "react";
import { NotesContext } from "../contexts/notesContext";
import axiosApi from "../../axiosConfig";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UseQueryParams from "../customHooks/UseQueryParams";

export default function MidSection() {
  const notes = useContext(NotesContext);
  const navigate = useNavigate();
  const [folderOptionsDiv, setFolderOptionsDiv] = useState<{
    display: string;
  }>({ display: "hidden" });
  const [deleteButtonClicked, setDeleteButtonClicked] =
    useState<boolean>(false);
  const params = UseQueryParams();
  const folderName: string | undefined = params["folderName"] ?? "";
  const folderId: string = params["folderId"] ?? "";
  const noteId: string = params["noteId"] ?? "";

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
        console.error(err);
      });
  };

  useEffect(() => {
    if (folderId !== undefined) {
      getNotes();
    }
  }, [folderId, folderName, noteId]);

  const deleteFolder = async () => {
    if (deleteButtonClicked) {
      await axiosApi.delete(`/folders/${folderId}`).catch((err) => {
        console.error(err);
      });
      navigate(`folders`);
    }
  };

  useEffect(() => {
    deleteFolder();
    setDeleteButtonClicked(false);
  }, [deleteButtonClicked]);

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
  };

  return (
    <div className="bg-dark-gray flex flex-col gap-y-4 w-[20%] h-[100vh]">
      <div className="flex justify-between">
        <h1 className="text-xl text-white grow font-semibold px-4 py-4">
          {folderName}
        </h1>
        <div className="flex flex-col gap-y-3 relative">
          <img
            onClick={onFolderOptionsClickHandler}
            className="px-2 py-2 size-fit"
            src="/src/assets/images/FolderOptions.png"
            alt=""
          />
          <div
            className={`absolute top-[30px] ${folderOptionsDiv.display} bg-white60 rounded-md px-3 py-3`}
            onMouseOut={() =>
              setFolderOptionsDiv({
                ...folderOptionsDiv,
                display: "hidden",
              })
            }
          >
            <ul className="flex flex-col gap-y-2 list-none">
              <li
                className="text-white font-semibold"
                onClick={deleteButtonClickHandler}
              >
                Delete
              </li>
              <li className="text-white font-semibold">Rename</li>
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
