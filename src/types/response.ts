interface ErrorType {
  error: true;
  message: string;
}

interface BundleType {
  id: string;
  title: string;
  type: string;
  releasedDate: string;
  artistName: string;
  artistId: string;
  coverPhoto: string;
  createdAt: Date;
  error: false;
}

interface Artist {
  id: string;
  name: string;
  about: {
    summary: string;
    cover: string;
  };
  cover: string;
  profile: {
    avatar: string;
    birthDate: string;
  };
  error: false;
}
interface Playlist {
  id: string;
  title: string;
  userId: string;
  isPublic: boolean;
  officialCategories: string[];
  coverPhoto: string;
  updatedAt: Date;
  createdAt: Date;
  songs: {
    songId: string;
    createdAt: Date;
  }[];
  error: false;
}

interface Song {
  createdAt: Date | undefined;
  artistId: string;
  artistName: string;
  albumTitle: string;
  coverPhoto: string;
  albumId: string;
  name: string;
  urlSong: string;
  error: false;
}

interface Recommended {
  title: string;
  id: string;
  coverPhoto: string;
  error: false;
}

type PlaylistResponse = Playlist | ErrorType;
type BundleResponse = BundleType[] | ErrorType;
type SongResponse = Song | ErrorType;
type RecommendedResponse = Recommended[] | ErrorType;
type ArtistResponse = Artist | ErrorType;

export type {
  PlaylistResponse,
  BundleResponse,
  SongResponse,
  RecommendedResponse,
  ArtistResponse,
  BundleType,
};
