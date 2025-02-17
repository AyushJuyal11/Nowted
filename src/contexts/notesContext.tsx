import { createContext, useState } from "react";
import { note } from "../models/note";

type notesType = {
  notes: note[];
  setNotes: React.Dispatch<React.SetStateAction<note[]>>;
  noteDeleted: boolean;
  setNoteDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};
export const NotesContext = createContext<notesType>({} as notesType);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<note[]>([]);
  const [noteDeleted, setNoteDeleted] = useState<boolean>(false);
  return (
    <NotesContext.Provider
      value={{ notes, setNotes, noteDeleted, setNoteDeleted }}
    >
      {children}
    </NotesContext.Provider>
  );
};
