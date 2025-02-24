export const NoteInitial = () => {
  return (
    <div className="flex flex-col items-center justify-center grow gap-y-4 px-6 py-6">
      <img
        className="size-fit"
        src="/src/assets/images/NoteIcon.png"
        alt="note icon"
      />
      <h1 className="text-white font-semibold text-xl">
        Select a note to view
      </h1>
      <p className="text-white60 text-sm w-[50%] text-pretty">
        Choose a note from the list on the left to view its contents, or create
        a new note to add to your collection.
      </p>
    </div>
  );
};
