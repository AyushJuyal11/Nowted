import { useState } from "react";
import MainSection from "./mainSection";
import MidSection from "./midSection";
import Sidebar from "./sidebar";

type RootComponentProps = {
  setAddNoteClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RootComponent() {
  const [addNoteClicked, setAddNoteClicked] = useState(false);
  return (
    <div className="h-full flex bg-main-black">
      <Sidebar
        addNoteClicked={addNoteClicked}
        setAddNoteClicked={setAddNoteClicked}
      />
      <MidSection />
      <MainSection />
    </div>
  );
}
