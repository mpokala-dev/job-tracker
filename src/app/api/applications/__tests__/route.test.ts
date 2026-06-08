import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
const mockGetApplications = vi.fn();
const mockCreateApplication = vi.fn();

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/db", () => ({
  getApplications: mockGetApplications,
  createApplication: mockCreateApplication,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/applications", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import("../route");
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns applications for authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetApplications.mockResolvedValue([
      {
        id: "app-1",
        company: "Monzo",
        role: "Frontend Dev",
        status: "applied",
      },
    ]);
    const { GET } = await import("../route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].company).toBe("Monzo");
  });

  it("returns empty array when no applications", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetApplications.mockResolvedValue([]);
    const { GET } = await import("../route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual([]);
  });
});

describe("POST /api/applications", () => {
  const validBody = {
    company: "Revolut",
    role: "Senior Frontend Developer",
    status: "applied",
    applied_date: "2026-06-01",
    url: null,
    notes: null,
  };

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { POST } = await import("../route");
    const req = new Request("http://localhost/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid body", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    const { POST } = await import("../route");
    const req = new Request("http://localhost/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: "", role: "" }),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("creates application successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockCreateApplication.mockResolvedValue({ id: "new-app", ...validBody });
    const { POST } = await import("../route");
    const req = new Request("http://localhost/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req as never);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.company).toBe("Revolut");
  });
});
