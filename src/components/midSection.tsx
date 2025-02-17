import { useContext, useEffect } from "react";
import { NotesContext } from "../contexts/notesContext";
import axiosApi from "../../axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

export default function MidSection() {
  const notes = useContext(NotesContext);
  const { folderName, folderId } = useParams();
  const navigate = useNavigate();

  const getNotes = async () => {
    await axiosApi
      .get(
        `/notes?folderId=${
          folderId === "1" ? "" : folderId
        }&page${1}&limit=${10}&favorite=${
          folderName === "Favorites" ? "true" : "false"
        }&archived=${folderName === "Archived" ? "true" : "false"}&deleted=${
          folderName === "Trash" ? "true" : "false"
        }`
      )
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
    getNotes();
  }, [folderId, folderName]);

  const onClickHandler = (id: string) => {
    navigate(`notes/${id}`);
  };

  return (
    <div className="bg-dark-gray flex flex-col gap-y-4 w-[20%] h-[100vh]">
      <h1 className="text-xl text-white font-semibold px-4 py-4">
        {folderName}
      </h1>
      <div className="flex flex-col gap-y-2 px-4 py-4 grow overflow-y-auto">
        {notes.notes.map((item) => {
          return (
            <div
              onClick={() => {
                onClickHandler(item.id);
              }}
              key={item.id}
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
          );
        })}
      </div>
    </div>
  );
}
