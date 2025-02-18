import { useContext, useEffect, useState } from "react";
import { recentNotes } from "../models/recentNotes";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";
import { NotesContext } from "../contexts/notesContext";
import { Link, useNavigate } from "react-router-dom";

interface RecentComponentProps {
  noteState: boolean;
}

export default function Recents({ noteState }: RecentComponentProps) {
  const navigate = useNavigate();
  const [recents, setRecentNotes] = useState<note[]>([]);
  const notes = useContext(NotesContext);

  const recentNotes = async () => {
    await axiosApi
      .get<recentNotes>("/notes/recent")
      .then((res) => {
        setRecentNotes([...res.data.recentNotes]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    recentNotes();
  }, [noteState]);

  useEffect(() => {
    if (notes.noteDeleted) {
      recentNotes();
      notes.setNoteDeleted(false);
    }
  }, [notes.noteDeleted]);

  const onClickNavigateHandler = (noteId: string) => {
    navigate(`notes/${noteId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-white/60 px-8 text-sm font-semibold">Recents</h1>
      <ul className="list-none flex flex-col gap-y-4 px-8">
        {recents.map((item) => {
          return (
            <Link
              key={item.id}
              to={{
                pathname: `notes/${item.id}`,
                search: `?folderId=${item.folder.id}&folderName=${item.folder.name}`,
              }}
            >
              <li
                onClick={() => onClickNavigateHandler(item.id)}
                className="flex gap-x-2"
              >
                <img
                  className="w-[8%]"
                  src="/src/assets/images/NoteIcon.png"
                  alt="note icon"
                />
                <span className="text-white60 font-semibold">{item.title}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}
