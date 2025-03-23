import DOMPurify from "dompurify";

export const sanitizeAndNormalize = (value: string): string => {
  // Sanitize user input (this won't change tags added by the browser)
  let result = DOMPurify.sanitize(value);

  // Chrome: <div><br/></div>
  result = result.replace(/<div><br\s*\/?><\/div>/gi, "<br/>");

  // Wrapping divs
  result = result.replace(/<div>/gi, "<br/>").replace(/<\/div>/gi, "");

  // Wrapping ps
  result = result.replace(/<p>/gi, "<br/>").replace(/<\/p>/gi, "");

  // Handle some browsers converting some spaces to &nbsp;
  result = result.replace(/&nbsp;/g, " ");

  return result;
};

export interface CursorPosition {
  x: number;
  y: number;
  char: number;
}

export const getCursorPosition = (element: HTMLDivElement): CursorPosition => {
  // First get cursor position without taking into account the sanitized HTML
  const selection = window.getSelection();
  if (!selection || !element) return { x: 0, y: 0, char: 0 };
  const range = selection.getRangeAt(0);
  if (!range) return { x: 0, y: 0, char: 0 };
  const clonedRange = range.cloneRange();
  clonedRange.selectNodeContents(element);
  clonedRange.setEnd(range.endContainer, range.endOffset);
  const position = range.getClientRects()[0];

  // Get HTML up to cursor position to apply the sanitization
  const tempDiv = document.createElement("div");
  tempDiv.appendChild(clonedRange.cloneContents());
  const processedText = sanitizeAndNormalize(tempDiv.innerHTML);

  return {
    x: position?.x ?? 0,
    y: position?.y ?? 0,
    char: processedText.length,
  };
};

export const getMentionQuery = (
  text: string,
  cursorPosition: number,
): string | null => {
  if (!text) return null;
  if (cursorPosition < 0 || cursorPosition > text.length) return null;

  // Find the last space or line break before the cursor
  const lastSpace = text.lastIndexOf(" ", cursorPosition - 1);
  const lastBr = text.lastIndexOf("<br/>", cursorPosition - 1);

  // Start of current word
  let wordStart = 0;
  if (lastSpace === -1 && lastBr === -1) {
    wordStart = 0;
  } else if (lastSpace > lastBr) {
    wordStart = lastSpace + 1;
  } else {
    wordStart = lastBr + 5;
  }

  // Find the next space or line break after the cursor
  const nextSpace = text.indexOf(" ", cursorPosition);
  const nextBr = text.indexOf("<br/>", cursorPosition);

  // End of current word
  let wordEnd = text.length;
  if (nextSpace === -1 && nextBr === -1) {
    wordEnd = text.length;
  } else if (nextSpace === -1) {
    wordEnd = nextBr;
  } else if (nextBr === -1) {
    wordEnd = nextSpace;
  } else {
    wordEnd = Math.min(nextSpace, nextBr);
  }

  if (wordEnd <= wordStart) return null;
  if (cursorPosition <= wordStart || cursorPosition > wordEnd) return null;

  const currentWord = text.substring(wordStart, wordEnd).trim();

  // If word doesn't start with mention or has multiple @s return false
  if (!currentWord.startsWith("@")) return null;
  if (currentWord.indexOf("@", 1) !== -1) return null;

  return currentWord.slice(1);
};
