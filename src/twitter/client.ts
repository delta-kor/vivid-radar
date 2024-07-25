import { z } from 'zod';
import ClientBase from '../client-base';
import Request from '../core/request';
import { VividFeed, VividFeedType, VividMedia } from '../vivid';
import { TwitterBearerToken, TwitterQueryId, TwitterUserAgent } from './defaults';
import { TwitterResponse } from './response';

export interface TwitterConfig {
  userId: string;
  userName: string;
  authToken: string;
  userAgent?: string;
  bearerToken?: string;
  queryId?: string;
}

const TwitterConfigSchema = z.object({
  userId: z.string().min(1),
  userName: z.string().min(1),
  authToken: z.string().min(1),
  userAgent: z.string().min(1).default(TwitterUserAgent),
  bearerToken: z.string().min(1).default(TwitterBearerToken),
  queryId: z.string().min(1).default(TwitterQueryId),
});

export class TwitterClient implements ClientBase {
  private readonly config: z.infer<typeof TwitterConfigSchema>;

  constructor(config: TwitterConfig) {
    this.config = TwitterConfigSchema.parse(config);
  }

  private async getCsrf(): Promise<string> {
    const url = `https://x.com/${this.config.userName}/media`;
    const request = new Request({
      url,
      method: 'GET',
      headers: {
        'User-Agent': this.config.userAgent,
        Cookie: `auth_token=${this.config.authToken}`,
      },
      responseType: 'text',
    });

    const response = await request.send();
    const headers = response.headers['set-cookie'];
    if (!headers) throw new Error('Failed to get csrf token');

    const csrf = headers.match(/ct0=([^;]+)/);
    if (!csrf) throw new Error('Failed to get csrf token');

    const token = csrf[1];
    return token;
  }

  private async fetchData(csrf: string): Promise<TwitterResponse> {
    const variables = {
      userId: this.config.userId,
      count: 50,
      includePromotedContent: false,
      withClientEventToken: false,
      withBirdwatchNotes: false,
      withVoice: true,
      withV2Timeline: true,
    };
    const features = {
      rweb_tipjar_consumption_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_timeline_navigation_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      communities_web_enable_tweet_community_results_fetch: true,
      c9s_tweet_anatomy_moderator_badge_enabled: true,
      articles_preview_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
      view_counts_everywhere_api_enabled: true,
      longform_notetweets_consumption_enabled: true,
      responsive_web_twitter_article_tweet_consumption_enabled: true,
      tweet_awards_web_tipping_enabled: false,
      creator_subscriptions_quote_tweet_preview_enabled: false,
      freedom_of_speech_not_reach_fetch_enabled: true,
      standardized_nudges_misinfo: true,
      tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
      rweb_video_timestamps_enabled: true,
      longform_notetweets_rich_text_read_enabled: true,
      longform_notetweets_inline_media_enabled: true,
      responsive_web_enhance_cards_enabled: false,
    };
    const fieldToggles = { withArticlePlainText: false };

    const url = `https://x.com/i/api/graphql/${TwitterQueryId}/UserMedia`;
    const request = new Request<TwitterResponse>({
      url,
      method: 'GET',
      query: {
        variables: JSON.stringify(variables),
        features: JSON.stringify(features),
        fieldToggles: JSON.stringify(fieldToggles),
      },
      headers: {
        Authorization: TwitterBearerToken,
        'Content-Type': 'application/json',
        Cookie: `auth_token=${this.config.authToken}; ct0=${csrf}`,
        'x-csrf-token': csrf,
      },
      responseType: 'json',
    });

    const response = await request.send();
    return response.data;
  }

  private parseData(data: TwitterResponse): VividFeed[] {
    const timeline = data.data.user.result.timeline_v2.timeline.instructions
      .find((i: any) => i.type === 'TimelineAddEntries')!
      .entries!.find((i: any) => (i.entryId = 'profile-grid-0'))!.content.items!;

    const items = timeline.map(item => {
      const tweet = item.item.itemContent.tweet_results.result.legacy;

      const type = 'twitter' as VividFeedType;
      const id = tweet.id_str;
      const account = this.config.userName;
      const title = tweet.full_text;
      const date = new Date(tweet.created_at);
      const members: string[] = [];

      const media: VividMedia[] =
        tweet.extended_entities?.media.map(media => {
          if (media.type === 'photo') {
            return { type: 'image', url: media.media_url_https };
          } else if (media.type === 'video') {
            const url = media.video_info?.variants
              .filter(v => v.content_type === 'video/mp4')
              .sort((a, b) => b.bitrate - a.bitrate)[0].url;
            if (!url) throw new Error('Failed to get video url');
            return { type: 'video', thumbnail: media.media_url_https, url };
          } else {
            throw new Error('Unknown media type');
          }
        }) || [];

      return { type, id, account, title, date, members, media };
    });

    return items;
  }

  public async scrap(): Promise<VividFeed[]> {
    const csrf = await this.getCsrf();
    const data = await this.fetchData(csrf);
    return this.parseData(data);
  }
}
