// Global type augmentations for prototype utilities
declare interface String {
  isUrl(): boolean;
  capitalize(): string;
  maximumChar(limit?: number, endThreePoints?: boolean): string;
  isUrlSpotify(): boolean;
  isUrlYoutubePlaylist(): boolean;
  isUrlSoundcloud(): boolean;
}

declare interface Array<T> {
  shuffle(): void;
}

export {}; // Ensure this file is treated as a module
