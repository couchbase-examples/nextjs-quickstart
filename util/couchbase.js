const couchbase = require('couchbase');

const COUCHBASE_USER = process.env.COUCHBASE_USER
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD
const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT
let TEST_BUCKET_NAME = process.env.TEST_BUCKET_NAME
let IS_CLOUD_INSTANCE = process.env.IS_CLOUD_INSTANCE

if (!COUCHBASE_USER) {
  throw new Error(
    'Please define the COUCHBASE_USER environment variable inside .env.local'
  )
}

if (!COUCHBASE_PASSWORD) {
  throw new Error(
    'Please define the COUCHBASE_PASSWORD environment variable inside .env.local'
  )
}

if (!TEST_BUCKET_NAME) {
  TEST_BUCKET_NAME = 'travel-sample'
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

async function createCouchbaseCluster() {
  // TODO: investigate this on change/requiring restart w/ cached
  if (cached.conn) {
    console.log("CACHED**************************************");
    return cached.conn
  }
  console.log(IS_CLOUD_INSTANCE);
  // TODO: add TLS support
  cached.conn = new couchbase.Cluster('couchbase://'+ COUCHBASE_ENDPOINT + (IS_CLOUD_INSTANCE === 'true' ? '?ssl=no_verify&console_log_level=5' : ''), { // ?ssl=no_verify&console_log_level=5
    username: COUCHBASE_USER,
    password: COUCHBASE_PASSWORD
  });

  return cached.conn
}

export async function connectToDatabase() {
  const cluster = await createCouchbaseCluster()

  // TODO: try moving this 'bucket' and 'collection' into createCouchbaseCluster()
  const bucket = cluster.bucket(TEST_BUCKET_NAME);
  const collection = bucket.defaultCollection();

  // get the key for the first bucket in the connection to determine isConnected status
  let bucketKey = Object.keys(cluster._conns)[0];
  const isConnected = (cluster._conns[`${bucketKey}`] !== undefined &&
      !cluster._conns[`${bucketKey}`]._closed &&
      cluster._conns[`${bucketKey}`]._connected);

  console.log(cluster._conns);
  let dbConnection = {
    isConnected,
    cluster
  }

  console.log(dbConnection);

  return dbConnection;
}
