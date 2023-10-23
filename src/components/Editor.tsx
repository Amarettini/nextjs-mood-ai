"use client";

import { Entry } from "@/types";
import { FunctionComponent } from "react";

interface Props {
  entry: Entry;
}

const Editor: FunctionComponent<Props> = ({ entry }) => {
  return <div>{entry.content}</div>;
};

export default Editor;
