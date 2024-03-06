import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArtistAbout from "./ArtistAbout";

describe("Artist about component", () => {
  const about = {
    summary: "Test summary text",
    cover: "https://testPhoto",
  };
  it("render ArtistAbout correctly", () => {
    const { getByText } = render(<ArtistAbout about={about} />);
    expect(getByText("Test summary text")).toBeInTheDocument;
  });
});
