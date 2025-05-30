
export interface Song {
  id: string;
  title: string;
  artist: string;
  featuredArtist?: string; // Added optional featuredArtist
  albumArtUrl: string;
  audioSnippetUrl: string;
}