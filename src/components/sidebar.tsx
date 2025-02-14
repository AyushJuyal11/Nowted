import { useEffect, useState } from "react";
import Folders from "./folders";
import More from "./more";
import Recents from "./recents";

interface sidebarComponentProps {
  onFolderSelect: (id: string, title: string) => void;
}

export default function Sidebar({ onFolderSelect }: sidebarComponentProps) {
  const [searchIconVisible, setSearchIconVisible] = useState(false);
  //const [addNoteClicked, setAddNoteClicked] = useState(false);

  const onClickHandler = () => {
    setSearchIconVisible((prev) => !prev);
  };

  //useEffect(() => {}, [addNoteClicked]);

  return (
    <>
      <div className="flex flex-col gap-y-8 h-full w-[20%]">
        <div className="flex justify-between">
          <img
            className="px-8 py-4"
            src="./src/assets/images/Logo.png"
            alt="Nowted logo"
          />
          <button onClick={onClickHandler}>
            <img
              className="px-8 py-4"
              src="./src/assets/images/SearchIcon.png"
              alt="Search button"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => {}}
            className="bg-background w-[86%] py-2 rounded-sm font-sans "
          >
            {searchIconVisible ? (
              <div className="flex gap-x-2">
                <img
                  className="px-2"
                  src="./src/assets/images/SearchIcon.png"
                  alt=""
                />
                <input
                  type="search"
                  className="font-sans text-white font-medium"
                  placeholder="Search note"
                />
              </div>
            ) : (
              <p>
                <span className="text-xl text-white font-semibold">+</span>{" "}
                <span className="text-white font-semibold">New Note</span>
              </p>
            )}
          </button>
        </div>
        <Recents />
        <Folders onFolderSelect={onFolderSelect} />
        <More />
      </div>
    </>
  );
}
