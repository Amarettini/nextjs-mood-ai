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
  });
  return entry;
};

const EntryPage: FunctionComponent<Props> = async ({ params }) => {
  const entry = await getEntry(params.id);
  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
};

export default EntryPage;
