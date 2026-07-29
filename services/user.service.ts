import { prisma } from "@/lib/prisma";
import type { TelegramUser } from "@/types/telegram";

export const getUserByTelegramId = async (telegramId: string) => {
    return prisma.user.findUnique({
        where: {
            telegramId,
        },
    });
};

export const findOrCreateUser = async (telegramUser: TelegramUser) => {
    let user = await getUserByTelegramId(telegramUser.id.toString());
    if (user) {
        return user;
    }
    user = await prisma.user.create({
        data: {
            telegramId: telegramUser.id.toString(),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
        },
    });
    return user;
};
