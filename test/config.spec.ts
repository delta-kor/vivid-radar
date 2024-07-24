import Config from '../src/core/config';

test('loads config from default path', () => {
  const config = new Config();
  expect(config).toBeDefined();
});

test('loads config from custom path', () => {
  const config = new Config('config.yaml');
  expect(config).toBeDefined();
});
