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


describe("PUT /user?pid={id}", () => {
  describe("given the profile object is updated", () => {
    const id = v4()
    const initialProfile = {
      pid: id, firstName: "Joseph", lastName: "Developer",
      email: "joseph.developer@couchbase.com", pass: bcrypt.hashSync('mypassword', 10)
    }
    const updatedProfile = {
      firstName: "Joe", lastName: "dev",
      email: "joe@dev.com", pass: "p455w3rd"
    }

    beforeEach(async () => {
      const {cluster, bucket, profileCollection} = await connectToDatabase();
      await profileCollection.insert(id, initialProfile)
          .then(() => {/*console.log('test item inserted', profile)*/ })
          .catch((e) => console.log(`Test Profile Insert Failed: ${e.message}`))
    })

    test("should respond with status code 200 OK and updated values of document returned", async () => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, {'pid': id}, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(updatedProfile)
      })
      let jsonResponse = await response.json()
      expect(response.status).toBe(200)
      expect(jsonResponse.firstName).toBe(updatedProfile.firstName)
      expect(jsonResponse.lastName).toBe(updatedProfile.lastName)
      expect(jsonResponse.email).toBe(updatedProfile.email)
      expect(jsonResponse.pass).not.toBe(updatedProfile.pass)
      return server.close()
    })

    afterEach(async() => {
      const {cluster, bucket, profileCollection} = await connectToDatabase();
      await profileCollection.remove(id)
          .then(() => {/*console.log('test profile document deleted', id)*/ })
          .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })
  })
});


afterAll(async () => {
  const {cluster, bucket, profileCollection} = await connectToDatabase();
  cluster.close()
})


