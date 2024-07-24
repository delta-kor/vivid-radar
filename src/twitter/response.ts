export interface TwitterResponse {
  data: TwitterResponseData;
}

export interface TwitterResponseData {
  user: TwitterResponseUser;
}

export interface TwitterResponseUser {
  result: TwitterResponseUserResult;
}

export interface TwitterResponseUserResult {
  __typename: string;
  timeline_v2: TwitterResponseTimeline;
}

export interface TwitterResponseTimeline {
  timeline: TwitterResponseTimelineData;
}

export interface TwitterResponseTimelineData {
  instructions: TwitterResponseInstruction[];
  metadata: any;
}

export interface TwitterResponseInstruction {
  type: string;
  direction?: string;
  entries?: TwitterResponseEntry[];
}

export interface TwitterResponseEntry {
  entryId: string;
  sortIndex: string;
  content: TwitterResponseContent;
}

export interface TwitterResponseContent {
  entryType: string;
  __typename: string;
  items?: TwitterResponseItem[];
  displayType?: string;
  clientEventInfo?: any;
  value?: string;
  cursorType?: string;
}

export interface TwitterResponseItem {
  entryId: string;
  item: TwitterResponseItemData;
}

export interface TwitterResponseItemData {
  itemContent: TwitterResponseItemContent;
}

export interface TwitterResponseItemContent {
  itemType: string;
  __typename: string;
  tweet_results: TwitterResponseTweetResult;
  tweetDisplayType: string;
}

export interface TwitterResponseTweetResult {
  result: TwitterResponseTweetData;
}

export interface TwitterResponseTweetData {
  __typename: string;
  rest_id: string;
  core: any;
  unmention_data: any;
  edit_control: any;
  is_translatable: boolean;
  views: any;
  source: string;
  legacy: TwitterResponseLegacy;
}

export interface TwitterResponseLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: any;
  extended_entities: TwitterResponseExtendedEntities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: string;
  possibly_sensitive: boolean;
  possibly_sensitive_editable: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
}

export interface TwitterResponseExtendedEntities {
  media: TwitterResponseMedia[];
}

export interface TwitterResponseMedia {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: string;
  url: string;
  additional_media_info?: any;
  ext_media_availability: any;
  sizes: any;
  original_info: any;
  allow_download_status?: any;
  video_info?: any;
  media_results: any;
  features?: any;
}
