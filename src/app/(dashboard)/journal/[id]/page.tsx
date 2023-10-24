import Editor from "@/components/Editor";
import { getUserByClerkId } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { FunctionComponent } from "react";

interface Props {
  params: { id: string };
}

// Executed on every request -> Get authed user by cookie -> Query entrys of authed user by id
const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUniqueOrThrow({
    where: { userId_id: { userId: user.id, id } },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage: FunctionComponent<Props> = async ({ params }) => {
  const entry = await getEntry(params.id);

  if (!entry.analysis) {
    return <div className="h-full w-full">Failed to load Journal Entry Analysis.</div>;
  }

  const { summary, subject, mood, isNegative, color } = entry.analysis;
  const analysisData = [
    { name: "Summary", value: summary },
    { name: "Subject", value: subject },
    { name: "Mood", value: mood },
    { name: "Negative", value: isNegative ? "True" : "False" },
  ];

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
                key={item.name}
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
