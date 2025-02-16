import { useEffect, useState } from "react";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";

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

  const [openedNote, setOpenedNote] = useState<note>({} as note);
  const [noteOptions, setNoteOptions] = useState<{
    x: number;
    y: number;
    display: string;
  }>({ x: 0, y: 0, display: "hidden" });

  const getNoteById = async () => {
    await axiosApi
      .get(`/notes/${note.id}`)
      .then((res) => {
        setNoteState("open");
        setOpenedNote(res.data.note);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getNoteById();
  }, [note]);

  const onOptionsClickHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    setNoteOptions({
      ...noteOptions,
      x: e.clientX - 150,
      y: e.clientY + 30,
      display: noteOptions.display === "block" ? "hidden" : "block",
    });
  };

  return (
    <div className="grow h-full">
      {noteState === "initial" ? (
        <div className="flex flex-col items-center justify-center gap-y-4 px-6 py-6">
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
        <>
          <img
            src="./src/assets/images/RestoreIcon.png"
            alt="Restore note image"
          />
          <h1>Restore &#x275D {} &#x275E</h1>
          <p>
            Don't want to lose this note? It's not too late! Just click the
            'Restore' button and it will be added back to your list. It's that
            simple.
          </p>
        </>
      ) : (
        <>
          <div className="flex justify-between px-6 py-6">
            <h1 className="text-2xl font-semibold text-white">
              {openedNote.title}
            </h1>
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
                    <span className="text-white font-medium">
                      Add to favorites
                    </span>
                  </li>
                  <li className="flex gap-x-2">
                    <img
                      src="./src/assets/images/Archived.png"
                      alt="archived"
                    />
                    <span className="text-white font-medium">Archived</span>
                  </li>
                  <li className="flex gap-x-2">
                    <img
                      src="./src/assets/images/DeleteIcon.png"
                      alt="delete icon"
                    />
                    <span className="text-white font-medium">Delete</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex gap-x-4 px-4 py-3">
            <img src="./src/assets/images/Calendar.png" alt="Calendar" />
            <span className="text-white60 font-medium">Date</span>
            <span className="text-white underline">
              {new Date(openedNote.createdAt).toLocaleDateString()}
            </span>
          </div>
          <hr className="text-background" />
          <div className="flex gap-x-4 px-4 py-3">
            <img src="./src/assets/images/Folder.png" alt="folder icon" />
            <span className="text-white60 font-medium">Folder</span>
            <span className="text-white underline">
              {openedNote.folder.name}
            </span>
          </div>
          <div className="text-white px-4 py-4">
            <textarea className="size-full" name="content" id="content">
              {openedNote.content}
            </textarea>
          </div>
        </>
      )}
    </div>
  );
}
