import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/user';
import { connectToDatabase } from '../util/couchbase';

describe('POST /user', () => {
  const profile = {
    firstName: 'Joe',
    lastName: 'dev',
    email: 'joe@dev.com',
  };
  let pid;

  describe('given a request with firstName, lastName, and email', () => {
    test('should respond with statusCode 200 and return document persisted', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          let response = await fetch({
            method: 'POST',
            body: JSON.stringify(profile),
          });
          let jsonResponse = await response.json();
          pid = jsonResponse.pid;
          expect(response.status).toBe(201);
          expect(pid.length).toBe(36);
          expect(jsonResponse).toMatchObject({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
          });
        },
      });
    });

    afterEach(async () => {
      const { profileCollection } = await connectToDatabase();
      await profileCollection
        .remove(pid)
        .catch((e) =>
          console.error(`test profile remove failed: ${e.message}`)
        );
    });
  });

  describe('given a request is missing email', () => {
    const expected = { statusCode: 400, message: 'email is required' };
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          let response = await fetch({
            method: 'POST',
            body: JSON.stringify({
              firstName: profile.firstName,
              lastName: profile.lastName,
            }),
          });
          let jsonResponse = await response.json();
          expect(response.status).toBe(expected.statusCode);
          expect(jsonResponse.message).toBe(expected.message);
        },
      });
    });
  });
});

afterAll(async () => {
  const { cluster } = await connectToDatabase();
  await cluster.close();
});
