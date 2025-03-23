import { useState, useRef } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { User } from "~/entities/user";
import {
  getCursorPosition,
  getMentionQuery,
  sanitizeAndNormalize,
  type CursorPosition,
} from "./utils";

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

  const updateMentionState = (
    element: HTMLDivElement,
    currentValue: string,
  ) => {
    if (!element) return;
    const cursorPos = getCursorPosition(element);
    setCursorPosition(cursorPos);
    const query = getMentionQuery(currentValue, cursorPos.char);
    if (query) {
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

  const clearDropdown = () => {
    setIsDropdownOpen(false);
    setDropdownQuery("");
  };

  return (
    <div>
      <div
        ref={inputRef}
        className="h-48 w-48 bg-amber-200"
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
          users={users}
          query={dropdownQuery}
          position={{ x: cursorPosition?.x ?? 0, y: cursorPosition?.y ?? 0 }}
          onSelect={() => undefined}
        />
      )}
      <textarea className="hidden" name="body" value={value} readOnly />
    </div>
  );
};
