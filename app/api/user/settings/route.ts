import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  validateTelegramInitData,
  ValidatedTelegramData,
} from "@/lib/security/validate-telegram-data";
import { checkRateLimit } from "@/lib/rate-limiter";

const extractAndValidateAuth = (
  request: Request,
): ValidatedTelegramData | null => {
  const initDataHeader = request.headers.get("x-telegram-init-data");
  if (initDataHeader) {
    return validateTelegramInitData(initDataHeader);
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("tma ")) {
    return validateTelegramInitData(authHeader.slice(4));
  }
  if (authHeader?.startsWith("Bearer ")) {
    return validateTelegramInitData(authHeader.slice(7));
  }

  return null;
};

export const GET = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitOk = checkRateLimit(`user:${authData.user.id}`, 30);
    if (!rateLimitOk) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: String(authData.user.id) },
      select: { language: true },
    });

    console.log("User settings fetched:", user);

    return NextResponse.json({
      language: user?.language ?? "mm",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const authData = extractAndValidateAuth(request);
    if (!authData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitOk = checkRateLimit(`user:${authData.user.id}`, 30);
    if (!rateLimitOk) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    const language = body?.language;
    if (language !== "en" && language !== "mm") {
      return NextResponse.json(
        { error: "Invalid language. Must be 'en' or 'mm'." },
        { status: 400 },
      );
    }

    const user = await prisma.user.upsert({
      where: { telegramId: String(authData.user.id) },
      update: { language },
      create: {
        telegramId: String(authData.user.id),
        firstName: authData.user.first_name,
        username: authData.user.username,
        language,
      },
      select: { language: true },
    });

    return NextResponse.json({ language: user.language });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
