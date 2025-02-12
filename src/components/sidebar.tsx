import Folders from "./folders";
import More from "./more";
import Recents from "./recents";

export default function Sidebar() {
  //const [showSearchIcon, setShowSearchIcon] = useState(false);
  const onClickHandler = () => {};

  return (
    <>
      <div className="flex flex-col gap-y-8 h-full w-[20%] bg-main-black">
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
          <button className="bg-background w-[86%] py-2 rounded-sm font-sans text-white font-semibold">
            <span className="text-xl">+</span> New Note
          </button>
        </div>
        <Recents />
        <Folders />
        <More />
      </div>
    </>
  );
}
