import Link from "next/link";
import * as React from "react";
import { BiRightArrowAlt } from "react-icons/bi";

export const Actions = ({ parentField = "", className = "", actions }) => {
  return (
    <div className={`flex flex-wrap items-center gap-y-4 gap-x-6 ${className}`}>
      {actions &&
        actions.map(function (action, index) {
          if (action.type === "button") {
            return (
              <Link
                key={index}
                href={action.link ? action.link : "/"}
                data-tinafield={`${parentField}.${index}`}
                className="group/btn inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-medium text-accent-ink transition-opacity duration-200 hover:opacity-90 focus:outline-none whitespace-nowrap"
              >
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt
                    className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/btn:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          }
          if (action.type === "link" || action.type === "linkExternal") {
            return (
              <Link
                key={index}
                href={action.link ? action.link : "/"}
                data-tinafield={`${parentField}.${index}`}
                className="group/lnk inline-flex items-center gap-1 text-base font-medium text-ink-soft underline underline-offset-4 transition-colors duration-200 hover:text-accent"
              >
                {action.label}
                {action.icon && (
                  <BiRightArrowAlt
                    className="h-5 w-5 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/lnk:translate-x-0.5"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          }
          return null;
        })}
    </div>
  );
};
