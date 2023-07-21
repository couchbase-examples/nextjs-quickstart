import { connectToDatabase } from './couchbase.js';
import { readFile } from 'fs/promises';
import * as couchbase from 'couchbase';

export const createProfileCollection = async () => {
  let { bucket } = await connectToDatabase();

  const collectionMgr = bucket.collections();

  let newCollectionSpec = new couchbase.CollectionSpec({
    name: 'profile',
    scopeName: '_default',
  });

  try {
    await collectionMgr.createCollection(newCollectionSpec);
  } catch (e) {
    throw new Error(e);
  }
};

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
      throw new Error(err);
    }
  }
};

createProfileCollection()
  .then(() => {
    console.log('Profile Collection Created. Loading Sample Data.');
    loadSampleData()
      .then(() => {
        console.log('\nSample Data Loaded Successfully');
      })
      .catch((e) => {
        console.log(e);
        console.error('\nFailed to Load Sample Data: ' + e.message);
      });
  })
  .catch(() => {
    console.log('Profile Collection Already Exists. Loading Sample Data.');
    loadSampleData()
      .then(() => {
        console.log('\nSample Data Loaded Successfully');
      })
      .catch((e) => {
        console.log(e);
        console.error('\nFailed to Load Sample Data: ' + e.message);
      });
  });
