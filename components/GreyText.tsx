import { Fragment } from "react";
import { greyParts } from "@/lib/specText";

/** Renders CMS header copy, showing any [bracketed] words in grey. */
export default function GreyText({ text }: { text: string }) {
  return (
    <>
      {greyParts(text).map((p, i) =>
        p.grey ? <span key={i} className="editorial-muted grey-inline">{p.text}</span> : <Fragment key={i}>{p.text}</Fragment>
      )}
    </>
  );
}
