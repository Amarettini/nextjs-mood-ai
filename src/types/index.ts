import { prisma } from "@/utils/db";
import { Prisma, JournalEntry } from "@prisma/client";

export interface DefaultApiResponse<T = any> {
  data: T;
  error: string;
}

export interface UpdateEntryRequestBody {
  content: string;
}

export interface UpdateEntryResponseBody extends DefaultApiResponse<string> { };
