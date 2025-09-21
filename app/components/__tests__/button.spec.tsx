import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../ui/button";

describe("Button", () => {
  it("renders with the provided label", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("calls the onClick handler when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} variant="secondary">
        Upload
      </Button>
    );
    await user.click(screen.getByRole("button", { name: /upload/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
