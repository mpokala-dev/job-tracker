import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
const mockHash = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: mockFrom },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mockHash,
  },
}));

function createChain(resolvedValue: unknown) {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockResolvedValue(resolvedValue);
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockHash.mockResolvedValue("hashed_password");
});

function makeRequest(body: object) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/register", () => {
  it("returns 400 for invalid data", async () => {
    const { POST } = await import("../route");
    const req = makeRequest({ email: "invalid", password: "123" });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it("returns 400 if email already exists", async () => {
    const chain = createChain({ data: { id: "existing-user" }, error: null });
    mockFrom.mockReturnValue(chain);

    const { POST } = await import("../route");
    const req = makeRequest({
      name: "Test User",
      email: "existing@example.com",
      password: "password123",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Email already in use");
  });

  it("registers successfully with valid data", async () => {
    const checkChain = createChain({
      data: null,
      error: { message: "Not found" },
    });
    const insertChain = createChain(null);
    insertChain.insert = vi.fn().mockResolvedValue({ error: null });

    mockFrom.mockReturnValueOnce(checkChain).mockReturnValueOnce(insertChain);

    const { POST } = await import("../route");
    const req = makeRequest({
      name: "New User",
      email: "new@example.com",
      password: "password123",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
