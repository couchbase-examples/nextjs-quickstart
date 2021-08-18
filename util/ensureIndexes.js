import {connectToDatabase} from "./couchbase";
export const ensureIndexes = async(COUCHBASE_BUCKET) => {
  console.log("ensureIdx 1");
  let {cluster} = await connectToDatabase();
  console.log("ensureIdx 2");

  try {
    console.log("ensureIdx 3");
    const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
    const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`
    console.log("ensureIdx 3.5");
    await cluster.query(bucketIndex)
    console.log("ensureIdx 4");
    await cluster.query(collectionIndex)
    console.log("ensureIdx 5");
    console.log(`Index Creation: SUCCESS`)
  } catch (err) {
    // console.info(err);
    console.log("ensureIdx 6");
    if (err instanceof couchbase.IndexExistsError) {
      console.log("ensureIdx 7");
      console.info('Index Creation: Indexes Already Exists')
    } else {
      console.log("ensureIdx 8");
      console.log("*****************************");
      console.error(err)
    }
  }
  console.log("ensureIdx 9");
}
