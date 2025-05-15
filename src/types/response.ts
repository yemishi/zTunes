export type {
  SongType,
  ArtistType,
  PlaylistType,
  RecommendedType,
  ManyPlaylistType,
  ErrorType,
  BundleType,
  FollowersType,
  UserType,
};

interface ErrorType {
  error: boolean;
  message: string;
}

interface UserType {
  avatar: string;
  name: string;
  isArtist: boolean;
  isAdmin: boolean;
  id: string;
  error: false;
}
interface BundleType {
  avatar: string;
  id: string;
  title: string;
  type: string;
  artistName: string;
  artistId: string;
  coverPhoto: string;
  createdAt: Date;
  error: boolean;
  message: string;
  status: number;
  releasedDate?: string;
  vibrantColor?: { color: string; isLight: boolean };
  isOfficial?: boolean;
  desc?: string;
  tracks?: { url: string; duration: number }[];
}

interface FollowersType {
  length: number;
  isInclude: boolean;
}

interface ArtistType {
  id: string;
  name: string;
  summary: string;
  cover: string;
  profile: {
    avatar: string;
    birthDate: string;
  };
  error: false;
}

interface ManyPlaylistType {
  playlists: PlaylistType[];
  hasMore: boolean;
  error: false;
}

interface PlaylistType {
  id: string;
  title: string;
  userId: string;
  desc?: string;
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

interface SongType {
  id: string;
  createdAt: Date;
  album: {
    name: string;
    id: string;
    vibrantColor?: { color: string; isLight: boolean };
  };
  artistId: string;
  artistName: string;
  coverPhoto: string;
  name: string;
  category?: string[];
  track: { url: string; duration: number };
  error: false;
}

interface RecommendedType {
  title: string;
  id: string;
  coverPhoto: string;
  error: false;
}
