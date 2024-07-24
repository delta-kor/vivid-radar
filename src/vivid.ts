export type VividFeedType = 'bstage' | 'daum' | 'tiktok' | 'twitter';

export interface VividFeed {
  type: VividFeedType;
  id: string;
  account: string;
  title: string;
  members: string[];
  date: Date;
  media: VividMedia[];
}

export type VividMedia = VividImageMedia | VividVideoMedia;

export interface VividImageMedia {
  type: 'image';
  url: string;
}

export interface VividVideoMedia {
  type: 'video';
  thumbnail: string;
  url: null | string;
}
