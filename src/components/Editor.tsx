"use client";

import { updateEntry } from "@/utils/api";
import { Analysis, JournalEntry, Prisma } from "@prisma/client";
import { FunctionComponent, useState } from "react";
import { useAutosave } from "react-autosave";

interface Props {
  // entry: Prisma.JournalEntryGetPayload<{ include: { analysis: true} }>;
  entry: JournalEntry & { analysis: Analysis };
}

// TODO: fix useAutosave executing twice on initial page load, should only run when user changes text
const Editor: FunctionComponent<Props> = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  const { summary, subject, mood, isNegative, color } = analysis;
  const analysisData = [
    { name: "Summary", value: summary },
    { name: "Subject", value: subject },
    { name: "Mood", value: mood },
    { name: "Negative", value: isNegative ? "True" : "False" },
  ];

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const data = await updateEntry(entry.id, _value);
      console.log("Saveing...");
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });

  if (!entry.analysis) {
    return <div className="h-full w-full">Failed to load Journal Entry Analysis.</div>;
  }

  //const changeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  //  setValue(e.target.value);
  //};

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>...loading</div>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
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

export default Editor;
