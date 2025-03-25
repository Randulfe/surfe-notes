import DOMPurify from "dompurify";
import type { User } from "~/entities/user";

const DIV_CHROME_REGEX = /<div><br\s*\/?><\/div>/gi;
const DIV_OPEN_REGEX = /<div>/gi;
const DIV_CLOSE_REGEX = /<\/div>/gi;
const BR_REGEX = /<br>/gi;
const P_OPEN_REGEX = /<p>/gi;
const P_CLOSE_REGEX = /<\/p>/gi;
const MENTION_REGEX_HTML = /<span[^>]*><span[^>]*>@([^<]+)<\/span><\/span>/gi;
const NBSP_REGEX = /&nbsp;/g;

const MENTION_REGEX = /(^|(?:<br\s*\/?>|\s))(@(\S+))/gi;

export const sanitizeAndNormalize = (value: string): string => {
  if (!value) return "";
  // Sanitize user input (this won't change tags added by the browser)
  let result = DOMPurify.sanitize(value);

  // Chrome: <div><br/></div>
  result = result.replace(DIV_CHROME_REGEX, "<br/>");

  // Wrapping divs
  result = result.replace(DIV_OPEN_REGEX, "<br/>").replace(DIV_CLOSE_REGEX, "");

  // Convert <br> to <br/>
  result = result.replace(BR_REGEX, "<br/>");

  // Wrapping ps
  result = result.replace(P_OPEN_REGEX, "<br/>").replace(P_CLOSE_REGEX, "");

  // Convert mention components back to @username format
  result = result.replace(MENTION_REGEX_HTML, "@$1");

  // Handle some browsers converting some spaces to &nbsp;
  result = result.replace(NBSP_REGEX, " ");

  return result;
};

const getRange = (): Range | null => {
  const selection = window.getSelection();
  if (!selection) return null;
  const range = selection.getRangeAt(0);
  if (!range) return null;
  return range;
};

export interface CursorPosition {
  x: number;
  y: number;
  char: number;
}

export const getCursorPositionInHTML = (element: HTMLDivElement): number => {
  if (!element) return 0;
  const range = getRange();
  if (!range) return 0;
  // Create a temporary div to hold the content
  const tempDiv = document.createElement("div");

  // Get all child nodes of the element
  const childNodes = Array.from(element.childNodes);

  // Find the node containing our cursor
  const cursorNode = range.endContainer;
  const cursorOffset = range.endOffset;

  // Clone each node up to and including the cursor node
  for (const node of childNodes) {
    if (node === cursorNode) {
      // For the cursor node, only clone up to the cursor position
      const nodeFragment = document.createRange();
      nodeFragment.setStart(node, 0);
      nodeFragment.setEnd(cursorNode, cursorOffset);
      tempDiv.appendChild(nodeFragment.cloneContents());
      break;
    } else {
      // For nodes before the cursor node, clone the entire node
      tempDiv.appendChild(node.cloneNode(true));
    }
  }
  // HTML up to cursor
  const htmlUpToCursor = tempDiv.innerHTML;
  return htmlUpToCursor.length;
};

export const getCursorPosition = (element: HTMLDivElement): CursorPosition => {
  if (!element) return { x: 0, y: 0, char: 0 };

  // First get cursor position without taking into account the sanitized HTML
  const range = getRange();
  if (!range) return { x: 0, y: 0, char: 0 };

  const clonedRange = range.cloneRange();
  clonedRange.selectNodeContents(element);
  clonedRange.setEnd(range.endContainer, range.endOffset);
  const position = range.getClientRects()
    ? range.getClientRects()[0]
    : { x: 0, y: 0 };

  // Get HTML up to cursor position to apply the sanitization
  const tempDiv = document.createElement("div");
  tempDiv.appendChild(clonedRange.cloneContents());
  const processedText = sanitizeAndNormalize(tempDiv.innerHTML);

  return { x: position?.x, y: position?.y, char: processedText.length };
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

export const getMentionsDummyText = (
  value: string,
  userMap: Map<string, User>,
): string => {
  // Replace valid mentions with dummy span if user exists
  const newHTML = value.replace(MENTION_REGEX, (match, prefix, _, username) => {
    const user = userMap.get(username);
    if (!user) return match;
    return prefix + `<span data-username="${username}"></span>`;
  });
  return newHTML;
};

export const setCursorAfterNode = (selection: Selection, node: Node) => {
  const range = document.createRange();
  range.setStartAfter(node);
  range.setEndAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
