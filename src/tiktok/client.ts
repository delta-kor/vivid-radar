import { z } from 'zod';
import ClientBase from '../client-base';
import Request from '../core/request';
import { VividFeed } from '../vivid';
import { TiktokUserAgent } from './default';

export interface TiktokConfig {
  id: string;
  userAgent?: string;
}

const TiktokConfigSchema = z.object({
  id: z.string().min(1),
  userAgent: z.string().min(1).default(TiktokUserAgent),
});

export default class TiktokClient implements ClientBase {
  private readonly config: z.infer<typeof TiktokConfigSchema>;

  constructor(config: TiktokConfig) {
    this.config = TiktokConfigSchema.parse(config);
  }

  private async getSecUid(): Promise<string> {
    const url = `https://www.tiktok.com/@${this.config.id}`;
    const request = new Request<string>({
      url,
      method: 'GET',
      responseType: 'text',
    });

    const response = await request.send();
    const data = response.data;

    const hydrationDataJson = data.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/
    );
    if (!hydrationDataJson) throw new Error('Failed to get hydration data');

    const hydrationData = JSON.parse(hydrationDataJson[1]);
    const secUid = hydrationData.__DEFAULT_SCOPE__['webapp.user-detail'].userInfo.user.secUid;

    return secUid;
  }

  public async scrap(): Promise<VividFeed[]> {
    const secUid = await this.getSecUid();

    return [];
  }
}
