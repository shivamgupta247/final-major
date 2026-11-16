import { Liveblocks } from "@liveblocks/node";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import randomColor from "randomcolor";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Use Clerk user ID for Liveblocks presence
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName || user.firstName || "Anonymous",
      avatar: user.imageUrl,
      color: randomColor({ luminosity: "dark" }),
    },
  });

  const body = await request.json();
  const { room } = body;
  
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body: sessionBody } = await session.authorize();

  return new NextResponse(sessionBody, { status });
}
