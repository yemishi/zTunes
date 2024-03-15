export type {
  SongType,
  ArtistType,
  BundleTypeType,
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

interface BundleTypeType {
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

interface UserType {
  avatar: string;
  name: string;
  id: string;
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
}

interface FollowersType {
  length: number;
  isInclude: boolean;
}

interface ArtistType {
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
  albumTitle: string;
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
