import BstageClient from '../src/bstage/client';

test('scrap recent feeds', async () => {
  const bstage = new BstageClient({ id: 'csr', host: 'csr.bstage.in', page: 1, pageSize: 5 });
  const feeds = await bstage.scrap();

  expect(feeds).toBeDefined();
  expect(feeds.length).toBeGreaterThan(0);
  for (const feed of feeds) {
    expect(feed.id).toBeDefined();
    expect(feed.title).toBeDefined();
    expect(feed.date).toBeDefined();
    expect(feed.media).toBeDefined();
    expect(feed.media.length).toBeGreaterThan(0);
    for (const media of feed.media) {
      expect(media.type).toBeDefined();
      expect(media.url).toBeDefined();
    }
  }
});
