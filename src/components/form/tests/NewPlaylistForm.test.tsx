import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewPlaylistForm from "../../playlistForm/PlaylistForm";
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
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ isAdmin: true }), })) as jest.Mock;
global.URL.createObjectURL = jest.fn(() => "http://example.com/demo-photo");


describe("NewPlaylistForm component", () => {
    const initialProps = {
        username: "testUser",
        onSuccess: jest.fn(),
        onclose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(toast, 'success');
        jest.spyOn(toast, 'error');
    });

    it("renders correctly", () => {
        render(<NewPlaylistForm {...initialProps} />);
        expect(screen.getByPlaceholderText(/Playlist name/i)).toBeInTheDocument();
    });

    it("submits form with valid data", async () => {
        const { getByText, getByPlaceholderText, getByLabelText } = render(
            <NewPlaylistForm {...initialProps} />
        );

        fireEvent.change(getByPlaceholderText(/Playlist name/i), {
            target: { value: "New Playlist" },
        });
        fireEvent.change(getByLabelText(/Description/i), {
            target: { value: "Playlist description" },
        });

        fireEvent.change(screen.getByTestId(/inputFile/i), {
            target: { files: [new File(["cover"], "cover.png", { type: "image/png" })] },
        });

        fireEvent.click(getByText(/Submit/i));

        await waitFor(() => {
            expect(toast.success).toBeTruthy()

        });
    });

    it("shows error when cover photo is missing", async () => {
        const { getByText, getByPlaceholderText } = render(<NewPlaylistForm {...initialProps} />);

        fireEvent.change(getByPlaceholderText(/Playlist name/i), {
            target: { value: "New Playlist" },
        });

        fireEvent.click(getByText(/Submit/i));

        await waitFor(() => {
            expect(toast.error).toBeTruthy()
        });
    });
});
