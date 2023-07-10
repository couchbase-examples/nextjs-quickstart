import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/user';
import { v4 } from 'uuid';
import { connectToDatabase } from '../util/couchbase';

describe('PUT /user?pid={id}', () => {
  describe('given the profile object is updated', () => {
    const id = v4();
    const initialProfile = {
      pid: id,
      firstName: 'Joseph',
      lastName: 'Developer',
      email: 'joseph.developer@couchbase.com',
    };
    const updatedProfile = {
      firstName: 'Joe',
      lastName: 'dev',
      email: 'joe@dev.com',
    };

    beforeEach(async () => {
      const { profileCollection } = await connectToDatabase();
      await profileCollection
        .insert(id, initialProfile)
        .catch((e) =>
          console.error(`Test Profile Insert Failed: ${e.message}`)
        );
    });

    test('should respond with status code 200 OK and updated values of document returned', async () => {
      await testApiHandler({
        handler,
        params: { pid: id },
        test: async ({ fetch }) => {
          let response = await fetch({
            method: 'PUT',
            body: JSON.stringify(updatedProfile),
          });
          let jsonResponse = await response.json();
          expect(response.status).toBe(200);
          expect(jsonResponse.firstName).toBe(updatedProfile.firstName);
          expect(jsonResponse.lastName).toBe(updatedProfile.lastName);
          expect(jsonResponse.email).toBe(updatedProfile.email);
        },
      });
    });

    afterEach(async () => {
      const { profileCollection } = await connectToDatabase();
      await profileCollection
        .remove(id)
        .catch((e) =>
          console.error(`test profile remove failed: ${e.message}`)
        );
    });
  });
});

afterAll(async () => {
  const { cluster } = await connectToDatabase();
  await cluster.close();
});
