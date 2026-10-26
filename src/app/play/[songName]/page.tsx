import { KaraokePlayer } from "./components/KaraokePlayer";

type PropsType = {
  params: Promise<{
    songName: string;
  }>;
};

export default async function Page(props: PropsType) {
  const params = await props.params;
  const audioUrl = `/api/song/${encodeURIComponent(params.songName)}`;

  return (
    <div>
        <KaraokePlayer songName={params.songName}/>
    </div>
  );
}
