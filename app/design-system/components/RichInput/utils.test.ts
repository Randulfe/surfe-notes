import { describe, it, expect, vi } from "vitest";
import DOMPurify from "dompurify";
import { sanitizeAndNormalize } from "./utils";

// Mock DOMPurify
vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn((value: string) => value),
  },
}));

describe("sanitizeAndNormalize", () => {
  it("empty string", () => {
    expect(sanitizeAndNormalize("")).toBe("");
  });

  it("chrome-specific new lines", () => {
    const input = "<div><br/></div>";
    expect(sanitizeAndNormalize(input)).toBe("<br/>");
  });

  it("wrapping divs new lines", () => {
    const input = "<div>Hello</div>";
    expect(sanitizeAndNormalize(input)).toBe("<br/>Hello");
  });

  it("<br> to </br>", () => {
    const input = "Line1<br>Line2<br>Line3";
    expect(sanitizeAndNormalize(input)).toBe("Line1<br/>Line2<br/>Line3");
  });

  it("wrapping ps new lines", () => {
    const input = "<p>Hello</p><p>World</p>";
    expect(sanitizeAndNormalize(input)).toBe("<br/>Hello<br/>World");
  });

  it("mention span components to @username format", () => {
    const input = '<span class="mention"><span>@johnDoe</span></span>';
    expect(sanitizeAndNormalize(input)).toBe("@johnDoe");
  });

  it("&nbsp; to normal spaces", () => {
    const input = "Hello&nbsp;World";
    expect(sanitizeAndNormalize(input)).toBe("Hello World");
  });

  it("handle multiple complex cases", () => {
    const input =
      '<div>Hello&nbsp;<span class="mention"><span>@janeDoe</span></span><br></div><p>Next Line</p>';
    const expected = "<br/>Hello @janeDoe<br/><br/>Next Line";
    expect(sanitizeAndNormalize(input)).toBe(expected);
  });

  it("should call DOMPurify.sanitize", () => {
    const input = "<script>alert(1)</script>";
    sanitizeAndNormalize(input);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(input);
  });
});
