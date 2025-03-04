import { useEffect, useState } from "react";

type NoteContentComponentProps = {
  noteContent: string;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
  updateNote: () => void;
};

export default function NoteContent({
  noteContent,
  setNoteContent,
  updateNote,
}: NoteContentComponentProps) {
  const [debouncedValue, setDebouncedValue] = useState("");
  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(e.target.value);
  };

  useEffect(() => {
    if (debouncedValue === noteContent) return;
    const timeout = setTimeout(() => {
      setDebouncedValue(noteContent);
      updateNote();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [noteContent, debouncedValue]);

  return (
    <div className="text-white px-4 grow py-4">
      <textarea
        onChange={onChangeHandler}
        value={noteContent}
        className="size-full"
        name="content"
        id="content"
      ></textarea>
    </div>
  );
}
