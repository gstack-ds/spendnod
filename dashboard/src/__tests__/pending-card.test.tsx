import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PendingCard } from "@/components/pending-card";
import * as api from "@/lib/api";
import { AuthRequest } from "@/lib/api";

// Mock the API module
jest.mock("@/lib/api", () => ({
  ...jest.requireActual("@/lib/api"),
  approveRequest: jest.fn(),
  denyRequest: jest.fn(),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockRequest: AuthRequest = {
  id: "req-123",
  agent_id: "agent-456",
  action: "purchase",
  amount: 49.99,
  currency: "USD",
  vendor: "AWS",
  category: "cloud_services",
  description: "Provision EC2 instance",
  status: "pending",
  escalation_reason: "Exceeds $25 auto-approve threshold",
  expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
};

describe("PendingCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders agent name, amount, vendor, and description", () => {
    render(
      <PendingCard
        request={mockRequest}
        agentName="Shopping Agent"
        onResolved={jest.fn()}
      />
    );
    expect(screen.getByText("Shopping Agent")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText(/AWS/)).toBeInTheDocument();
    expect(screen.getByText(/Provision EC2 instance/)).toBeInTheDocument();
  });

  it("renders Approve and Deny buttons", () => {
    render(
      <PendingCard request={mockRequest} onResolved={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: /approve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /deny/i })).toBeInTheDocument();
  });

  it("calls approveRequest with the correct ID when Approve is clicked", async () => {
    const mockApprove = api.approveRequest as jest.Mock;
    mockApprove.mockResolvedValue(undefined);
    const onResolved = jest.fn();

    render(
      <PendingCard request={mockRequest} onResolved={onResolved} />
    );

    fireEvent.click(screen.getByRole("button", { name: /approve/i }));

    await waitFor(() => {
      expect(mockApprove).toHaveBeenCalledWith("req-123");
      expect(onResolved).toHaveBeenCalledWith("req-123");
    });
  });

  it("calls denyRequest with the correct ID when Deny is clicked", async () => {
    const mockDeny = api.denyRequest as jest.Mock;
    mockDeny.mockResolvedValue(undefined);
    const onResolved = jest.fn();

    render(
      <PendingCard request={mockRequest} onResolved={onResolved} />
    );

    fireEvent.click(screen.getByRole("button", { name: /deny/i }));

    await waitFor(() => {
      expect(mockDeny).toHaveBeenCalledWith("req-123");
      expect(onResolved).toHaveBeenCalledWith("req-123");
    });
  });

  it("disables buttons while loading", async () => {
    const mockApprove = api.approveRequest as jest.Mock;
    // Never resolves during this test
    mockApprove.mockImplementation(() => new Promise(() => {}));

    render(
      <PendingCard request={mockRequest} onResolved={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /approve/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /approving/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /deny/i })).toBeDisabled();
    });
  });

  it("renders escalation reason when present", () => {
    render(
      <PendingCard request={mockRequest} onResolved={jest.fn()} />
    );
    expect(
      screen.getByText(/Exceeds \$25 auto-approve threshold/)
    ).toBeInTheDocument();
  });

  it("renders fallback agent name when not provided", () => {
    render(
      <PendingCard request={mockRequest} onResolved={jest.fn()} />
    );
    expect(screen.getByText("Unknown Agent")).toBeInTheDocument();
  });
});
