import { connectToDatabase } from './couchbase.js';
import * as couchbase from 'couchbase';

export const ensureIndexes = async () => {
  let { cluster } = await connectToDatabase();
  const CB_BUCKET = process.env.CB_BUCKET;

  const bucketIndex = `CREATE PRIMARY INDEX ON \`${CB_BUCKET}\``;
  const collectionIndex = `CREATE PRIMARY INDEX ON default:\`${CB_BUCKET}\`._default.profile;`;

  try {
    await cluster.query(bucketIndex);
    console.log(`Bucket Index Creation: SUCCESS`);
  } catch (err) {
    if (err instanceof couchbase.IndexExistsError) {
      console.info('Bucket Index Creation: Index Already Exists');
    } else {
      console.error('Error Building Bucket Index: \n');
      console.error(err.cause);
    }
  }

  try {
    await cluster.query(collectionIndex);
    console.log(`Collection Index Creation: SUCCESS`);
  } catch (err) {
    if (err instanceof couchbase.IndexExistsError) {
      console.info('Collection Index Creation: Index Already Exists');
    } else {
      console.error('Error Building Collection Index: \n');
      console.error(err.cause);
    }
  }
};
