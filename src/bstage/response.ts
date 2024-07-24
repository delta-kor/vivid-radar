export interface BstageResponse {
  stars: any[];
  feeds: BstageResponseFeed;
}

export interface BstageResponseFeed {
  '@type': string;
  size: number;
  number: number;
  numberOfElements: number;
  isFirst: boolean;
  isLast: boolean;
  items: BstageResponseFeedItem[];
}

export interface BstageResponseFeedItem {
  id: string;
  type: string;
  typeId: string;
  title: string;
  description: string;
  tags: any[];
  mainImage: string;
  createdAt: string;
  publishedAt: string;
  commentCount: number;
  latestComment: any;
  commentedStars: any[];
  reactionCounts: any;
  starReactions: any[];
  paid: boolean;
  images?: string[];
  author: any;
  video?: Video;
}

export interface Video {
  preset: string;
  hlsPath: HlsPath;
  dashPath: DashPath;
  thumbnailPaths: ThumbnailPath[];
  status: string;
  duration: number;
}

export interface HlsPath {
  source: string;
  path: string;
}

export interface DashPath {
  source: string;
  path: string;
}

export interface ThumbnailPath {
  source: string;
  path: string;
}
