import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Card from "./Card";
import ProfileCard from "./ProfileCard";

describe("Generic card component", () => {
  it("Should render a generic card correctly", () => {
    const { getByText } = render(
      <Card
        artistId="artist1"
        artistName="Artist test"
        coverPhoto="http://testcover.png"
        isOfficial={false}
        url=""
        title="Card test"
      />
    );

    const artist = getByText("Artist test");
    const title = getByText("Card test");
    expect(artist).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});

describe("Profile card component", () => {
  const props = {
    cover: "http://coverPhoto.png",
    id: "profile1",
    name: "Profile test",
    isArtist: false,
  };

  it("Should render profile card correctly", () => {
    const { getByText } = render(<ProfileCard props={props} />);
    const profileName = getByText("Profile test");
    expect(profileName).toBeInTheDocument();
  });
});
