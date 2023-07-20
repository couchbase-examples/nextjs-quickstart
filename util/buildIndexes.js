import { ensureIndexes } from './ensureIndexes.js';
import * as couchbase from 'couchbase';
import { connectToDatabase } from './couchbase';

const createProfileCollection = async () => {
  let { bucket } = await connectToDatabase();

  const collectionMgr = bucket.collections();

  let newCollectionSpec = new couchbase.CollectionSpec({
    name: 'profile',
    scopeName: '_default',
  });

  try {
    await collectionMgr.createCollection(newCollectionSpec);
  } catch (e) {
    console.log('caught an error');
    console.log(e);
  }
};

ensureIndexes()
  .then(() => {
    console.log('Finished Building Indexes');
  })
  .catch((e) => {
    console.log('Error Building Indexes, ', e);
  });
