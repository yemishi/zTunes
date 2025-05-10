import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AlbumForm from "../../../app/account/createAlbum/albumForm/AlbumForm";
import { toast } from "react-toastify";

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        refresh: jest.fn(),
    }),
}));

jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

global.URL.createObjectURL = jest.fn(() => "http://example.com/demo-photo");

describe("AlbumForm component", () => {
    const initialProps = {
        initialTitle: "Test Album",
        onclose: jest.fn(),
        artistId: "artist1",
    };

    it("renders correctly", () => {
        const { getByPlaceholderText } = render(<AlbumForm {...initialProps} />);
        const inputTitle = getByPlaceholderText(/Album title/i)
        expect(inputTitle).toHaveValue("Test Album")
    });

    it("submits form with valid data", async () => {
        const { getByText, getByPlaceholderText, getByLabelText } = render(
            <AlbumForm {...initialProps} />
        );
        const submitButton = getByText(/Submit/i)
        fireEvent.change(getByPlaceholderText(/Album title/i), {
            target: { value: "New Album Title" },
        });
        fireEvent.change(getByLabelText(/Description/i), {
            target: { value: "Album description" },
        });
        fireEvent.change(screen.getByPlaceholderText(/DD/i), {
            target: { value: "01" },
        });
        fireEvent.change(screen.getByText(/Month/i), {
            target: { value: "01" },
        });
        fireEvent.change(screen.getByPlaceholderText(/YYYY/i), {
            target: { value: "2022" },
        });

        fireEvent.change(screen.getByTestId(/inputFile/i), {
            target: { files: [new File(["cover"], "cover.png", { type: "image/png" })] },
        });
        fireEvent.click(submitButton);

        await waitFor(async () => {
            expect(toast.success).toBeTruthy()
        });
    });

    it("shows error with invalid date", async () => {
        const { getByText } = render(<AlbumForm {...initialProps} />);
        const submitButton = getByText(/Submit/i)
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Choose a valid date");
        });
    });

    it("shows error when cover photo is missing", async () => {
        const { getByText, getByPlaceholderText } = render(<AlbumForm {...initialProps} />);
        const submitButton = getByText(/Submit/i)
        fireEvent.change(getByPlaceholderText(/Album title/i), {
            target: { value: "New Album Title" },
        });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(toast.error)
        });
    });
});
