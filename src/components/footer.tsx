import { site, resumeUrl } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-5xl w-full px-6 py-16 mt-auto">
      <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-serif text-lg text-fg">{site.name}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
          >
            {site.email}
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
          >
            GitHub
          </a>
          <span className="text-fg-muted">·</span>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
          >
            LinkedIn
          </a>
          <span className="text-fg-muted">·</span>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
          >
            Resume
          </a>
          <span className="text-fg-muted">·</span>
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-fg-muted hover:text-fg transition-colors duration-200"
          >
            Email
          </a>
        </div>
      </div>
      <p className="text-xs text-fg-muted mt-4">
        {site.location}. Last updated {site.lastUpdated}.
      </p>
    </footer>
  );
}
