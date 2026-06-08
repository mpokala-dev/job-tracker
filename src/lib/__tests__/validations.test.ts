import { describe, it, expect } from "vitest";
import { applicationSchema, signUpSchema, signInSchema } from "../validations";

describe("applicationSchema", () => {
  const validData = {
    company: "Monzo",
    role: "Senior Frontend Developer",
    status: "applied" as const,
    applied_date: "2026-06-01",
    url: "https://monzo.com/jobs",
    notes: "Recruiter reached out on LinkedIn",
  };

  it("validates a complete valid application", () => {
    const result = applicationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates without optional fields", () => {
    const { url, notes, ...rest } = validData;
    const result = applicationSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("transforms empty url to null", () => {
    const result = applicationSchema.safeParse({ ...validData, url: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.url).toBeNull();
  });

  it("transforms whitespace url to null", () => {
    const result = applicationSchema.safeParse({ ...validData, url: "   " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.url).toBeNull();
  });

  it("transforms empty notes to null", () => {
    const result = applicationSchema.safeParse({ ...validData, notes: "" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.notes).toBeNull();
  });

  it("rejects invalid url format", () => {
    const result = applicationSchema.safeParse({
      ...validData,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing company", () => {
    const result = applicationSchema.safeParse({ ...validData, company: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing role", () => {
    const result = applicationSchema.safeParse({ ...validData, role: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = applicationSchema.safeParse({
      ...validData,
      status: "pending",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid statuses", () => {
    const statuses = ["applied", "interview", "offer", "rejected"] as const;
    statuses.forEach((status) => {
      const result = applicationSchema.safeParse({ ...validData, status });
      expect(result.success).toBe(true);
    });
  });
});

describe("signUpSchema", () => {
  const validData = {
    name: "Madhuri Pokala",
    email: "madhuri@example.com",
    password: "securepassword123",
  };

  it("validates valid signup data", () => {
    const result = signUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = signUpSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signUpSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = signUpSchema.safeParse({ ...validData, password: "short" });
    expect(result.success).toBe(false);
  });

  it("accepts password of exactly 8 characters", () => {
    const result = signUpSchema.safeParse({
      ...validData,
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });
});

describe("signInSchema", () => {
  it("validates valid signin data", () => {
    const result = signInSchema.safeParse({
      email: "madhuri@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({
      email: "madhuri@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signInSchema.safeParse({
      email: "invalid",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
