import * as couchbase from "couchbase"

const COUCHBASE_USER = process.env.COUCHBASE_USER
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD
const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT
let COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET
let IS_CAPELLA = process.env.IS_CAPELLA

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

if (!COUCHBASE_ENDPOINT) {
  throw new Error(
      'Please define the COUCHBASE_ENDPOINT environment variable inside .env.local'
  )
}

if (!COUCHBASE_BUCKET) {
  throw new Error(
      'Please define the COUCHBASE_BUCKET environment variable inside .env.local'
  )
}

if (!IS_CAPELLA) {
  throw new Error(
      'Please define the IS_CAPELLA environment variable inside dev.env. \nSet to \`true\` if you are connecting to a Capella cluster, and \`false\` otherwise.\n'
  )
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
  if (cached.conn) {
    return cached.conn
  }

  try {
    if (IS_CAPELLA === 'true') {
      // Capella requires TLS connection string but we'll skip certificate verification with `tls_verify=none`
      cached.conn = await couchbase.connect('couchbases://' + COUCHBASE_ENDPOINT + '?tls_verify=none', {
        username: COUCHBASE_USER,
        password: COUCHBASE_PASSWORD,
      })
    } else {
      // no TLS needed, use traditional connection string
      cached.conn = await couchbase.connect('couchbase://' + COUCHBASE_ENDPOINT, {
        username: COUCHBASE_USER,
        password: COUCHBASE_PASSWORD,
      })
    }
  } catch (e) {
      throw new Error(
          'Error Connecting to Couchbase Database. Ensure the correct IPs are allowed and double check your database user credentials.'
      );
  }

  return cached.conn
}

export async function connectToDatabase() {
  const cluster = await createCouchbaseCluster()
  const bucket = cluster.bucket(COUCHBASE_BUCKET);
  const collection = bucket.defaultCollection();
  const profileCollection = bucket.collection('profile');

  let dbConnection = {
    cluster,
    bucket,
    collection,
    profileCollection,
  }

  return dbConnection;
}



