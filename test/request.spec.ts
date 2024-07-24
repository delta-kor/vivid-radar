import Request from '../src/core/request';

test('the fetch succeeds', async () => {
  const request = new Request<string>({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'GET',
    responseType: 'json',
  });

  const response = await request.send();

  expect(response.data).toEqual({
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  });

  expect(response.headers).toMatchObject({
    'content-type': 'application/json; charset=utf-8',
  });
});
