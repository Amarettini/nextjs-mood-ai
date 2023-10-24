import { DefaultApiResponse } from "@/types";
import { analyze } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
    },
  });

  const analysis = await analyze(entry.content);
  if (!analysis) {
    return NextResponse.json<DefaultApiResponse>({ data: "", error: "Something went wrong." }, { status: 500 })
  }

  await prisma.analysis.create({
    data: {
      entryId: entry.id,
      mood: analysis.mood,
      subject: analysis.subject,
      summary: analysis.summary,
      color: analysis.color,
      isNegative: analysis.isNegative
    }
  })

  revalidatePath("/journal");

  return NextResponse.json({ data: entry });
};
