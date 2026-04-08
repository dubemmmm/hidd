import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="mdx-heading-lg" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="mdx-heading-md" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="mdx-copy" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="mdx-list" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mdx-list mdx-list--ordered" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="mdx-list-item" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="mdx-strong" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => {
    const href = props.href ?? "#";
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return <Link href={href} className="text-link" {...props} />;
    }

    return <a className="text-link" target="_blank" rel="noreferrer" {...props} />;
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="mdx-quote" {...props} />
  )
};
