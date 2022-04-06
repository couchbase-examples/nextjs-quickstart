import {connectToDatabase} from "./couchbase";
const couchbase = require("couchbase")

export const ensureIndexes = async() => {
  let { cluster } = await connectToDatabase();
  const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET

  const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
  const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`

  try {
    await cluster.query(bucketIndex)
    console.log(`Bucket Index Creation: SUCCESS`)
  } catch (err) {
    if (err instanceof couchbase.IndexExistsError) {
      console.info('Bucket Index Creation: Index Already Exists')
    } else {
      console.error(err)
    }
  }

  try {
    await cluster.query(collectionIndex)
    console.log(`Collection Index Creation: SUCCESS`)
  } catch (err) {
    if (err instanceof couchbase.IndexExistsError) {
      console.info('Collection Index Creation: Index Already Exists')
    } else {
      console.error(err)
    }
  }
}
