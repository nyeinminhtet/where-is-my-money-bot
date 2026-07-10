import { NextRequest, NextResponse } from "next/server";

import { handleTelegramUpdate } from "@/lib/bot";

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();

    await handleTelegramUpdate(update);

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Telegram webhook error:", error);

    return NextResponse.json(
      {
        ok: false,
      },
      {
        status: 500,
      },
    );
  }
}
