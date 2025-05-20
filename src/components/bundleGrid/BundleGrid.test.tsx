import { render, screen } from "@testing-library/react";
import BundleGrid from "./BundleGrid";
import { BundleType } from "@/types/response";
import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

const mockData: BundleType[] = [
  {
    id: "1",
    title: "Cozy Beats",
    avatar: "",
    type: "bundle",
    artistId: "a1",
    artistName: "DJ Chill",
    coverPhoto: "/cover1.jpg",
    createdAt: new Date(),
    error: false,
    message: "",
    status: 200,
    isOfficial: false,
  },
  {
    id: "2",
    title: "Top Tracks",
    avatar: "",
    type: "bundle",
    artistId: "a2",
    artistName: "MC Fire",
    coverPhoto: "/cover2.jpg",
    createdAt: new Date(),
    error: false,
    message: "",
    status: 200,
    isOfficial: true,
  },
];
describe("BundleGrid", () => {
  it("renders the correct title", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" />);
    expect(screen.getByText("Hot Bundles")).toBeInTheDocument();
  });

  it("renders one Card per bundle", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" />);
    expect(screen.getByText("Cozy Beats")).toBeInTheDocument();
    expect(screen.getByText("Top Tracks")).toBeInTheDocument();
  });

  it("renders artist name if not official", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" />);
    expect(screen.getByText("DJ Chill")).toBeInTheDocument();
  });

  it("renders 'Official playlist' label when official", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" />);
    expect(screen.getByText("Official playlist")).toBeInTheDocument();
  });

  it("renders the See more link if seeMore is passed", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" seeMore="/bundles/all" />);
    const link = screen.getByText("See more");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/bundles/all");
  });

  it("does not render See more if seeMore is not passed", () => {
    render(<BundleGrid title="Hot Bundles" props={mockData} baseUrl="/bundles" />);
    expect(screen.queryByText("See more")).not.toBeInTheDocument();
  });
});
