import { DefaultApiResponse, UpdateEntryRequestBody } from "@/types";
import { analyze } from "@/utils/ai";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const resBody: DefaultApiResponse = { data: "", error: "" };

  const reqBody = await req.json();
  if (!(reqBody instanceof Object && Object.hasOwn(reqBody, "content"))) {
    // throw new Error("False patch request body, body has no `content` key");
    resBody.error = "Failed to parse request body as json. Body has no `content` key";
    return NextResponse.json<DefaultApiResponse>(resBody, { status: 500 });
  }
  const newContent = (reqBody as UpdateEntryRequestBody).content;

  const userId = (await getUserByClerkId()).id;
  const journalEntryId = params.id;
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId,
        id: journalEntryId,
      },
    },
    data: {
      content: newContent,
    },
  });

  const analysis = await analyze(updatedEntry.content);
  if (!analysis) {
    resBody.error = "Failed to analyze content of JournalEntry";
    return NextResponse.json<DefaultApiResponse>(resBody, { status: 500 });
  }

  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: analysis,
  });

  resBody.data = { ...updatedEntry, analysis: updated };
  return NextResponse.json<DefaultApiResponse>(resBody);
};
