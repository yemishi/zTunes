import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddAlbum from "./AddAlbum";

describe("AlbumManager", () => {
  it("Should render button new", () => {
    const { getByText } = render(<AddAlbum artistId="artist1" />);
    const button = getByText(/new/i);
    expect(button).toBeInTheDocument();
  });
});

