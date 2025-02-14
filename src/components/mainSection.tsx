import { useState } from "react";

export default function MainSection() {
  const [noteState, setNoteState] = useState<"initial" | "deleted" | "open">(
    "initial"
  );

  return (
    <div className="flex flex-col gap-y-4 justify-center grow">
      {noteState === "initial" ? (
        <div className="flex flex-col gap-y-2 items-center">
          <img src="./src/assets/images/NoteIcon.png" alt="note icon" />
          <h1 className="text-white font-semibold text-xl">
            Select a note to view
          </h1>
          <p className="text-white60 text-sm">
            Choose a note from the list on the left to view its contents, or
            create a new note to add to your collection.
          </p>
        </div>
      ) : noteState === "deleted" ? (
        <div>
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
