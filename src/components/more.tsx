import { useNavigate } from "react-router-dom";

export default function More() {
  const navigate = useNavigate();

  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    const element = e.target as HTMLSpanElement;
    navigate(`/more?folderName=${element.id}`);
  };

  return (
    <div className="flex flex-col grow gap-4 px-4">
      <h1 className="text-white60 text-sm px-4 font-semibold">More</h1>
      <ul>
        <li className="flex gap-x-4 py-2 px-2 cursor-pointer ">
          <img src="/src/assets/images/Favorites.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Favorites"
            className="grow text-white60 font-semibold hover:text-white"
          >
            Favorites
          </span>
        </li>
        <li className="flex gap-x-4 py-2 px-2 cursor-pointer ">
          <img src="/src/assets/images/TrashBin.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Trash"
            className="grow text-white60 font-semibold hover:text-white"
          >
            Trash
          </span>
        </li>
        <li className="flex gap-x-4 py-2 px-2 cursor-pointer">
          <img src="/src/assets/images/Archived.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Archived"
            className="grow text-white60 font-semibold hover:text-white"
          >
            Archived
          </span>
        </li>
      </ul>
    </div>
  );
}
