import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../axiosConfig";
import { toast } from "react-toastify";
import restoreIcon from "../assets/images/RestoreIcon.png";

type RestoreNoteComponentProps = {
  noteTitle: string;
  setNoteState: React.Dispatch<
    React.SetStateAction<"deleted" | "initial" | "open">
  >;
  noteId: string | undefined;
  folderName: string;
  folderId: string;
};

export const RestoreNote = ({
  noteTitle,
  setNoteState,
  noteId,
  folderName,
  folderId,
}: RestoreNoteComponentProps) => {
  const [_, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col gap-y-2 grow items-center justify-center">
      <img className="size-fit" src={restoreIcon} alt="Restore note image" />
      <h1 className="text-white text-3xl font-semibold">
        Restore "{noteTitle}"
      </h1>
      <p className="text-white60 text-sm">
        Don't want to lose this note? It's not too late! Just click the
        'Restore' button and it will be added back to your list. It's that
        simple.
      </p>
      <button
        onClick={restoreButtonClickHandler}
        className="px-2 py-2 bg-note-blue text-white rounded-md"
      >
        Restore
      </button>
    </div>
  );
};
