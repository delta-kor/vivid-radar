import 'dotenv/config';
import * as process from 'node:process';
import TiktokClient from '../src/tiktok/client';

const tokenConfig = {
  url: process.env.TIKTOK_TOKEN_URL as string,
  magic: parseInt(process.env.TIKTOK_TOKEN_MAGIC as string),
  version: 1,
  dataType: 8,
  strData: process.env.TIKTOK_TOKEN_STR_DATA as string,
};

test('scrap twitter feeds', async () => {
  const tiktok = new TiktokClient({
    id: 'csr.offcl',
    tokenConfig,
    maxCount: 50,
  });
  const feeds = await tiktok.scrap();

  expect(feeds).toBeDefined();
  expect(feeds.length).toBeGreaterThanOrEqual(50);
  for (const feed of feeds) {
    expect(feed.id).toBeDefined();
    expect(feed.title).toBeDefined();
    expect(feed.date).toBeDefined();
    expect(feed.media).toBeDefined();
    expect(feed.media.length).toBe(1);
    for (const media of feed.media) {
      expect(media.type).toBeDefined();
      expect(media.url).toBeDefined();
    }
  }
});
