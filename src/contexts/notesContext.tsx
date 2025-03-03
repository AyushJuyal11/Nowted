import { createContext, useState } from "react";
import { note } from "../models/note";

type notesType = {
  notes: note[];
  setNotes: React.Dispatch<React.SetStateAction<note[]>>;
  noteDeleted: boolean;
  setNoteDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  activeNote: string;
  setActiveNote: React.Dispatch<React.SetStateAction<string>>;
};
export const NotesContext = createContext<notesType>({} as notesType);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<note[]>([]);
  const [noteDeleted, setNoteDeleted] = useState<boolean>(false);
  const [activeNote, setActiveNote] = useState<string>("");
  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        noteDeleted,
        setNoteDeleted,
        activeNote,
        setActiveNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
