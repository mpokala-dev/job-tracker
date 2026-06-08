import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAuth = vi.fn();
const mockGetApplication = vi.fn();
const mockUpdateApplication = vi.fn();
const mockDeleteApplication = vi.fn();

vi.mock("@/auth", () => ({ auth: mockAuth }));
vi.mock("@/lib/db", () => ({
  getApplication: mockGetApplication,
  updateApplication: mockUpdateApplication,
  deleteApplication: mockDeleteApplication,
}));

const mockParams = Promise.resolve({ id: "app-123" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { GET } = await import("../route");
    const res = await GET(new Request("http://localhost") as never, {
      params: mockParams,
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 when application not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetApplication.mockResolvedValue(null);
    const { GET } = await import("../route");
    const res = await GET(new Request("http://localhost") as never, {
      params: mockParams,
    });
    expect(res.status).toBe(404);
  });

  it("returns application when found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockGetApplication.mockResolvedValue({ id: "app-123", company: "Monzo" });
    const { GET } = await import("../route");
    const res = await GET(new Request("http://localhost") as never, {
      params: mockParams,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.company).toBe("Monzo");
  });
});

describe("PATCH /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { PATCH } = await import("../route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "interview" }),
    });
    const res = await PATCH(req as never, { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("updates application status successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockUpdateApplication.mockResolvedValue({
      id: "app-123",
      status: "interview",
    });
    const { PATCH } = await import("../route");
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "interview" }),
    });
    const res = await PATCH(req as never, { params: mockParams });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("interview");
  });
});

describe("DELETE /api/applications/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const { DELETE } = await import("../route");
    const res = await DELETE(new Request("http://localhost") as never, {
      params: mockParams,
    });
    expect(res.status).toBe(401);
  });

  it("deletes application successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-123" } });
    mockDeleteApplication.mockResolvedValue(undefined);
    const { DELETE } = await import("../route");
    const res = await DELETE(new Request("http://localhost") as never, {
      params: mockParams,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
