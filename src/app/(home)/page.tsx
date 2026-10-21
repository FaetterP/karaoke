import SongList from "./components/SongList";

export default function Home() {
  const songs = [
    {name: "qqq"},
    {name: "www"},
    {name: "eee"},
  ]
  
  return (
    <div>
      <SongList songs={songs} />
    </div>
  );
}
