import {connectToDatabase} from "./couchbase";
const couchbase = require("couchbase")

export const ensureIndexes = async(COUCHBASE_BUCKET) => {
  let {cluster} = await connectToDatabase();
  try {
    const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
    const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`
    await cluster.query(bucketIndex)
    await cluster.query(collectionIndex)
    console.log(`Index Creation: SUCCESS`)
  } catch (err) {
    if (err instanceof couchbase.IndexExistsError) {
      console.info('Index Creation: Indexes Already Exists')
    } else {
      console.error(err)
    }
  }
}
