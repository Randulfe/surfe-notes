import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { User } from "~/entities/user";
import {
  getCursorPosition,
  getCursorPositionInHTML,
  getMentionsDummyText,
  getMentionQuery,
  sanitizeAndNormalize,
  type CursorPosition,
  setCursorAfterNode,
} from "./utils";
import { Mention } from "../Mention/Mention";
import { createRoot } from "react-dom/client";
import { isTargetInElement } from "~/utils/isTargetInElement";

interface RichInputProps {
  users: User[] | undefined;
  value: string;
  onChange: (value: string) => void;
}

export const RichInput = ({
  users,
  value: initialValue,
  onChange,
}: RichInputProps) => {
  const [value, setValue] = useState("");
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
    null,
  );
  const [dropdownQuery, setDropdownQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const userMap = useMemo(() => {
    if (!users) return new Map();
    return new Map(users.map((user) => [user.username, user]));
  }, [users]);

  const processMentions = useCallback(
    (value: string) => {
      {
        if (!inputRef.current) return;
        const newHTML = getMentionsDummyText(value, userMap);

        // Update innerHTML with the dummy spans
        inputRef.current.innerHTML = newHTML;

        // Find dummy spans and attach React components
        const mentionElements = inputRef.current.querySelectorAll(
          "span[data-username]",
        );
        mentionElements.forEach((el) => {
          const username = el.getAttribute("data-username");
          if (!username) return;
          const user = userMap.get(username);
          if (!user) return;
          // Clean up containing spans
          el.removeAttribute("data-username");
          (el as HTMLElement).contentEditable = "false";
          // Attach React component
          const root = createRoot(el);
          root.render(<Mention user={user} />);
        });
      }
    },
    [userMap],
  );

  useEffect(() => {
    if (initialValue !== value && userMap.size > 0) {
      setValue(initialValue);
      if (inputRef.current) {
        processMentions(initialValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only for initialValue
  }, [initialValue, userMap]);

  const updateMentionState = useCallback(
    (element: HTMLDivElement, currentValue: string) => {
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
    },
    [],
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.innerHTML;
      const parsedValue = sanitizeAndNormalize(newValue);
      setValue(parsedValue);
      onChange(parsedValue);
      if (inputRef.current) {
        updateMentionState(inputRef.current, parsedValue);
      }
    },
    [onChange, updateMentionState],
  );

  const handleCursorChange = () => {
    if (inputRef.current) {
      updateMentionState(inputRef.current, value);
    }
  };

  const clearDropdownOnBlur = (e: React.FocusEvent) => {
    if (!dropdownRef.current || !e.relatedTarget) return;
    if (isTargetInElement(dropdownRef.current, e.relatedTarget)) return;

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
    onChange(newValue);

    // Then update the innerHTML
    const element = inputRef.current;
    const htmlContent = element.innerHTML;
    const cursorPositionInHTML = getCursorPositionInHTML(element);
    const mentionStartHTML = htmlContent.lastIndexOf("@", cursorPositionInHTML);
    if (mentionStartHTML === -1) return;

    // Replace the @query with a span with id to then replace with the mention component
    const beforeMentionHTML = htmlContent.substring(0, mentionStartHTML);
    const afterMentionHTML = htmlContent.substring(
      mentionStartHTML + dropdownQuery.length + 1,
    );
    // Insert dummy span
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
      setCursorAfterNode(selection, spaceNode);
    }
  };

  return (
    <div className="h-full min-h-full">
      <div
        ref={inputRef}
        className="z-0 h-full min-h-full w-full rounded-md p-4 text-xl focus:outline-gray-300"
        role="textbox"
        contentEditable
        spellCheck
        translate="no"
        onInput={handleInput}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        onBlur={clearDropdownOnBlur}
        aria-multiline="true"
        aria-label="Note content"
        aria-describedby="note-editor"
      />
      {isDropdownOpen && (
        <Dropdown
          ref={dropdownRef}
          data={users ?? []}
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
