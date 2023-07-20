import { connectToDatabase } from './couchbase';
// import * as couchbase from 'couchbase';

const createProfileCollection = async () => {
  let { cluster, bucket } = await connectToDatabase();

  const collectionMgr = bucket.collections();

  // let newCollectionSpec = new couchbase.CollectionSpec({
  //   name: 'profile',
  //   scopeName: '_default'
  // })
  //
  //
  // try {
  //   await collectionMgr.createCollection(newCollectionSpec)
  // } catch (e) {
  //   console.log('caught an error');
  //   console.log(e);
  // }

  console.log('creating profile collection');
};

createProfileCollection()
  .then(() => {
    console.log('\nProfile Collection Created Successfully');
  })
  .catch((e) => {
    console.error(e);
    console.error('\nFailed to Create Profile Collection');
  });
