import { useEffect, useState } from "react";
import { note } from "../models/note";
import axiosApi from "../../axiosConfig";

interface notes {
  notes: note[];
}

interface Folder {
  id: string;
  name: string;
}

interface MidSectionProps {
  folder: Folder;
  onNoteSelect: (id: string) => void;
}

export default function MidSection({ folder, onNoteSelect }: MidSectionProps) {
  const [allNotes, setNotes] = useState<note[]>([]);

  const getNotes = async () => {
    await axiosApi
      .get<notes>(`/notes?folderId=${folder.id}&page${1}&limit=${10}`)
      .then((res) => {
        const data = res.data;
        setNotes([...data.notes]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getNotes();
  }, [folder]);

  const onClickHandler = (id: string) => {
    onNoteSelect(id);
  };

  return (
    <div className="bg-dark-gray flex flex-col gap-y-4 w-[20%] h-full">
      <h1 className="text-xl text-white font-semibold px-4 py-4">
        {folder.name}
      </h1>
      <div className="flex flex-col gap-y-2 px-4 py-4 grow">
        {allNotes.map((item) => {
          return (
            <div
              onClick={() => {
                onClickHandler(item.id);
              }}
              key={item.id}
              className="flex flex-col gap-y-2 bg-background py-4 px-4 rounded-md"
            >
              <p className="font-semibold text-white">{item.title}</p>
              <p>
                <span className="text-[#FFFFFF66]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-white60 px-2">
                  {item.content}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
