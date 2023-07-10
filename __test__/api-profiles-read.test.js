import { testApiHandler } from 'next-test-api-route-handler';
import handler from '../pages/api/user';
import { v4 } from 'uuid';
import { connectToDatabase } from '../util/couchbase';

const profile1 = {
  pid: v4(),
  firstName: 'Joe',
  lastName: 'Schmoe',
  email: 'joe.schmoe@couchbase.com',
};
const profile2 = {
  pid: v4(),
  firstName: 'John',
  lastName: 'Dear',
  email: 'john.dear@couchbase.com',
};

beforeAll(async () => {
  const { profileCollection } = await connectToDatabase();
  await profileCollection
    .insert(profile1.pid, profile1)
    .catch((e) => console.log(`test profile insert failed: ${e.message}`));
  await profileCollection
    .insert(profile2.pid, profile2)
    .catch((e) => console.log(`test profile insert failed: ${e.message}`));
});

describe('GET /user', () => {
  test('responds 200 to GET all', async () => {
    await testApiHandler({
      handler,
      params: { search: 'jo' },
      test: async ({ fetch }) => {
        let response = await fetch({ method: 'GET' });
        let jsonResponse = await response.json();
        expect(jsonResponse).toEqual(
          expect.arrayContaining([
            expect.objectContaining(profile2),
            expect.objectContaining(profile1),
          ])
        );
        expect(response.status).toBe(200);
      },
    });
  });
  test('responds 200 to GET with search string', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        let response = await fetch({ method: 'GET' });
        let jsonResponse = await response.json();
        expect(jsonResponse).toEqual(
          expect.arrayContaining([
            expect.objectContaining(profile2),
            expect.objectContaining(profile1),
          ])
        );
        expect(response.status).toBe(200);
      },
    });
  });
});

afterAll(async () => {
  const { cluster, profileCollection } = await connectToDatabase();
  await profileCollection
    .remove(profile1.pid)
    .catch((e) => console.error(`test profile remove failed: ${e.message}`));
  await profileCollection
    .remove(profile2.pid)
    .catch((e) => console.error(`test profile remove failed: ${e.message}`));
  await cluster.close();
});
