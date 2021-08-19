import {connectToDatabase} from "./couchbase";
export const ensureIndexes = async(COUCHBASE_BUCKET) => {
  let {cluster} = await connectToDatabase();
  try {
    const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
    const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`
    console.log("before bucketIndex creation");
    await cluster.query(bucketIndex)
    console.log("after bucketIndex creation");
    await cluster.query(collectionIndex)
    console.log(`Index Creation: SUCCESS`)
  } catch (err) {
    // console.info(err);

    if (err instanceof couchbase.IndexExistsError) {

      console.info('Index Creation: Indexes Already Exists')
    } else {

      console.log("*****************************");
      console.error(err)
    }
  } finally {
    console.log('FINALLY!');
  }

}
