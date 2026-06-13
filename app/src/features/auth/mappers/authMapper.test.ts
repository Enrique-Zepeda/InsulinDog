import { describe, expect, test } from "vitest";
import type { User } from "@supabase/supabase-js";

import { mapSupabaseUserToAuthUser } from "./authMapper";

const createSupabaseUser = (overrides: Partial<User> = {}): User =>
  ({
    id: "user-1",
    email: "user@example.com",
    user_metadata: {},
    ...overrides,
  }) as User;

describe("mapSupabaseUserToAuthUser", () => {
  test("should map a Supabase user to an AuthUser", () => {
    const user = createSupabaseUser({
      id: "user-1",
      email: "user@example.com",
      user_metadata: {
        full_name: "Joh doe",
      },
    });

    const result = mapSupabaseUserToAuthUser(user);

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "Joh doe",
    });
  });

  test("should return null email when Supabase user does not have email", () => {
    const user = createSupabaseUser({
      email: undefined,
      user_metadata: {
        full_name: "Joh doe",
      },
    });

    const result = mapSupabaseUserToAuthUser(user);

    expect(result).toEqual({
      id: "user-1",
      email: null,
      name: "Joh doe",
    });
  });

  test("should use fallbackName when full_name does not exist", () => {
    const user = createSupabaseUser({
      user_metadata: {},
    });

    const result = mapSupabaseUserToAuthUser(user, "Jhonson");

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "Jhonson",
    });
  });

  test("should return null name when full_name does not exist and fallbackName is not provided", () => {
    const user = createSupabaseUser({
      user_metadata: {},
    });

    const result = mapSupabaseUserToAuthUser(user);

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: null,
    });
  });

  test("should use fallbackName when full_name is not a string", () => {
    const user = createSupabaseUser({
      user_metadata: {
        full_name: null,
      },
    });

    const result = mapSupabaseUserToAuthUser(user, "Jhonson");

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "Jhonson",
    });
  });

  test("should prefer full_name over fallbackName", () => {
    const user = createSupabaseUser({
      user_metadata: {
        full_name: "Joh doe",
      },
    });

    const result = mapSupabaseUserToAuthUser(user, "Fallback Name");

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "Joh doe",
    });
  });

  test("should allow an empty string as name when full_name is an empty string", () => {
    const user = createSupabaseUser({
      user_metadata: {
        full_name: "",
      },
    });

    const result = mapSupabaseUserToAuthUser(user, "Jhonson");

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      name: "",
    });
  });
});
