import {connectToDatabase} from "./couchbase";
const ensureIndexes = async() => {
  let {cluster} = connectToDatabase();
  try {
    const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
    const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`
    await cluster.query(bucketIndex)
    await cluster.query(collectionIndex)
    console.log(`Index Creation: SUCCESS`)
  } catch (err) {
    console.info(err);
    // if (err instanceof couchbase.IndexExistsError) {
    //   console.info('Index Creation: Indexes Already Exists')
    // } else {
    //   console.log("insure index error, but prob ok");
    //   // console.error(err)
    // }
  }
}
