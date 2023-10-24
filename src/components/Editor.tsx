"use client";

import { updateEntry } from "@/utils/api";
import { JournalEntry } from "@prisma/client";
import { FunctionComponent, useState } from "react";
import { useAutosave } from "react-autosave";

interface Props {
  entry: JournalEntry;
}

// TODO: fix useAutosave executing twice on initial page load, should only run when user changes text
const Editor: FunctionComponent<Props> = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const updated = await updateEntry(entry.id, _value);
      console.log("Saveing...");
      setIsLoading(false);
    },
  });

  const changeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="w-full h-full">
      {isLoading && <div>...loading</div>}
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={value}
        onChange={changeHandler}
      />
    </div>
  );
};

export default Editor;
