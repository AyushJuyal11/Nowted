import axios from "axios";
import { useEffect, useState } from "react";
import { recentNotes } from "../models/recentNotes";
import { note } from "../models/note";

export default function Recents() {
  const [recents, setRecentNotes] = useState<note[]>([]);

  const recentNotes = async () => {
    await axios
      .get<recentNotes>("api/notes/recent")
      .then((res) => {
        setRecentNotes([...res.data.recentNotes]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    recentNotes();
  }, []);

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-white/60 px-8 text-sm font-semibold">Recents</h1>
      <ul className="list-none flex flex-col gap-y-4 px-8">
        {recents.map((item) => {
          return (
            <li key={item.id} className="flex gap-x-2">
              <img
                className="w-[8%]"
                src="./src/assets/images/NoteIcon.png"
                alt="note icon"
              />
              <span className="text-white60 font-semibold">{item.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
