import { render, screen } from "@testing-library/react";
import Card from "./Card";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import ProfileCard from "./ProfileCard";

// mock custom Image component if needed
jest.mock("@/ui/custom/Image", () => (props: any) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
});

describe("Card component", () => {
  const defaultProps = {
    url: "/bundle/1",
    title: "Chill Vibes",
    coverPhoto: "/images/chill.jpg",
    isOfficial: false,
    artistId: "dj-smooth",
    artistName: "DJ Smooth",
    alt: "Chill album cover",
  };

  it("renders title, image and artist name if not official", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Chill Vibes")).toBeInTheDocument();
    expect(screen.getByAltText("Chill album cover")).toBeInTheDocument();
    expect(screen.getByText("DJ Smooth")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /DJ Smooth/i })).toHaveAttribute("href", "/artist/dj-smooth");
  });

  it("renders 'Official playlist' if isOfficial is true", () => {
    render(<Card {...defaultProps} isOfficial={true} />);
    expect(screen.getByText("Official playlist")).toBeInTheDocument();
  });

  it("links to the correct URL", () => {
    render(<Card {...defaultProps} />);
    const link = screen.getAllByRole("link")[0]; // first Link is for the card URL
    expect(link).toHaveAttribute("href", defaultProps.url);
  });
});

describe("ProfileCard", () => {
  const baseProps = {
    props: {
      cover: "/images/profile.jpg",
      id: "123",
      name: "Neltharion",
      isArtist: true,
    },
  };

  it("renders the image and name correctly", () => {
    render(<ProfileCard {...baseProps} />);
    expect(screen.getByAltText("mocked image")).toBeInTheDocument();
    expect(screen.getByText("Neltharion")).toBeInTheDocument();
  });

  it("links to the artist profile when isArtist is true", () => {
    render(<ProfileCard {...baseProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/artist/123");
  });

  it("links to the user profile when isArtist is false", () => {
    const userProps = {
      props: {
        ...baseProps.props,
        isArtist: false,
      },
    };
    render(<ProfileCard {...userProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/user/123");
  });

  it("capitalizes the first letter of the name", () => {
    const customNameProps = {
      props: {
        ...baseProps.props,
        name: "arthas",
      },
    };
    render(<ProfileCard {...customNameProps} />);
    expect(screen.getByText("Arthas")).toBeInTheDocument();
  });
});
