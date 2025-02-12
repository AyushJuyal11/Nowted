export default function More() {
  return (
    <div className="flex flex-col gap-4 px-4">
      <h1 className="text-white60 text-sm px-4 font-semibold">More</h1>
      <ul>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/Favorites.png" alt="favorites" />
          <span className="grow text-white60 font-semibold">Favorites</span>
        </li>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/TrashBin.png" alt="favorites" />
          <span className="grow text-white60 font-semibold">Favorites</span>
        </li>
        <li className="flex gap-x-4 py-2 px-2">
          <img src="./src/assets/images/Archived.png" alt="favorites" />
          <span className="grow text-white60 font-semibold">Archived</span>
        </li>
      </ul>
    </div>
  );
}
