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
  });
  const feeds = await tiktok.scrap();
});
