import { auth } from "@clerk/nextjs";
import { prisma } from "./db";

export const getUserByClerkId = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated!");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  });

  return user;
};
