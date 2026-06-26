"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type ArticleGateProps = {
  slug: string;
  title: string;
  children: ReactNode;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ArticleGate({ slug, title, children }: ArticleGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [responseMessage, setResponseMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("submitting");
    setResponseMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/insight-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          slug,
          website: formData.get("website"),
          submittedAt: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Request failed");
      }

      setStatus("success");
      setResponseMessage(result.message ?? "Thanks. Enjoy the full article.");
      setUnlocked(true);
    } catch (error) {
      setStatus("error");
      setResponseMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    }
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="article-gate">
      <div className="article-gate__preview" aria-hidden="true">
        {children}
        <div className="article-gate__fade" />
      </div>

      <div className="article-gate__panel">
        <span className="section-heading__eyebrow">Continue reading</span>
        <h2>Unlock the full article</h2>
        <p>
          Enter your name and email to read &ldquo;{title}&rdquo; in full. It only takes a
          moment.
        </p>

        <form className="article-gate__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="field">
              <span>Full Name</span>
              <input type="text" name="name" placeholder="Adaora Okafor" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
          </div>

          <label className="field field--hidden" aria-hidden="true">
            <span>Website</span>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="article-gate__form-footer">
            <button
              type="submit"
              className="button button--primary"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Unlocking..." : "Unlock article"}
            </button>
            <p className={`form-message form-message--${status}`}>
              {status === "idle" && "Enter your details to read the full article."}
              {status === "error" && responseMessage}
              {status === "success" && responseMessage}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
