export interface TiktokResponse {
  cursor: string;
  extra: any;
  hasMore: boolean;
  itemList: TiktokItemList[];
  log_pb: any;
  statusCode: number;
  status_code: number;
  status_msg: string;
}

export interface TiktokItemList {
  AIGCDescription: string;
  author: any;
  challenges?: any[];
  collected: boolean;
  contents: any[];
  createTime: number;
  desc: string;
  digged: boolean;
  diversificationId?: number;
  duetDisplay: number;
  duetEnabled: boolean;
  forFriend: boolean;
  id: string;
  itemCommentStatus: number;
  item_control: any;
  music: any;
  officalItem: boolean;
  originalItem: boolean;
  privateItem: boolean;
  secret: boolean;
  shareEnabled: boolean;
  stats: any;
  statsV2: any;
  stitchDisplay: number;
  stitchEnabled?: boolean;
  textExtra?: any[];
  video: TiktokVideoData;
  aigcLabelType?: number;
  isAd?: boolean;
}

export interface TiktokVideoData {
  VQScore: string;
  bitrate: number;
  bitrateInfo: any[];
  codecType: string;
  cover: string;
  definition: string;
  downloadAddr: string;
  duration: number;
  dynamicCover: string;
  encodeUserTag: string;
  encodedType: string;
  format: string;
  height: number;
  id: string;
  originCover: string;
  playAddr: string;
  ratio: string;
  videoQuality: string;
  volumeInfo: any;
  width: number;
  zoomCover: TiktokZoomCover;
  subtitleInfos?: any[];
}

export interface TiktokZoomCover {
  '240': string;
  '480': string;
  '720': string;
  '960': string;
}
