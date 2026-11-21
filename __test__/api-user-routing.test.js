import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/user';
import { connectToDatabase } from '../util/couchbase';

describe('/api/user method routing', () => {
  describe('given an unsupported HTTP method', () => {
    test('should respond with 405 and an Allow header instead of hanging', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'PATCH' });
          const jsonResponse = await response.json();
          expect(response.status).toBe(405);
          expect(response.headers.get('allow')).toBe('GET, POST, PUT, DELETE');
          expect(jsonResponse.message).toBe('Method PATCH Not Allowed');
        },
      });
    });
  });

  describe('given a POST request with no body', () => {
    test('should respond with 400 email is required', async () => {
      await testApiHandler({
        pagesHandler: handler,
        test: async ({ fetch }) => {
          const response = await fetch({ method: 'POST' });
          const jsonResponse = await response.json();
          expect(response.status).toBe(400);
          expect(jsonResponse.message).toBe('email is required');
        },
      });
    });
  });
});

afterAll(async () => {
  const { cluster } = await connectToDatabase();
  await cluster.close();
});
