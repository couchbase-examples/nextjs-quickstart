import qs from 'qs'
import axios from 'axios'

import { delay } from './delay.js'

var username = process.env.COUCHBASE_USER
var password = process.env.COUCHBASE_PASSWORD
console.log(process.env.COUCHBASE_USER);
console.log(process.env.COUCHBASE_PASSWORD);
var auth = `Basic ${Buffer.from(username + ':' + password).toString('base64')}`

// // TODO: integrate endpoint?
// const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT
let TEST_BUCKET_NAME = process.env.TEST_BUCKET_NAME
// let IS_CLOUD_INSTANCE = process.env.IS_CLOUD_INSTANCE

const restCreateBucket = async() => {
  // TODO: fix these bucket names
  const data = { name: TEST_BUCKET_NAME, ramQuotaMB: 150 }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data:
        qs.stringify(data),
    url: 'http://127.0.0.1:8091/pools/default/buckets',
  })
      .catch(error => console.log(`Bucket may already exist: ${error.message}`))
}

const restCreateCollection = async() => {
  const data = { name: 'profile' }
  await axios({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': auth },
    data: qs.stringify(data),
    url: `http://127.0.0.1:8091/pools/default/buckets/${TEST_BUCKET_NAME}/collections/_default`,
  })
      .catch(error => console.log(`Collection may already exist: ${error.message}`))
}

const initializeBucketAndCollection = async() => {
  await restCreateBucket()
  await delay(process.env.DELAY)
  await restCreateCollection()
  await delay(process.env.DELAY)
  console.log("## initiaize db script end ##")
}

initializeBucketAndCollection()

// module.exports = {
//   restCreateBucket,
//   restCreateCollection,
//   delay
// }
