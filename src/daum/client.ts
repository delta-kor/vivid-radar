import { JSDOM } from 'jsdom';
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
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const area = document.getElementById('template_xmp');
    if (!area) throw new Error('Failed to find daum article content');

    const article = new JSDOM(area.innerHTML).window.document;

    let contents: string[] = [];

    const articleTitle = document.querySelector('strong.tit_info')?.textContent;
    if (!articleTitle) throw new Error('Failed to find daum article title');

    contents.push(articleTitle.trim() + '\n');

    const paragraphs = article.querySelectorAll('p, .figcaption');
    for (const paragraph of paragraphs.values()) {
      const item = paragraph.innerHTML
        .replace(/<br>/g, '\n')
        .replace(/(<([^>]+)>)/gi, '')
        .trim();

      if (item.length === 0) continue;
      contents.push(item);
    }

    const title = contents.join('\n');
    const media: VividMedia[] = [];

    const images = article.querySelectorAll('img.txc-image') as NodeListOf<HTMLImageElement>;
    for (const image of images) {
      const src = image.src;
      media.push({
        type: 'image',
        url: src,
      });
    }

    return {
      type: 'daum',
      id: `${this.config.boardId}/${articleId}`,
      account: this.config.cafeId,
      title: title,
      members: [],
      date: new Date(),
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
