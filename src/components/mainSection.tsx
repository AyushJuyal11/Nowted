import { useEffect, useState } from "react";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";
import { useParams } from "react-router-dom";
import useQueryParams from "../customHooks/UseQueryParams";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { NoteInitial } from "./noteInitial";
import { RestoreNote } from "./restoreNote";
import { NoteOpen } from "./noteOpen";

export default function MainSection() {
  const [noteState, setNoteState] = useState<"initial" | "deleted" | "open">(
    "initial"
  );

  const [openedNote, setOpenedNote] = useState<note>({} as note);
  const [noteContent, setNoteContent] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");

  const { noteId } = useParams();
  const params = useQueryParams();
  const { folderId, folderName, title } = params;
  const [loading, setLoading] = useState(false);

  const getNoteById = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .get<{ note: note }>(`/notes/${noteId}`)
      .then((res) => {
        setNoteState("open");
        setOpenedNote(res.data.note);
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (
      (noteId ||
        location.pathname.includes("noteRestored") ||
        location.pathname.includes("noteUpdated")) &&
      !location.pathname.includes("noteDeleted")
    ) {
      getNoteById();
    }
  }, [noteId, title, location.pathname]);

  useEffect(() => {
    setNoteContent(openedNote.content);
    setNoteTitle(openedNote.title);
  }, [openedNote]);

  return (
    <div className="grow h-[100vh] flex flex-col justify-center">
      {loading && (
        <div className="flex justify-center items-center my-4">
          <SyncLoader color="#36D7B7" loading={loading} size={15} />
        </div>
      )}
      {noteState === "initial" ? (
        <NoteInitial />
      ) : noteState === "deleted" ? (
        <RestoreNote
          setNoteState={setNoteState}
          folderId={folderId}
          folderName={folderName}
          noteId={noteId}
          noteTitle={openedNote.title}
        />
      ) : (
        <NoteOpen
          setNoteState={setNoteState}
          folderId={folderId}
          folderName={folderName}
          title={openedNote.title}
          noteContent={noteContent}
          noteTitle={noteTitle}
          setNoteContent={setNoteContent}
          setNoteTitle={setNoteTitle}
          noteId={noteId}
          openedNote={openedNote}
        />
      )}
    </div>
  );
}
