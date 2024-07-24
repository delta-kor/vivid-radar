import { z } from 'zod';
import ClientBase from '../client-base';
import Request from '../core/request';
import { VividFeed } from '../vivid';
import { TiktokBrowserVersion, TiktokDeviceId, TiktokUserAgent } from './defaults';

export interface TiktokTokenConfig {
  url: string;
  magic: number;
  version: number;
  dataType: number;
  strData: string;
}

export interface TiktokConfig {
  id: string;
  tokenConfig: TiktokTokenConfig;
  userAgent?: string;
  browserVersion?: string;
  deviceId?: string;
}

const TiktokConfigSchema = z.object({
  id: z.string().min(1),
  tokenConfig: z.object({
    url: z.string().min(1),
    magic: z.number(),
    version: z.number(),
    dataType: z.number(),
    strData: z.string().min(1),
  }),
  userAgent: z.string().min(1).default(TiktokUserAgent),
  browserVersion: z.string().min(1).default(TiktokBrowserVersion),
  deviceId: z.string().min(1).default(TiktokDeviceId),
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

  private async createMsToken(): Promise<string> {
    const url = this.config.tokenConfig.url;

    const payload = {
      magic: this.config.tokenConfig.magic,
      version: this.config.tokenConfig.version,
      dataType: this.config.tokenConfig.dataType,
      strData: this.config.tokenConfig.strData,
      tspFromClient: Date.now(),
    };

    const request = new Request({
      url,
      method: 'POST',
      payload,
      headers: {
        'User-Agent': this.config.userAgent,
      },
      requestType: 'json',
      responseType: 'json',
    });

    const response = await request.send();
    const headers = response.headers;
    const cookie = headers['set-cookie'];

    const msTokenMatch = cookie.match(/msToken=(.*?);/);
    console.log(response.data);

    if (!msTokenMatch) throw new Error('Failed to fetch msToken');
    const msToken = msTokenMatch[1];

    if (!msToken || msToken.length !== 148) throw new Error('Failed to parse msToken');

    return msToken;
  }

  private createBaseRequestModel(): any {
    return {
      WebIdLastTime: Math.round(Date.now() / 1000).toString(),
      aid: '1988',
      app_language: 'zh-Hans',
      app_name: 'tiktok_web',
      browser_language: 'zh-CN',
      browser_name: 'Mozilla',
      browser_online: 'true',
      browser_platform: 'Win32',
      browser_version: this.config.browserVersion,
      channel: 'tiktok_web',
      cookie_enabled: 'true',
      device_id: this.config.deviceId,
      device_platform: 'web_pc',
      focus_state: 'true',
      from_page: 'user',
      history_len: '4',
      is_fullscreen: 'false',
      is_page_visible: 'true',
      language: 'zh-Hans',
      os: 'windows',
      priority_region: 'US',
      referer: '',
      region: 'SG',
      screen_height: '1080',
      screen_width: '1920',
      webcast_language: 'zh-Hans',
      tz_name: 'Asia/Hong_Kong',
      msToken:
        'cILhrY1KigXPuGw2v_4fKEJ8R2hBupizGn2vF7GGVaKI9FKl3yNzVs5Hv-PiCd-_mDcWBre6StVhZT_3xqU0WHqpX3pyz3Ah5vyZBryH48AetjRq2oxrVfjr0iKSY1GN9nth1BRCon_oUEEAth6-ruNp5YE=',
    };
  }

  public async scrap(): Promise<VividFeed[]> {
    const secUid = await this.getSecUid();
    const msToken = await this.createMsToken();
    console.log(msToken);

    return [];
  }
}
