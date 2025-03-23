import { useState, useRef } from "react";
import DOMPurify from "dompurify";

export const RichInput = () => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerHTML;
    const sanitizedValue = DOMPurify.sanitize(newValue);
    setValue(sanitizedValue);
  };

  console.log(value);

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
        aria-multiline="true"
        aria-label="Note content"
        aria-describedby="editor-description"
      />
      <textarea className="hidden" name="body" value={value} readOnly />
    </div>
  );
};
