import Request from '../src/core/request';

test('the fetch succeeds', async () => {
  const request = new Request<any>({
    url: 'https://httpbin.org/get',
    method: 'GET',
    responseType: 'json',
  });

  const response = await request.send();

  expect(response.data).toMatchObject({
    url: 'https://httpbin.org/get',
  });

  expect(response.headers).toMatchObject({
    'content-type': 'application/json',
  });
});

test('the fetch succeeds with query', async () => {
  const request = new Request<any>({
    url: 'https://httpbin.org/get',
    method: 'GET',
    query: {
      key: 'value',
    },
    responseType: 'json',
  });

  const response = await request.send();

  expect(response.data).toMatchObject({
    args: { key: 'value' },
  });
});

test('the fetch succeeds with payload', async () => {
  const request = new Request<any>({
    url: 'https://httpbin.org/post',
    method: 'POST',
    payload: {
      key: 'value',
    },
    requestType: 'json',
    responseType: 'json',
  });

  const response = await request.send();

  expect(response.data).toMatchObject({
    json: { key: 'value' },
  });
});
