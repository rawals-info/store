import React from "react"
import Link from "next/link"

interface MarkdownRendererProps {
  content: string
  countryCode: string
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// Inline parser for bold, italics, links, and inline code
function parseInline(text: string, countryCode: string): React.ReactNode[] {
  const elements: React.ReactNode[] = []
  
  // Regex tokenizing: Links [text](url), Bold **text**, Italic *text*, Inline code `code`
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  const tokens = text.split(tokenRegex)

  tokens.forEach((token, idx) => {
    if (!token) return

    // Link: [label](url)
    const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const label = linkMatch[1]
      let href = linkMatch[2]
      if (href.startsWith("/in/")) {
        href = href.replace("/in/", `/${countryCode}/`)
      }
      elements.push(
        <Link
          key={idx}
          href={href}
          className="text-amber-800 font-semibold underline decoration-amber-300 hover:text-amber-950 hover:decoration-amber-600 transition-colors"
        >
          {label}
        </Link>
      )
      return
    }

    // Bold: **text**
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      elements.push(
        <strong key={idx} className="font-bold text-slate-950">
          {token.slice(2, -2)}
        </strong>
      )
      return
    }

    // Italic: *text*
    if (token.startsWith("*") && token.endsWith("*") && token.length >= 2) {
      elements.push(
        <em key={idx} className="italic text-slate-800">
          {token.slice(1, -1)}
        </em>
      )
      return
    }

    // Inline Code: `code`
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      elements.push(
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 font-mono text-xs border border-amber-200"
        >
          {token.slice(1, -1)}
        </code>
      )
      return
    }

    // Plain Text
    elements.push(<span key={idx}>{token}</span>)
  })

  return elements
}

export default function MarkdownRenderer({
  content,
  countryCode,
}: MarkdownRendererProps) {
  // Normalize line breaks
  const normalized = content.replace(/\r\n/g, "\n")
  const lines = normalized.split("\n")
  const blocks: React.ReactNode[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // 1. Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // 2. Horizontal Rule (---)
    if (trimmed === "---" || trimmed === "***") {
      blocks.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-amber-200/60" />
      )
      i++
      continue
    }

    // 3. Heading 2 (## Title)
    if (trimmed.startsWith("## ")) {
      const headingText = trimmed.replace(/^##\s+/, "").replace(/\*\*/g, "")
      const id = slugify(headingText)
      blocks.push(
        <h2
          key={`h2-${i}`}
          id={id}
          className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 pt-6 border-t border-slate-100 first:border-0 first:pt-0 scroll-mt-24"
        >
          {parseInline(headingText, countryCode)}
        </h2>
      )
      i++
      continue
    }

    // 4. Heading 3 (### Title)
    if (trimmed.startsWith("### ")) {
      const headingText = trimmed.replace(/^###\s+/, "").replace(/\*\*/g, "")
      const id = slugify(headingText)
      blocks.push(
        <h3
          key={`h3-${i}`}
          id={id}
          className="font-cormorant text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-3 scroll-mt-24"
        >
          {parseInline(headingText, countryCode)}
        </h3>
      )
      i++
      continue
    }

    // 5. Blockquote (> Quote)
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""))
        i++
      }
      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className="p-5 my-6 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-slate-800 italic text-sm sm:text-base leading-relaxed space-y-2 shadow-2xs"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx}>{parseInline(ql, countryCode)}</p>
          ))}
        </blockquote>
      )
      continue
    }

    // 6. Table (| Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim().startsWith("|") &&
        lines[i].trim().endsWith("|")
      ) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split("|")
            .map((c) => c.trim())
            .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1)

        const headerCols = parseRow(tableLines[0])
        const isDivider = (str: string) => /^:?-+:?$/.test(str.trim())
        const dataRows = tableLines
          .slice(1)
          .filter((row) => !parseRow(row).every(isDivider))
          .map(parseRow)

        blocks.push(
          <div
            key={`table-${i}`}
            className="my-6 overflow-x-auto rounded-2xl border border-amber-200/80 shadow-xs"
          >
            <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white">
              <thead>
                <tr className="bg-amber-100/70 border-b border-amber-200 text-amber-950 font-bold">
                  {headerCols.map((h, hIdx) => (
                    <th key={hIdx} className="p-3 sm:p-4 font-bold text-amber-950">
                      {parseInline(h, countryCode)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/60">
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-amber-50/40 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 sm:p-4 text-slate-700">
                        {parseInline(cell, countryCode)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    }

    // 7. Numbered List (1. Item)
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""))
        i++
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className="list-decimal pl-5 space-y-2.5 my-4 text-slate-700 text-sm sm:text-base leading-relaxed"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              {parseInline(item, countryCode)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // 8. Bullet List (- Item or * Item)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listItems: string[] = []
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))
      ) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ""))
        i++
      }
      blocks.push(
        <ul
          key={`ul-${i}`}
          className="list-disc pl-5 space-y-2.5 my-4 text-slate-700 text-sm sm:text-base leading-relaxed"
        >
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="pl-1">
              {parseInline(item, countryCode)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // 9. Standard Paragraph (or multi-line paragraph)
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("> ") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("---") &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ")
    ) {
      paragraphLines.push(lines[i].trim())
      i++
    }

    if (paragraphLines.length > 0) {
      const fullPara = paragraphLines.join(" ")
      blocks.push(
        <p
          key={`p-${i}`}
          className="leading-relaxed text-slate-700 my-4 text-sm sm:text-base"
        >
          {parseInline(fullPara, countryCode)}
        </p>
      )
    }
  }

  return <div className="space-y-4">{blocks}</div>
}
