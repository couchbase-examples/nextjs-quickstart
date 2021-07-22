import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  handler                              // REST application
} from './imports'

import { delay } from '../util/delay'
import { NextApiRequest, NextApiResponse } from "next"
import { apiResolver } from "next-server/dist/server/api-utils"
import http from "http"
import listen from "test-listen"

const profile1 = {
  pid: v4(), firstName: "Joe", lastName: "Schmoe",
  email: "joe.schmoe@couchbase.com", pass: bcrypt.hashSync('mypassword1', 10)
}
const profile2 = {
  pid: v4(), firstName: "John", lastName: "Dear",
  email: "john.dear@couchbase.com", pass: bcrypt.hashSync('mypassword2', 10)
}


beforeAll(async () => {
  const {cluster, bucket, profileCollection} = await connectToDatabase();
  await profileCollection.insert(profile1.pid, profile1)
      .then(() => {/* console.log('test profile document inserted', profile) */})
      .catch((e) => console.log(`test profile insert failed: ${e.message}`))
  await profileCollection.insert(profile2.pid, profile2)
      .then(() => {/* console.log('test profile document inserted', profile) */})
      .catch((e) => console.log(`test profile insert failed: ${e.message}`))
})


describe("GET /user", () => {
  test("responds 200 to GET all", async () => {
    let requestHandler = (req, res) => {
      return apiResolver(req, res, undefined, handler)
    }
    let server = http.createServer(requestHandler)
    let url = await listen(server)
    let response = await fetch(url)
    let jsonResponse = await response.json();
    expect(jsonResponse).toHaveLength(2);
    expect(response.status).toBe(200)
    return server.close()
  })
  test("responds 200 to GET with search string", async () => {
    let requestHandler = (req, res) => {
      return apiResolver(req, res, {'search': 'jo'}, handler)
    }
    let server = http.createServer(requestHandler)
    let url = await listen(server)
    let response = await fetch(url)
    let jsonResponse = await response.json()
    expect(jsonResponse).toHaveLength(2)
    expect(response.status).toBe(200)
    return server.close()
  })
});


afterAll(async () => {
  const {cluster, bucket, profileCollection} = await connectToDatabase();
  await profileCollection.remove(profile1.pid)
    .then(() => { /*console.log('test profile document deleted', id)*/ })
    .catch((e) => console.log(`test profile remove failed: ${e.message}`))
  await profileCollection.remove(profile2.pid)
    .then(() => { /*console.log('test profile document deleted', id)*/ })
    .catch((e) => console.log(`test profile remove failed: ${e.message}`))
  cluster.close()
})


