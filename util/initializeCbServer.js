import qs from 'qs';
import axios from 'axios';

import { delay } from './delay.js';
import { ensureIndexes } from './ensureIndexes.js';

let DELAY_LENGTH = process.env.DELAY || 5000;

const username = process.env.CB_USERNAME;
const password = process.env.CB_PASSWORD;
const auth = `Basic ${Buffer.from(username + ':' + password).toString(
  'base64'
)}`;

let CB_BUCKET = process.env.CB_BUCKET;

const restCreateBucket = async () => {
  const data = {
    name: CB_BUCKET,
    ramQuotaMB: 150,
    durabilityMinLevel: 'none',
    replicaNumber: 0,
    replicaIndex: 0,
  };
  await axios({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: auth,
    },
    data: qs.stringify(data),
    url: 'http://127.0.0.1:8091/pools/default/buckets',
  }).catch((error) => {
    if (error.response === undefined) {
      console.error('Error Creating Bucket:', error.code);
      if (error.code === 'ECONNREFUSED') {
        console.info(
          "\tIf you are using a Capella cluster, you'll have to create a `user_profile` bucket manually. See README for details.\n"
        );
      }
    } else if (error.response.data.errors && error.response.data.errors.name) {
      console.error(
        'Error Creating Bucket:',
        error.response.data.errors.name,
        '\n'
      );
    } else if (
      error.response.data.errors &&
      error.response.data.errors.ramQuota
    ) {
      console.error(
        'Error Creating Bucket:',
        error.response.data.errors.ramQuota
      );
      console.log('Try deleting other buckets or increasing cluster size. \n');
    } else if (error.response.data.errors) {
      console.error('Error Creating Bucket: ');
      console.error(error.response.data.errors, '\n');
    } else {
      console.error('Error Creating Bucket:', error.message);
    }
  });
};

const restCreateCollection = async () => {
  const data = { name: 'profile' };
  await axios({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: auth,
    },
    data: qs.stringify(data),
    url: `http://127.0.0.1:8091/pools/default/buckets/${CB_BUCKET}/scopes/_default/collections`,
  }).catch((error) => {
    if (error.response === undefined) {
      console.error('Error Creating Collection:', error.code);
      if (error.code === 'ECONNREFUSED') {
        console.info(
          "\tIf you are using a Capella cluster, you'll have to create a `profile` scope on the `user_profile` bucket manually. See README for details.\n"
        );
      }
    } else if (error.response.status === 404) {
      console.error(
        `Error Creating Collection: bucket \'${CB_BUCKET}\' not found. \n`
      );
    } else {
      console.log(`Collection may already exist: ${error.message} \n`);
    }
  });
};

const initializeBucketAndCollection = async () => {
  await restCreateBucket();
  await delay(DELAY_LENGTH);
  await restCreateCollection();
  await delay(DELAY_LENGTH);
  console.log('## checking indexes ##');
  await delay(DELAY_LENGTH);
  await ensureIndexes();
  await delay(DELAY_LENGTH);
  console.log('## initialize db script end ##');
};

initializeBucketAndCollection()
  .then(() => {
    console.log('Database Initialization Successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('Database Initialization Failed: \n\t' + err);
    process.exit(1);
  });
