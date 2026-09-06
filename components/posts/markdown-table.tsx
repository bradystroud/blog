import React from "react";
import type { Components } from "tinacms/dist/rich-text";

/*
  Tina's built-in table renderer emits inline borders and padding and treats
  every row as a body row, so tables looked like a spreadsheet grid. These
  overrides drop the inline styles and let the site's tokens do the work.

  Markdown tables always begin with a header row, and Tina gives the cells no
  row index, so the header is picked out with a first-child selector on the
  table rather than a prop.
*/

type CellProps = {
  align?: "left" | "center" | "right";
  children?: React.ReactNode;
};

const Table = ({ children }: { children?: React.ReactNode }) => (
  <div className="not-prose my-8 overflow-x-auto rounded-xl border border-rule bg-surface">
    <table
      className={[
        // Grow to the content so narrow screens scroll the box instead of
        // crushing every column, but cap prose cells so they still wrap.
        "w-max min-w-full border-collapse text-[0.95rem] leading-relaxed",
        "[&_td]:max-w-[22rem] [&_code]:whitespace-nowrap",
        // Header row: the first row of the table.
        "[&_tr:first-child_td]:mono [&_tr:first-child_td]:text-[0.68rem] [&_tr:first-child_td]:font-semibold",
        "[&_tr:first-child_td]:uppercase [&_tr:first-child_td]:tracking-[0.14em] [&_tr:first-child_td]:text-ink-mute",
        "[&_tr:first-child_td]:bg-paper [&_tr:first-child_td]:border-t-0 [&_tr:first-child_td]:py-3",
        // First column reads as the row label.
        "[&_tr:not(:first-child)_td:first-child]:text-ink [&_tr:not(:first-child)_td:first-child]:font-medium",
      ].join(" ")}
    >
      {children}
    </table>
  </div>
);

const Tr = ({ children }: { children?: React.ReactNode }) => (
  <tr className="transition-colors hover:bg-paper/70">{children}</tr>
);

const Td = ({ align, children }: CellProps) => (
  <td
    className="border-t border-rule px-4 py-2.5 align-top text-ink-soft"
    style={align ? { textAlign: align } : undefined}
  >
    {children}
  </td>
);

// Tina's component map is typed against its own node props, which are looser
// than these. The cast keeps the override small without losing the runtime shape.
export const markdownTableComponents = {
  table: Table,
  tr: Tr,
  td: Td,
} as unknown as Components<Record<string, unknown>>;
