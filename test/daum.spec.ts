import { DaumClient } from '../src';

test('scrap daum feeds', async () => {
  const daum = new DaumClient({ cafeId: 'csr.official', boardId: 'ZDmo', grpId: '1ZKSg' });
  const feeds = await daum.scrap();

  expect(feeds).toBeDefined();
  expect(feeds.length).toBeGreaterThan(0);
  for (const feed of feeds) {
    expect(feed.id).toBeDefined();
    expect(feed.title).toBeDefined();
    expect(feed.date).toBeDefined();
    expect(feed.media).toBeDefined();
    for (const media of feed.media) {
      expect(media.type).toBeDefined();
      expect(media.url).toBeDefined();
    }
  }
});
