import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArtistAbout from "./ArtistAbout";

describe("Artist about component", () => {
  it("render ArtistAbout correctly", () => {
    const { getByText } = render(
      <ArtistAbout summary="Test summary text" cover="https://testPhoto" />
    );
    expect(getByText("Test summary text")).toBeInTheDocument;
  });
});
