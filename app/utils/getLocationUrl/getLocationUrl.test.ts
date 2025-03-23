import { describe, it, expect } from "vitest";
import { getLocationUrl } from "./getLocationUrl";
import type { Location } from "~/entities/user";

describe("getLocationUrl", () => {
  it("should return a valid Google Maps URL when all location fields are provided", () => {
    const location: Location = {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postcode: 10001,
    };
    const expectedUrl =
      "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%2C%20New%20York%2C%20NY%2010001";

    const result = getLocationUrl(location);
    expect(result).toBe(expectedUrl);
  });

  it("should return an empty string when any required field is missing", () => {
    const testCases: Location[] = [
      { street: "", city: "New York", state: "NY", postcode: 10001 },
      { street: "123 Main St", city: "", state: "NY", postcode: 10001 },
      { street: "123 Main St", city: "New York", state: "", postcode: 10001 },
      // @ts-expect-error - forcing postcode to be missing to test the error
      { street: "123 Main St", city: "New York", state: "NY" },
    ];

    testCases.forEach((location) => {
      expect(getLocationUrl(location)).toBe("");
    });
  });

  it("should properly encode special characters in the address", () => {
    const location: Location = {
      street: "123 Main St #4B",
      city: "San Francisco",
      state: "CA",
      postcode: 94105,
    };
    const expectedUrl =
      "https://www.google.com/maps/search/?api=1&query=123%20Main%20St%20%234B%2C%20San%20Francisco%2C%20CA%2094105";

    const result = getLocationUrl(location);
    expect(result).toBe(expectedUrl);
  });
});
