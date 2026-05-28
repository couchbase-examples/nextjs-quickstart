import { testApiHandler } from 'next-test-api-route-handler';
import { randomUUID } from 'node:crypto';
import handler from '../pages/api/user';
import { connectToDatabase } from '../util/couchbase';

describe('DELETE /user?pid={id}', () => {
  describe('given we pass a pid as request param', () => {
    const id = randomUUID();

    beforeEach(async () => {
      const { profileCollection } = await connectToDatabase();
      const profile = {
        pid: id,
        firstName: 'Joseph',
        lastName: 'Developer',
        email: 'joseph.developer@couchbase.com',
      };
      await profileCollection
        .insert(id, profile)
        .catch((e) =>
          console.error(`Test Profile Insert Failed: ${e.message}`)
        );
    });

    test('should respond with status code 200 to DELETE', async () => {
      await testApiHandler({
        pagesHandler: handler,
        params: { pid: id },
        test: async ({ fetch }) => {
          let response = await fetch({
            method: 'DELETE',
          });
          expect(response.status).toBe(200);
        },
      });
    });
  });
});

afterAll(async () => {
  const { cluster } = await connectToDatabase();
  await cluster.close();
});
