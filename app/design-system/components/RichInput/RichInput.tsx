import { useState, useRef } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { User } from "~/entities/user";
import {
  getCursorPosition,
  getCursorPositionInHTML,
  getMentionQuery,
  sanitizeAndNormalize,
  type CursorPosition,
} from "./utils";
import { Mention } from "../Mention/Mention";
import { createRoot } from "react-dom/client";

interface RichInputProps {
  users: User[];
}

// TODO: next step append mentions (React component) and handle new tag element appended to the value

export const RichInput = ({ users }: RichInputProps) => {
  const [value, setValue] = useState("");
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
    null,
  );
  const [dropdownQuery, setDropdownQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const updateMentionState = (
    element: HTMLDivElement,
    currentValue: string,
  ) => {
    if (!element) return;
    const cursorPos = getCursorPosition(element);
    setCursorPosition(cursorPos);
    const query = getMentionQuery(currentValue, cursorPos.char);
    if (query !== null) {
      setDropdownQuery(query);
      setIsDropdownOpen(true);
    } else {
      setDropdownQuery("");
      setIsDropdownOpen(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerHTML;
    const parsedValue = sanitizeAndNormalize(newValue);
    setValue(parsedValue);

    if (inputRef.current) {
      updateMentionState(inputRef.current, parsedValue);
    }
  };

  const handleCursorChange = () => {
    if (inputRef.current) {
      updateMentionState(inputRef.current, value);
    }
  };

  const clearDropdown = (e: React.FocusEvent) => {
    if (
      e.relatedTarget &&
      dropdownRef.current?.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    setIsDropdownOpen(false);
    setDropdownQuery("");
  };

  const handleSelect = (user: User) => {
    setIsDropdownOpen(false);
    setDropdownQuery("");
    if (!cursorPosition || !inputRef.current) return;

    // First update the sanitized value
    // Find the @ and query in the value string
    const mentionStart = value.lastIndexOf("@", cursorPosition.char);
    if (mentionStart === -1) return;

    // Replace the @query with @username
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(
      mentionStart + dropdownQuery.length + 1,
    );
    const newValue = `${beforeMention}@${user.username}${afterMention}`;
    setValue(newValue);

    // Then update the innerHTML
    const element = inputRef.current.innerHTML;
    const cursorPositionInHTML = getCursorPositionInHTML(inputRef.current);
    const mentionStartHTML = element.lastIndexOf("@", cursorPositionInHTML);

    if (mentionStartHTML === -1) return;

    // Replace the @query with a span with id to then replace with the mention component
    const beforeMentionHTML = element.substring(0, mentionStartHTML);
    const afterMentionHTML = element.substring(
      mentionStartHTML + dropdownQuery.length + 1,
    );
    const newValueHTML = `${beforeMentionHTML}<span id="mention"></span>${afterMentionHTML}`;
    inputRef.current.innerHTML = newValueHTML;

    // Replace the span with the react component using createRoot
    const mentionElement = document.getElementById("mention");

    if (mentionElement) {
      mentionElement.removeAttribute("id");
      mentionElement.contentEditable = "false";
      const root = createRoot(mentionElement);
      root.render(<Mention user={user} />);
    }

    // Finally, set the selection to the end of the mention or text
    const selection = window.getSelection();
    if (selection && mentionElement) {
      const spaceNode = document.createTextNode(" ");
      mentionElement.parentNode?.insertBefore(
        spaceNode,
        mentionElement.nextSibling,
      );

      // Set cursor after the space
      const range = document.createRange();
      range.setStartAfter(spaceNode);
      range.setEndAfter(spaceNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  return (
    <div>
      <div
        ref={inputRef}
        className="z-0 h-48 w-48 bg-amber-200"
        role="textbox"
        contentEditable
        spellCheck
        translate="no"
        onInput={handleInput}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        onBlur={clearDropdown}
        aria-multiline="true"
        aria-label="Note content"
        aria-describedby="note-editor"
      />
      {isDropdownOpen && (
        <Dropdown
          ref={dropdownRef}
          data={users}
          labelKey="username"
          displayKeys={["firstName", "lastName"]}
          prefix="@"
          query={dropdownQuery}
          position={{ x: cursorPosition?.x ?? 0, y: cursorPosition?.y ?? 0 }}
          // @ts-expect-error - TS doesn't infer well forwardRefs with generics
          onSelect={handleSelect}
        />
      )}
      <textarea className="hidden" name="body" value={value} readOnly />
    </div>
  );
};
