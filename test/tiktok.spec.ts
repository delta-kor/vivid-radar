import 'dotenv/config';
import TiktokClient from '../src/tiktok/client';

test('scrap twitter feeds', async () => {
  const tiktok = new TiktokClient({
    id: 'csr.offcl',
  });
  const feeds = await tiktok.scrap();
});
