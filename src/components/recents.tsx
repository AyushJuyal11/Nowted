import { useContext, useEffect, useState } from "react";
import { recentNotes } from "../models/recentNotes";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";
import { NotesContext } from "../contexts/notesContext";

interface RecentComponentProps {
  onNoteSelect: (id: string) => void;
  noteState: boolean;
}

export default function Recents({
  onNoteSelect,
  noteState,
}: RecentComponentProps) {
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

  const onClickHandler = (id: string) => {
    onNoteSelect(id);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-white/60 px-8 text-sm font-semibold">Recents</h1>
      <ul className="list-none flex flex-col gap-y-4 px-8">
        {recents.map((item) => {
          return (
            <li key={item.id} className="flex gap-x-2">
              <img
                className="w-[8%]"
                src="./src/assets/images/NoteIcon.png"
                alt="note icon"
              />
              <span
                onClick={() => onClickHandler(item.id)}
                className="text-white60 font-semibold"
              >
                {item.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
