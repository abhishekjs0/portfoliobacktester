import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CSVUpload } from "../csv-upload";

describe("CSVUpload", () => {
  it("calls the onUpload handler with the selected files", async () => {
    const user = userEvent.setup();
    const handleUpload = vi.fn();
    render(<CSVUpload onUpload={handleUpload} />);

    const fileInput = screen.getByLabelText(/select tradingview exports/i);
    const file = new File(["header,rows"], "sample.csv", { type: "text/csv" });

    await act(async () => {
      await user.upload(fileInput, file);
    });

    expect(handleUpload).toHaveBeenCalledTimes(1);
    const [fileList] = handleUpload.mock.calls[0];
    expect(fileList).toBeInstanceOf(FileList);
    expect(Array.from(fileList).map((item) => (item as File).name)).toContain("sample.csv");
    expect(screen.getByTestId("file-summary")).toHaveTextContent("1 file ready");
  });

  it("disables confirmation button when no files selected", () => {
    const handleUpload = vi.fn();
    render(<CSVUpload onUpload={handleUpload} />);

    expect(screen.getByRole("button", { name: /confirm selection/i })).toBeDisabled();
  });
});
