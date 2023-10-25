import { DefaultApiResponse, UpdateEntryRequestBody } from "@/types";

const createUrl = (path: string) => {
  return window.location.origin + path;
};

export const createNewEntry = async () => {
  const res = await fetch(
    new Request(createUrl("/api/journal"), {
      method: "POST",
    })
  );

  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};

export const updateEntry = async (id: string, content: string) => {
  const res = await fetch(
    new Request(createUrl(`/api/journal/${id}`), {
      method: "PATCH",
      body: JSON.stringify({ content } as UpdateEntryRequestBody),
    })
  );

  // TODO: improve error handling
  if (res.ok) {
    const data: DefaultApiResponse = await res.json();
    return data.data;
  }
};

export const askQuestion = async (question: string) => {
  const res = await fetch(
    new Request(createUrl("/api/question}"), {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  );

  // TODO: improve error handling
  if (res.ok) {
    const data: DefaultApiResponse = await res.json();
    return data.data;
  }
};
