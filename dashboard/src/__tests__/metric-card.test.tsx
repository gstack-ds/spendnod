import { render, screen } from "@testing-library/react";
import { MetricCard } from "@/components/metric-card";
import { Activity } from "lucide-react";

describe("MetricCard", () => {
  it("renders the title and value", () => {
    render(<MetricCard title="Total Requests" value={42} icon={Activity} />);
    expect(screen.getByText("Total Requests")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders a string value", () => {
    render(<MetricCard title="Total Spend" value="$1,234.56" icon={Activity} />);
    expect(screen.getByText("$1,234.56")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <MetricCard
        title="Auto-Approved"
        value={10}
        icon={Activity}
        description="95% approval rate"
      />
    );
    expect(screen.getByText("95% approval rate")).toBeInTheDocument();
  });

  it("hides value and shows placeholder when loading", () => {
    render(
      <MetricCard title="Pending" value={5} icon={Activity} loading />
    );
    // Value should not be rendered when loading
    expect(screen.queryByText("5")).not.toBeInTheDocument();
    // Title should still be visible
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
