import { load } from 'cheerio';
import { z } from 'zod';
import ClientBase from '../client-base';
import Request from '../core/request';
import { VividFeed, VividMedia } from '../vivid';

export interface DaumConfig {
  cafeId: string;
  boardId: string;
  grpId: string;
}

const DaumConfigSchema = z.object({
  cafeId: z.string().min(1),
  boardId: z.string().min(1),
  grpId: z.string().min(1),
});

export class DaumClient implements ClientBase {
  private readonly config: z.infer<typeof DaumConfigSchema>;

  constructor(config: DaumConfig) {
    this.config = DaumConfigSchema.parse(config);
  }

  private async fetchList(): Promise<string[]> {
    const url = `https://cafe.daum.net/_c21_/bbs_list?grpid=${this.config.grpId}&fldid=${this.config.boardId}&svc=toprank`;

    const request = new Request<string>({
      url,
      method: 'GET',
      responseType: 'text',
    });

    const response = await request.send();
    const data = response.data;

    const area = data
      .split(`var articles = [];`)[1]
      .split(`var boardAdmins = [];`)[0]
      .trim()
      .split(`articles.push(`)
      .filter(x => x.trim().length > 0)
      .map(x => x.split(`);`)[0].trim());

    const result: string[] = [];
    for (const item of area) {
      const id = item.match(/dataid: '([^']+)'/);
      if (!id) continue;
      result.push(id[1]);
    }

    return result;
  }

  private async fetchArticle(articleId: string): Promise<string> {
    const url = `https://cafe.daum.net/_c21_/bbs_search_read?grpid=${this.config.grpId}&fldid=${this.config.boardId}&datanum=${articleId}&svc=toprank`;

    const request = new Request<string>({
      url,
      method: 'GET',
      responseType: 'text',
    });

    const response = await request.send();
    const data = response.data;

    return data;
  }

  private parseArticle(html: string, articleId: string): VividFeed {
    const $ = load(html);

    const area = $('#template_xmp');
    if (!area) throw new Error('Failed to find daum article content');

    const article = load(area.html()!);

    let contents: string[] = [];

    const articleTitle = $('strong.tit_info').text();
    if (!articleTitle) throw new Error('Failed to find daum article title');

    contents.push(articleTitle.trim() + '\n');

    const paragraphs = article('p, .figcaption').toArray();
    for (const paragraph of paragraphs) {
      const item = $.html(paragraph)
        .replace(/<br>/g, '\n')
        .replace(/(<([^>]+)>)/gi, '')
        .trim();

      if (item.length === 0) continue;
      contents.push(item);
    }

    const title = contents.join('\n');
    const media: VividMedia[] = [];

    const images = article('img.txc-image').toArray();
    for (const image of images) {
      const src = image.attribs['src'];
      media.push({
        type: 'image',
        url: src,
      });
    }

    const dateElement = $('.cover_info > .txt_item:nth-child(4)');
    if (!dateElement) throw new Error('Failed to find daum article date');

    const dateString = dateElement.text();
    if (!dateString || dateString.length !== 14)
      throw new Error('Failed to parse daum article date');

    const year = parseInt(dateString.slice(0, 2)) + 2000;
    const month = parseInt(dateString.slice(3, 5)) - 1;
    const day = parseInt(dateString.slice(6, 8));
    const hour = parseInt(dateString.slice(9, 11));
    const minute = parseInt(dateString.slice(12, 14));

    const date = new Date(year, month, day, hour, minute);

    return {
      type: 'daum',
      id: `${this.config.boardId}/${articleId}`,
      account: this.config.cafeId,
      title: title,
      members: [],
      date,
      media,
    };
  }

  public async scrap(): Promise<VividFeed[]> {
    const list = await this.fetchList();

    const result: VividFeed[] = [];
    for (const articleId of list) {
      const html = await this.fetchArticle(articleId);
      const data = this.parseArticle(html, articleId);
      result.push(data);
    }

    return result;
  }
}
