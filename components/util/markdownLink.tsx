import React from "react";
import Link from "next/link";

interface MarkdownLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url?: string;
  children?: React.ReactNode;
}

export const MarkdownLink: React.FC<MarkdownLinkProps> = ({ url = "", children, ...rest }) => {
  const isExternal = /^https?:\/\//i.test(url);
  if (isExternal) {
    return (
      <a href={url} target="_blank" rel="nofollow noopener" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={url} {...rest}>
      {children}
    </Link>
  );
};
