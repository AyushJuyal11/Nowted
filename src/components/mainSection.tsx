import { useContext, useEffect, useState } from "react";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";
import { NotesContext } from "../contexts/notesContext";

interface CurrentNote {
  id: string;
}

interface MainComponentProps {
  note: CurrentNote;
}

export default function MainSection({ note }: MainComponentProps) {
  const [noteState, setNoteState] = useState<"initial" | "deleted" | "open">(
    "initial"
  );

  const [deleteButtonPressed, setDeleteButtonClicked] = useState(false);
  const [archiveButtonPressed, setArchiveButtonClicked] = useState(false);
  const [addNoteToFavorite, setAddNoteToFavorite] = useState(false);
  const [openedNote, setOpenedNote] = useState<note>({} as note);
  const [noteOptions, setNoteOptions] = useState<{
    x: number;
    y: number;
    display: string;
  }>({ x: 0, y: 0, display: "hidden" });
  const notes = useContext(NotesContext);
  const [noteContent, setNoteContent] = useState<string>("");
  const [noteUpdated, setNoteUpdated] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [titleClicked, setTitleClicked] = useState<boolean>(false);
  const [restoreNoteClicked, setRestoreNoteClicked] = useState<boolean>(false);

  const getNoteById = async () => {
    await axiosApi
      .get(`/notes/${note.id}`)
      .then((res) => {
        setNoteState("open");
        setOpenedNote(res.data.note);
      })
      .catch((err) => console.error(err));
  };

  const deleteNote = async () => {
    await axiosApi
      .delete(`/notes/${openedNote.id}`)
      .then(() => {
        notes.setNoteDeleted(true);
      })
      .catch((err) => console.error(err));
  };

  const archiveNote = async () => {
    await axiosApi
      .patch(`/notes/${openedNote.id}`, { isArchived: true })
      .then(() => {})
      .catch((err) => console.error(err));
  };

  const makeNoteFavorite = async () => {
    await axiosApi
      .patch(`/notes/${openedNote.id}`, { isFavorite: true })
      .then(() => {})
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getNoteById();
  }, [note]);

  useEffect(() => {
    setNoteContent(openedNote.content);
    setNoteTitle(openedNote.title);
  }, [openedNote]);

  useEffect(() => {
    if (deleteButtonPressed) {
      deleteNote();
      setNoteState("deleted");
      setDeleteButtonClicked(false);
    }
  }, [deleteButtonPressed]);

  useEffect(() => {
    if (archiveButtonPressed) {
      archiveNote();
      setNoteState("initial");
      setArchiveButtonClicked(false);
    }
  }, [archiveButtonPressed]);

  useEffect(() => {
    if (addNoteToFavorite) {
      makeNoteFavorite();
      setAddNoteToFavorite(false);
    }
  }, [addNoteToFavorite]);

  useEffect(() => {
    if (noteUpdated) {
      updateNote(noteContent);
      setNoteUpdated(false);
    }
  }, [noteUpdated]);

  useEffect(() => {
    if (restoreNoteClicked) {
      restoreNote();
      setRestoreNoteClicked(false);
      setNoteState("open");
    }
  }, [restoreNoteClicked]);

  const onOptionsClickHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    setNoteOptions({
      ...noteOptions,
      x: e.clientX - 150,
      y: e.clientY + 30,
      display: noteOptions.display === "block" ? "hidden" : "block",
    });
  };

  const deleteButtonClickHandler = () => {
    setDeleteButtonClicked(true);
  };

  const archiveButtonClickHandler = () => {
    setArchiveButtonClicked(true);
  };

  const favoriteButtonClickHandler = () => {
    setAddNoteToFavorite(true);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
  };

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      setNoteUpdated(true);
    }
  };

  const updateNote = async (noteContent: string) => {
    await axiosApi.patch(`/notes/${openedNote.id}`, {
      content: noteContent,
      title: noteTitle,
    });
  };

  const onTitleClickHandler = () => {
    setTitleClicked(true);
  };

  const onTitleChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteTitle(e.target.value);
  };

  const onClickRestoreHandler = () => {
    setRestoreNoteClicked(true);
  };

  const restoreNote = async () => {
    await axiosApi
      .post(`/notes/${openedNote.id}/restore`)
      .then(() => {})
      .catch((err) => console.error(err));
  };

  return (
    <div className="grow h-[100vh] flex flex-col justify-center">
      {noteState === "initial" ? (
        <div className="flex flex-col items-center justify-center grow gap-y-4 px-6 py-6">
          <img
            className="size-fit"
            src="./src/assets/images/NoteIcon.png"
            alt="note icon"
          />
          <h1 className="text-white font-semibold text-xl">
            Select a note to view
          </h1>
          <p className="text-white60 text-sm w-[50%] text-pretty">
            Choose a note from the list on the left to view its contents, or
            create a new note to add to your collection.
          </p>
        </div>
      ) : noteState === "deleted" ? (
        <div className="flex flex-col gap-y-2 grow items-center justify-center">
          <img
            className="size-fit"
            src="./src/assets/images/RestoreIcon.png"
            alt="Restore note image"
          />
          <h1 className="text-white text-3xl font-semibold">
            Restore "{openedNote.title}"
          </h1>
          <p className="text-white60 text-sm">
            Don't want to lose this note? It's not too late! Just click the
            'Restore' button and it will be added back to your list. It's that
            simple.
          </p>
          <button
            onClick={onClickRestoreHandler}
            className="px-2 py-2 bg-note-blue text-white rounded-md"
          >
            Restore
          </button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between px-6 py-6">
            {titleClicked ? (
              <textarea
                onKeyDown={onKeyDownHandler}
                onChange={onTitleChangeHandler}
                className="text-white text-2xl font-semibold"
                id="title"
                value={noteTitle}
              />
            ) : (
              <h1
                onClick={onTitleClickHandler}
                className="text-2xl font-semibold text-white"
              >
                {noteTitle}
              </h1>
            )}

            <div className="flex flex-col gap-y-2">
              <img
                onClick={onOptionsClickHandler}
                src="./src/assets/images/NoteOptions.png"
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
                    <img
                      src="./src/assets/images/Favorites.png"
                      alt="favorites"
                    />
                    <span
                      onClick={favoriteButtonClickHandler}
                      className="text-white font-medium"
                    >
                      {openedNote.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </span>
                  </li>
                  <li className="flex gap-x-2">
                    <img
                      src="./src/assets/images/Archived.png"
                      alt="archived"
                    />
                    <span
                      onClick={archiveButtonClickHandler}
                      className="text-white font-medium"
                    >
                      {openedNote.isArchived ? "Unarchive" : "Archive"}
                    </span>
                  </li>
                  <li className="flex gap-x-2">
                    <img
                      src="./src/assets/images/DeleteIcon.png"
                      alt="delete icon"
                    />
                    <span
                      onClick={deleteButtonClickHandler}
                      className="text-white font-medium"
                    >
                      {openedNote.deletedAt ? "Restore" : "Delete"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 px-4 py-4">
            <img src="./src/assets/images/Calendar.png" alt="Calendar" />
            <span className="text-white60 font-medium">Date</span>
            <span className="text-white underline">
              {new Date(openedNote.createdAt).toLocaleDateString()}
            </span>
          </div>
          <hr className="text-background" />
          <div className="flex gap-x-4 px-4 py-4">
            <img src="./src/assets/images/Folder.png" alt="folder icon" />
            <span className="text-white60 font-medium">Folder</span>
            <span className="text-white underline">
              {openedNote.folder.name}
            </span>
          </div>
          <div className="text-white px-4 grow py-4">
            <textarea
              onChange={onChangeHandler}
              onKeyDown={onKeyDownHandler}
              value={noteContent}
              className="size-full"
              name="content"
              id="content"
            ></textarea>
          </div>
        </div>
      )}
    </div>
  );
}
