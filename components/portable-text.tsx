import type { PortableTextComponents } from "next-sanity";

import { urlForSanityImage } from "@/lib/sanity";

type ArticleImageValue = {
  asset?: { _ref?: string };
  alt?: string;
  caption?: string;
  credit?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
};

type ArticleTableValue = {
  caption?: string;
  headers?: string[];
  rows?: Array<{ _key?: string; cells?: string[] }>;
};

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
  types: {
    articleImage: ({ value }: { value: ArticleImageValue }) => {
      if (!value?.asset?._ref) return null;

      const imageUrl = urlForSanityImage(value).width(1600).fit("max").auto("format").url();
      const caption = value.caption?.trim();
      const credit = value.credit?.trim();

      return (
        <figure className="article-body-image">
          <img src={imageUrl} alt={value.alt?.trim() || ""} loading="lazy" />
          {caption || credit ? (
            <figcaption>
              {caption ? <span>{caption}</span> : null}
              {credit ? <small>Image: {credit}</small> : null}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    articleTable: ({ value }: { value: ArticleTableValue }) => {
      const headers = (value.headers ?? []).filter((header) => header?.trim());
      if (headers.length === 0) return null;

      return (
        <figure className="article-table">
          {value.caption?.trim() ? <figcaption>{value.caption.trim()}</figcaption> : null}
          <div className="article-table__scroll">
            <table>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={`${header}-${index}`} scope="col">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(value.rows ?? []).map((row, rowIndex) => (
                  <tr key={row._key ?? rowIndex}>
                    {headers.map((_, cellIndex) => (
                      <td key={cellIndex}>{row.cells?.[cellIndex] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    }
  },
  marks: {
    strong: ({ children }) => <strong className="mdx-strong">{children}</strong>,
    link: ({ children, value }) => (
      <a href={value?.href} className="text-link" target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
};
