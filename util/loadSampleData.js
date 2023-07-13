import { connectToDatabase } from './couchbase.js';
import { readFile } from 'fs/promises';

const loadSampleData = async () => {
  let { profileCollection } = await connectToDatabase();

  const mockData = JSON.parse(
    await readFile(new URL('../MOCK_DATA.json', import.meta.url))
  );

  for (const profile of mockData) {
    try {
      await profileCollection.insert(profile.pid, profile);
      console.log(
        `Inserted Profile for ${profile.firstName} ${profile.lastName}`
      );
    } catch (err) {
      console.error(err);
    }
  }
};

loadSampleData()
  .then(() => {
    console.log('Sample Data Loaded Successfully');
  })
  .catch((e) => {
    console.error(e);
    console.error('\nFailed to Load Sample Data');
  });
