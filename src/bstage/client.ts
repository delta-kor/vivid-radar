import { z } from 'zod';
import ClientBase from '../client-base';
import Request from '../core/request';
import { VividFeed, VividMedia } from '../vivid';
import { BstageResponse } from './response';

export interface BstageConfig {
  id: string;
  host: string;
  page: number;
  pageSize: number;
}

const BstageConfigSchema = z.object({
  id: z.string().min(1),
  host: z.string().min(1),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(20),
});

export default class BstageClient implements ClientBase {
  private readonly config: z.infer<typeof BstageConfigSchema>;

  constructor(config: BstageConfig) {
    this.config = BstageConfigSchema.parse(config);
  }

  private getVideoThumbnailPath(path: string): string {
    return `https://image.static.bstage.in/cdn-cgi/image/metadata=none,dpr=2,f=auto,width=590/${this.config.id}${path}`;
  }

  private getVideoPath(path: string): string {
    return `https://media.static.bstage.in/${this.config.id}${path}`;
  }

  private async fetchData(): Promise<BstageResponse> {
    const url = `https://${this.config.host}/svc/home/api/v1/home/star`;

    const request = new Request<BstageResponse>({
      url,
      method: 'GET',
      query: {
        page: this.config.page,
        pageSize: this.config.pageSize,
      },
      responseType: 'json',
    });

    const response = await request.send();
    return response.data;
  }

  private parseData(data: BstageResponse): VividFeed[] {
    if (!data.feeds) throw new Error('Failed to parse bstage feeds');

    const result: VividFeed[] = [];
    for (const feed of data.feeds.items) {
      if (feed.type !== 'FEED_ITEM_STAR_POST') continue;

      const id = feed.id;
      const account = this.config.host;
      const title = feed.title;
      const members: string[] = [];
      const date = new Date(feed.publishedAt);

      const media: VividMedia[] = [];

      if (typeof feed.video !== 'undefined') {
        media.push({
          type: 'video',
          thumbnail: this.getVideoThumbnailPath(feed.video.thumbnailPaths[0].path),
          url: this.getVideoPath(feed.video.hlsPath.path),
        });
      }

      if (Array.isArray(feed.images)) {
        for (const image of feed.images) {
          media.push({
            type: 'image',
            url: image,
          });
        }
      }

      result.push({ type: 'bstage', id, account, title, members, date, media });
    }

    return result;
  }

  public async scrap(): Promise<VividFeed[]> {
    const data = await this.fetchData();
    return this.parseData(data);
  }
}
