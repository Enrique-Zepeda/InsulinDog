import { describe, expect, test } from "vitest";

import { getThunkErrorMessage } from "./getThunkErrorMessage";

describe("getThunkErrorMessage", () => {
  test("should return error message when error is an instance of Error", () => {
    const error = new Error("Error desde Supabase");

    const result = getThunkErrorMessage(error, "Error fallback");

    expect(result).toBe("Error desde Supabase");
  });

  test("should return fallback message when error is a string", () => {
    const error = "Error como string";

    const result = getThunkErrorMessage(error, "Error fallback");

    expect(result).toBe("Error fallback");
  });

  test("should return fallback message when error is null", () => {
    const result = getThunkErrorMessage(null, "Error fallback");

    expect(result).toBe("Error fallback");
  });

  test("should return fallback message when error is undefined", () => {
    const result = getThunkErrorMessage(undefined, "Error fallback");

    expect(result).toBe("Error fallback");
  });

  test("should return fallback message when error is an object but not an Error instance", () => {
    const error = {
      message: "Objeto con mensaje",
    };

    const result = getThunkErrorMessage(error, "Error fallback");

    expect(result).toBe("Error fallback");
  });
});
