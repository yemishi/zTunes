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
  error: true;
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
  releasedDate?: string;
  artistName: string;
  artistId: string;
  coverPhoto: string;
  createdAt: Date;
  isOfficial?: boolean;
  error: false;
  desc?: string;
  urlsSongs?: string[];
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
  artistId: string;
  artistName: string;
  albumName: string;
  coverPhoto: string;
  albumId: string;
  name: string;
  urlSong: string;
  error: false;
}

interface RecommendedType {
  title: string;
  id: string;
  coverPhoto: string;
  error: false;
}
