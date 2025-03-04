import { AxiosError } from "axios";
import { toast } from "react-toastify";
import axiosApi from "../../axiosConfig";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotesContext } from "../contexts/notesContext";
import { note } from "../models/note";
import folderIcon from "../assets/images/Folder.png";
import noteOptionsIcon from "../assets/images/NoteOptions.png";
import favoritesIcon from "../assets/images/Favorites.png";
import archivedIcon from "../assets/images/Archived.png";
import trashIcon from "../assets/images/DeleteIcon.png";
import calendarIcon from "../assets/images/Calendar.png";
import NoteContent from "./noteContent";
import closeIcon from "../assets/images/close.svg";

type noteOpenComponentProps = {
  noteId: string | undefined;
  folderName: string;
  folderId: string;
  setNoteState: React.Dispatch<
    React.SetStateAction<"deleted" | "initial" | "open">
  >;
  title: string;
  openedNote: note;
  noteContent: string;
  noteTitle: string;
  setNoteTitle: React.Dispatch<React.SetStateAction<string>>;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
};

export const NoteOpen = ({
  noteId,
  folderName,
  folderId,
  setNoteState,
  title,
  openedNote,
  noteContent,
  noteTitle,
  setNoteContent,
  setNoteTitle,
}: noteOpenComponentProps) => {
  const [noteOptions, setNoteOptions] = useState<{
    x: number;
    y: number;
    display: string;
  }>({ x: 0, y: 0, display: "hidden" });
  const navigate = useNavigate();
  const [titleClicked, setTitleClicked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const notes = useContext(NotesContext);

  const updateNote = () => {
    setLoading(true);
    axiosApi
      .patch(`/notes/${noteId}`, {
        content: noteContent,
        title: noteTitle ?? title,
      })
      .then(() => {
        toast.success("Note updated.");
        navigate(
          `/noteUpdated/${noteId}?folderName=${folderName}&folderId=${folderId}&noteTitle=${noteTitle}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const onTitleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const restoreNote = () => {
    setLoading(true);
    axiosApi
      .post(`/notes/${noteId}/restore`)
      .then(() => {
        toast.success("note restored");
        navigate(
          `/noteRestored/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const restoreButtonClickHandler = () => {
    restoreNote();
    setNoteState("open");
  };

  const deleteNote = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .delete(`/notes/${noteId}`)
      .then(() => {
        toast.success("Note deleted.");
        notes.setNoteDeleted(true);
        navigate(
          `/noteDeleted/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
    setNoteOptions({ ...noteOptions, display: "hidden" });
  };

  const archiveNote = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .patch(`/notes/${noteId}`, { isArchived: true })
      .then(() => {
        toast.success("Note archived.");
        navigate(
          `/noteUpdated/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
    setNoteOptions({ ...noteOptions, display: "hidden" });
  };

  const unarchiveNote = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .patch(`/notes/${noteId}`, { isArchived: false })
      .then(() => {
        toast.success("Note archived.");
        navigate(
          `/noteRestored/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));

    setNoteOptions({ ...noteOptions, display: "hidden" });
  };

  const makeNoteFavorite = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .patch(`/notes/${noteId}`, { isFavorite: true })
      .then(() => {
        toast.success("Note marked as favorite");
        navigate(
          `/noteUpdated/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
    setNoteOptions({ ...noteOptions, display: "hidden" });
  };

  const removeNoteFromFavorite = () => {
    if (loading) return;
    setLoading(true);
    axiosApi
      .patch(`/notes/${noteId}`, { isFavorite: false })
      .then(() => {
        toast.success("Note removed from favorite");
        navigate(
          `/noteUpdated/${noteId}?folderName=${folderName}&folderId=${folderId}`
        );
      })
      .catch((err) => {
        const error = err as AxiosError;
        toast.error(error.message);
      })
      .finally(() => setLoading(false));

    setNoteOptions({ ...noteOptions, display: "hidden" });
  };
  const onOptionsClickHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    setNoteOptions({
      ...noteOptions,
      x: e.clientX - 180,
      y: e.clientY + 20,
      display: noteOptions.display === "block" ? "hidden" : "block",
    });
  };

  const deleteButtonClickHandler = () => {
    deleteNote();
    setNoteState("deleted");
  };

  const archiveButtonClickHandler = () => {
    archiveNote();
    setNoteState("initial");
  };

  const unarchiveButtonClickHandler = () => {
    unarchiveNote();
    setNoteState("open");
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setTitleClicked(false);
      updateNote();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between px-6 py-6">
        {titleClicked ? (
          <div className="flex gap-x-2 relative">
            <input
              type="text"
              onKeyDown={onKeyDownHandler}
              onChange={onTitleChangeHandler}
              className="text-white text-2xl font-semibold border-1 border-white"
              id="title"
              value={noteTitle}
            />
            <img
              className="absolute right-0"
              onClick={() => {
                setTitleClicked(false);
              }}
              src={closeIcon}
              alt="close icon"
            />
          </div>
        ) : (
          <h1
            onClick={() => {
              setTitleClicked(true);
            }}
            className="text-2xl font-semibold text-white"
          >
            {noteTitle}
          </h1>
        )}

        <div className="flex flex-col gap-y-2">
          <img
            onClick={onOptionsClickHandler}
            src={noteOptionsIcon}
            alt="note options"
          />
          <div
            className={`${noteOptions.display} absolute bg-[#333333}] rounded-md`}
            style={{
              top: noteOptions.y + "px",
              left: noteOptions.x + "px",
            }}
          >
            <ul className="flex flex-col px-3 py-3 gap-y-3">
              <li className="flex gap-x-2">
                <img src={favoritesIcon} alt="favorites" />
                {openedNote.isFavorite ? (
                  <span
                    onClick={() => {
                      removeNoteFromFavorite();
                    }}
                    className="text-white font-mediu cursor-pointerm"
                  >
                    Remove from favorites
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      makeNoteFavorite();
                    }}
                    className="text-white font-medium cursor-pointer"
                  >
                    Add to favorites
                  </span>
                )}
              </li>
              <li className="flex gap-x-2">
                <img src={archivedIcon} alt="archived" />

                {openedNote.isArchived ? (
                  <span
                    onClick={unarchiveButtonClickHandler}
                    className="text-white font-medium cursor-pointer"
                  >
                    Unarhive
                  </span>
                ) : (
                  <span
                    onClick={archiveButtonClickHandler}
                    className="text-white font-medium cursor-pointer"
                  >
                    Archive
                  </span>
                )}
              </li>
              <li className="flex gap-x-2">
                <img src={trashIcon} alt="delete icon" />

                {openedNote.deletedAt ? (
                  <span
                    onClick={restoreButtonClickHandler}
                    className="text-white font-medium cursor-pointer"
                  >
                    Restore
                  </span>
                ) : (
                  <span
                    onClick={deleteButtonClickHandler}
                    className="text-white font-medium cursor-pointer"
                  >
                    Delete
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-x-4 px-4 py-4">
        <img src={calendarIcon} alt="Calendar" />
        <span className="text-white60 font-medium">Date</span>
        <span className="text-white underline">
          {new Date(openedNote.createdAt).toLocaleDateString()}
        </span>
      </div>
      <hr className="text-background" />
      <div className="flex gap-x-4 px-4 py-4">
        <img src={folderIcon} alt="folder icon" />
        <span className="text-white60 font-medium">Folder</span>
        <span className="text-white underline">{openedNote.folder.name}</span>
      </div>
      <NoteContent
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        updateNote={updateNote}
      />
    </div>
  );
};
