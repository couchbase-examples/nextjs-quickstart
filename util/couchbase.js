const couchbase = require('couchbase');

const COUCHBASE_USER = process.env.COUCHBASE_USER
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD

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

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  cached.conn = new couchbase.Cluster('couchbase://localhost', {
    username: COUCHBASE_USER,
    password: COUCHBASE_PASSWORD
  });

  return cached.conn
}
