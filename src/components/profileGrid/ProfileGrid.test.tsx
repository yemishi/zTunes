import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileGrid from "./ProfileGrid";

jest.mock("../slider/Slider", () => ({ children }: any) => <div data-testid="mock-slider">{children}</div>);

jest.mock("../card/ProfileCard", () => ({ props }: any) => <div data-testid="mock-profile-card">{props.name}</div>);

describe("ProfileGrid", () => {
  const mockProps = [
    { cover: "cover1.jpg", id: "1", name: "Artist One", isArtist: true },
    { cover: "cover2.jpg", id: "2", name: "Artist Two", isArtist: false },
  ];

  it("renders the title", () => {
    render(<ProfileGrid title="Featured Artists" props={mockProps} />);
    expect(screen.getByText("Featured Artists")).toBeInTheDocument();
  });

  it("renders profile cards inside the slider", () => {
    render(<ProfileGrid title="Top Profiles" props={mockProps} />);
    expect(screen.getByTestId("mock-slider")).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();
    expect(screen.getByText("Artist Two")).toBeInTheDocument();
  });

  it("renders 'See more' link if seeMore is provided", () => {
    render(<ProfileGrid title="More Artists" props={mockProps} seeMore="/artists" />);
    const link = screen.getByText("See more");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/artists");
  });

  it("does not render 'See more' link if seeMore is not provided", () => {
    render(<ProfileGrid title="Solo View" props={mockProps} />);
    expect(screen.queryByText("See more")).not.toBeInTheDocument();
  });
});
