export interface Artist {
  id: string;
  name: string;
  englishName: string;
  description: string;
  imageUrl: string;
  day: 1 | 2;
  isHeadliner?: boolean;
}

export interface Track {
  id: string;
  artistId: string;
  title: string;
  tag: 'Essential' | 'Vibe' | 'Sing-along';
  videoUrl?: string;
  lyrics?: string[];
}

export type View = 'splash' | 'lineup' | 'artist-detail' | 'player';
