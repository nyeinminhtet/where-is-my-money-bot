import { NextRequest, NextResponse } from "next/server";

import { handleTelegramUpdate } from "@/lib/bot";
import { sendMessage } from "@/lib/telegram/client";
import { verifyWebAppSecret } from "@/lib/security/validate-telegram-data";

export const POST = async (request: NextRequest) => {
  const secretToken = request.headers.get("x-telegram-bot-api-secret-token");
  if (!verifyWebAppSecret(secretToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const update = await request.json();
    const msg = update.message;
    if (msg) {
      // Only block video, document, and audio (not voice/photos — those are handled by the bot)
      if (msg.document || msg.audio || msg.video) {
        await sendMessage(
          msg.chat.id,
          "⚠️ မင်္ဂလာပါ! ကျွန်တော်က ဗွီဒီယို၊ ဖိုင်တွေကို လက်ခံနိုင်တာ မဟုတ်ပါဘူး။ ကျေးဇူးပြု၍ စာသား၊ အသံ (Voice) သို့မဟုတ် ဓာတ်ပုံ ပို့ပေးပါ။",
        );
        return NextResponse.json({ ok: true });
      }
      if (msg.text) {
        const emojiRegex =
          /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F004}\u{1F170}-\u{1F19A}]+$/u;
        if (emojiRegex.test(msg.text.trim())) {
          await sendMessage(
            msg.chat.id,
            "⚠️ မင်္ဂလာပါ! ကျွန်တော်က emoji တွေကို လက်ခံနိုင်တာ မဟုတ်ပါဘူး။ ကျေးဇူးပြု၍ စာသားပဲ ပို့ပေးပါ။",
          );
          return NextResponse.json({ ok: true });
        }
      }
    }
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
};
