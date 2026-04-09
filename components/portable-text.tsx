import type { PortableTextComponents } from "next-sanity";

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mdx-copy">{children}</p>,
    h2: ({ children }) => <h2 className="mdx-heading-lg">{children}</h2>,
    h3: ({ children }) => <h3 className="mdx-heading-md">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="mdx-quote">{children}</blockquote>
  },
  list: {
    bullet: ({ children }) => <ul className="mdx-list">{children}</ul>,
    number: ({ children }) => <ol className="mdx-list mdx-list--ordered">{children}</ol>
  },
  listItem: ({ children }) => <li className="mdx-list-item">{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="mdx-strong">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} className="text-link" target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
};
