export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export const InMemoryFavoritesStore: Favorites = {
  artists: [],
  albums: [],
  tracks: [],
};
