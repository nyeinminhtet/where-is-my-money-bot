import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { sendMessage } from "@/lib/telegram/client";
import { NextResponse } from "next/server";
import { getTranslation, type Locale } from "@/lib/i18n";

export const GET = async (request: Request) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${env.cronSecret}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                telegramId: true,
                language: true,
            },
        });

        let sentCount = 0;
        for (const user of users) {
            if (user.telegramId) {
                const lang: Locale = (user.language as Locale) || "mm";
                const reminderMessage = getTranslation(lang, "CRON_REMINDER");
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
