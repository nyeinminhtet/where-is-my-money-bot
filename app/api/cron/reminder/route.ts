import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/telegram/client";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${env.cronSecret}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    try {
        const users = await prisma.user.findMany({
            select: {
                telegramId: true,
            },
        });
        const reminderMessage = [
            "💸 **ဒီနေ့ ပိုက်ဆံတွေ ဘယ်ပျောက်ကုန်ပြီလဲ?**",
            "",
            "အိတ်ကပ်ထဲက ပိုက်ဆံ မထွက်ခင်/ထွက်ပြီးတာလေးတွေ စာရင်းမှတ်ထားလိုက်ဦးနော် 😉",
            "",
            "*(စာတိုရိုက်ပြီး တန်းပို့လိုက်ရုံပါပဲ)*",
        ].join("\n");
        let sentCount = 0;
        for (const user of users) {
            if (user.telegramId) {
                await sendMessage(user.telegramId.toString(), reminderMessage);
                sentCount++;
            }
        }
        return NextResponse.json({
            success: true,
            message: `Successfully sent reminders to ${sentCount} users.`,
        });
    }
    catch (error) {
        console.error("❌ Cron Reminder Error:", error);
        return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
    }
};
