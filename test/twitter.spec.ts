import 'dotenv/config';
import TwitterClient from '../src/twitter/client';

test('scrap recent feeds', async () => {
  const twitter = new TwitterClient({
    userId: '1534717807518429186',
    userName: 'CSR_offcl',
    authToken: process.env.TWITTER_AUTH_TOKEN as string,
  });
  const feeds = await twitter.scrap();

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
