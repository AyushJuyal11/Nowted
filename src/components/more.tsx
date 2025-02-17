interface MoreComponentProps {
  onFolderSelect: (id: string, name: string) => void;
}

export default function More({ onFolderSelect }: MoreComponentProps) {
  const onClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    const element = e.target as HTMLSpanElement;
    onFolderSelect("", element.id);
  };

  return (
    <div className="flex flex-col grow gap-4 px-4">
      <h1 className="text-white60 text-sm px-4 font-semibold">More</h1>
      <ul>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/Favorites.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Favorites"
            className="grow text-white60 font-semibold"
          >
            Favorites
          </span>
        </li>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/TrashBin.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Trash"
            className="grow text-white60 font-semibold"
          >
            Trash
          </span>
        </li>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/Archived.png" alt="favorites" />
          <span
            onClick={onClickHandler}
            id="Archived"
            className="grow text-white60 font-semibold"
          >
            Archived
          </span>
        </li>
      </ul>
    </div>
  );
}
