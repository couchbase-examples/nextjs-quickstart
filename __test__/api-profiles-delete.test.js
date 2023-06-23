import {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  handler                              // REST application
} from './imports'

import { delay } from '../util/delay'
import { NextApiRequest, NextApiResponse } from "next"
import http from "http"
import listen from "test-listen"


describe("DELETE /user?pid={id}", () => {
  describe("given we pass a pid as request param", () => {
    const id = v4()

    beforeEach(async () => {
      const {cluster, bucket, profileCollection} = await connectToDatabase();
      const profile = {
        pid: id, firstName: "Joseph", lastName: "Developer",
        email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
      }
      await profileCollection.insert(id, profile)
          .then(() => {/*console.log('test item inserted', profile)*/ })
          .catch((e) => console.log(`Test Profile Insert Failed: ${e.message}`))
    })

    test("should respond with status code 200 to DELETE", async () => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, {'pid': id}, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'DELETE'
      })
      expect(response.status).toBe(200)
      return server.close()
    })
  })
});


afterAll(async () => {
  const {cluster, bucket, profileCollection} = await connectToDatabase();
  cluster.close()
})


