import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

type ContextType = {
  params: Promise<{ songName: string; track: string }>;
};

export async function GET(req: NextRequest, ctx: ContextType) {
  const { songName, track } = await ctx.params;

  const filePath = path.join(process.cwd(), "songs", decodeURIComponent(songName), `${track}.mp3`);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileSize = fs.statSync(filePath).size;

  const range = req.headers.get("range");
  let start = 0;
  let end = fileSize - 1;

  if (range) {
    const [startText, endText] = range.replace("bytes=", "").split("-");
    start = parseInt(startText, 10);
    if (endText) end = parseInt(endText, 10);
  }

  const stream = Readable.toWeb(fs.createReadStream(filePath, { start, end })) as ReadableStream;

  const headers: Record<string, string> = {
    "Content-Type": "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
  };

  if (range) {
    headers["Content-Range"] = `bytes ${start}-${end}/${fileSize}`;
    return new NextResponse(stream, { status: 206, headers });
  }

  return new NextResponse(stream, { status: 200, headers });
}
