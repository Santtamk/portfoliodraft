"use client";

/**
 * Text splitting for masked line/word reveals.
 *
 * The registry build of GSAP ships SplitText, but this utility is used instead
 * so the accessibility contract in Section 9 is guaranteed rather than
 * inherited: the split copy is `aria-hidden` and the untouched original stays
 * in the DOM as an `sr-only` sibling. Nothing here runs before hydration, so a
 * crawler (or a JS-disabled visitor) sees the original markup exactly as
 * authored — Section 7.1.
 */

type Token = { text: string; italic: boolean; spaceAfter: boolean };

export type Split = {
  lines: HTMLElement[];
  words: HTMLElement[];
  revert: () => void;
};

/**
 * Collects words in document order. Whitespace is recorded as a flag on the
 * preceding word rather than as a token of its own, so punctuation that follows
 * an inline tag — `make <em>sense</em>.` — is not pushed away from it.
 */
function tokenize(node: Node, italic: boolean, out: Token[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    const leading = /^\s/.test(text);
    if (leading && out.length > 0) out[out.length - 1].spaceAfter = true;

    const words = text.split(/\s+/).filter((word) => word.length > 0);
    words.forEach((word, index) => {
      out.push({ text: word, italic, spaceAfter: index < words.length - 1 });
    });

    if (/\s$/.test(text) && out.length > 0)
      out[out.length - 1].spaceAfter = true;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const nextItalic = italic || tag === "em" || tag === "i";
  for (const child of Array.from(el.childNodes)) {
    tokenize(child, nextItalic, out);
  }
}

/**
 * Splits `el` into per-line masks containing per-word spans.
 * Returns `null` when the element has no text.
 */
export function splitLines(el: HTMLElement): Split | null {
  const original = el.innerHTML;
  const tokens: Token[] = [];
  for (const child of Array.from(el.childNodes)) tokenize(child, false, tokens);
  if (tokens.length === 0) return null;

  // Pass 1 — flat word spans, so the browser can lay them out and tell us
  // where the real line breaks fall.
  const holder = document.createElement("span");
  holder.setAttribute("aria-hidden", "true");
  const flat: HTMLElement[] = [];

  tokens.forEach((token, index) => {
    const span = document.createElement("span");
    span.className = "split-word";
    if (token.italic) span.style.fontStyle = "italic";
    span.textContent = token.text;
    span.dataset.w = String(index);
    holder.appendChild(span);
    flat.push(span);
    if (token.spaceAfter) holder.appendChild(document.createTextNode(" "));
  });

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.innerHTML = original;

  el.textContent = "";
  el.appendChild(sr);
  el.appendChild(holder);

  // Pass 2 — group words into lines by vertical position, then rebuild with a
  // masking wrapper per line.
  const rows = new Map<number, HTMLElement[]>();
  for (const span of flat) {
    const top = Math.round(span.offsetTop);
    const key = [...rows.keys()].find((k) => Math.abs(k - top) < 4) ?? top;
    const bucket = rows.get(key);
    if (bucket) bucket.push(span);
    else rows.set(key, [span]);
  }

  const ordered = [...rows.entries()].sort((a, b) => a[0] - b[0]);
  const lines: HTMLElement[] = [];
  const wordEls: HTMLElement[] = [];

  holder.textContent = "";
  for (const [, spans] of ordered) {
    const line = document.createElement("span");
    line.className = "split-line";
    spans.forEach((span) => {
      line.appendChild(span);
      // A line break already supplies the gap, so only spaces that fall inside
      // the line are re-inserted.
      const token = tokens[Number(span.dataset.w)];
      if (token?.spaceAfter && span !== spans[spans.length - 1]) {
        line.appendChild(document.createTextNode(" "));
      }
      wordEls.push(span);
    });
    holder.appendChild(line);
    lines.push(line);
  }

  return {
    lines,
    words: wordEls,
    revert() {
      el.innerHTML = original;
    },
  };
}
