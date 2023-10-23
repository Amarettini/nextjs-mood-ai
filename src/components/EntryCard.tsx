import { JournalEntry, Analysis, Prisma } from "@prisma/client";
import { FunctionComponent } from "react";

// https://github.com/prisma/prisma/discussions/10928
type JournalEntryWithAnalisys = Prisma.JournalEntryGetPayload<{ include: { analysis: true } }>;

interface Props {
  entry: JournalEntryWithAnalisys;
}

const EntryCard: FunctionComponent<Props> = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5">{date}</div>
      <div className="px-4 py-5">{entry?.analysis?.summary}</div>
      <div className="px-4 py-4">{entry?.analysis?.mood}</div>
    </div>
  );
};

export default EntryCard;
