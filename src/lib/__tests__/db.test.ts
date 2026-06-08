import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: mockFrom },
}));

function createChain(resolvedValue: unknown): Record<string, unknown> {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue);
  chain.then = undefined;
  Object.defineProperty(chain, Symbol.iterator, { value: undefined });
  return chain as Record<string, unknown> & Promise<unknown>;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getApplications", () => {
  it("returns applications for a user", async () => {
    const mockApps = [
      { id: "1", company: "Monzo", role: "Frontend Dev", status: "applied" },
    ];
    const chain = createChain(null);
    chain.order = vi.fn().mockResolvedValue({ data: mockApps, error: null });
    mockFrom.mockReturnValue(chain);

    const { getApplications } = await import("../db");
    const result = await getApplications("user-123");
    expect(result).toEqual(mockApps);
    expect(mockFrom).toHaveBeenCalledWith("job_applications");
  });

  it("returns empty array when no applications", async () => {
    const chain = createChain(null);
    chain.order = vi.fn().mockResolvedValue({ data: null, error: null });
    mockFrom.mockReturnValue(chain);

    const { getApplications } = await import("../db");
    const result = await getApplications("user-123");
    expect(result).toEqual([]);
  });

  it("throws when supabase returns error", async () => {
    const chain = createChain(null);
    chain.order = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "DB error" } });
    mockFrom.mockReturnValue(chain);

    const { getApplications } = await import("../db");
    await expect(getApplications("user-123")).rejects.toThrow("DB error");
  });
});

describe("getApplication", () => {
  it("returns a single application", async () => {
    const mockApp = { id: "app-1", company: "Revolut", role: "Staff Engineer" };
    const chain = createChain({ data: mockApp, error: null });
    mockFrom.mockReturnValue(chain);

    const { getApplication } = await import("../db");
    const result = await getApplication("app-1", "user-123");
    expect(result).toEqual(mockApp);
  });

  it("returns null when not found", async () => {
    const chain = createChain({ data: null, error: { message: "Not found" } });
    mockFrom.mockReturnValue(chain);

    const { getApplication } = await import("../db");
    const result = await getApplication("app-1", "user-123");
    expect(result).toBeNull();
  });
});

describe("deleteApplication", () => {
  it("deletes successfully", async () => {
    const chain = createChain(null);
    chain.eq = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    mockFrom.mockReturnValue(chain);

    const { deleteApplication } = await import("../db");
    await expect(
      deleteApplication("app-1", "user-123"),
    ).resolves.toBeUndefined();
  });
});

describe("createApplication", () => {
  it("creates and returns a new application", async () => {
    const mockApp = {
      id: "new-app",
      company: "Monzo",
      role: "Frontend Dev",
      status: "applied",
    };
    const chain = createChain({ data: mockApp, error: null });
    mockFrom.mockReturnValue(chain);

    const { createApplication } = await import("../db");
    const result = await createApplication("user-123", {
      company: "Monzo",
      role: "Frontend Dev",
      status: "applied",
      applied_date: "2026-06-01",
      url: null,
      notes: null,
    });
    expect(result).toEqual(mockApp);
  });

  it("throws when insert fails", async () => {
    const chain = createChain({
      data: null,
      error: { message: "Insert failed" },
    });
    mockFrom.mockReturnValue(chain);

    const { createApplication } = await import("../db");
    await expect(
      createApplication("user-123", {
        company: "Monzo",
        role: "Frontend Dev",
        status: "applied",
        applied_date: "2026-06-01",
        url: null,
        notes: null,
      }),
    ).rejects.toThrow("Insert failed");
  });
});

describe("updateApplication", () => {
  it("updates and returns the application", async () => {
    const mockApp = { id: "app-1", company: "Monzo", status: "interview" };
    const chain = createChain({ data: mockApp, error: null });
    mockFrom.mockReturnValue(chain);

    const { updateApplication } = await import("../db");
    const result = await updateApplication("app-1", "user-123", {
      status: "interview",
    });
    expect(result).toEqual(mockApp);
  });

  it("throws when update fails", async () => {
    const chain = createChain({
      data: null,
      error: { message: "Update failed" },
    });
    mockFrom.mockReturnValue(chain);

    const { updateApplication } = await import("../db");
    await expect(
      updateApplication("app-1", "user-123", { status: "interview" }),
    ).rejects.toThrow("Update failed");
  });
});
