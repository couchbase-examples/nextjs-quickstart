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


describe("POST /user", () => {
  const profile = {
    firstName: 'Joe', lastName: 'dev',
    email: 'joe@dev.com', pass: 'p455w3rd'
  }
  let pid;

  describe("given a request with user & pass", () => {
    test('should respond with statusCode 200 and return document persisted', async () => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, undefined, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(profile)
      })
      let jsonResponse = await response.json()
      pid = jsonResponse.pid
      expect(response.status).toBe(200)
      await bcrypt.compare(profile.pass, jsonResponse.pass, function (err, result) {
        expect(result).toBe(true)
      })
      expect(pid.length).toBe(36)
      expect(jsonResponse).toMatchObject({
        firstName: profile.firstName, lastName: profile.lastName, email: profile.email
      })
      return server.close()
    })

    afterEach(async() => {
      const {cluster, bucket, profileCollection} = await connectToDatabase();
      await profileCollection.remove(pid)
          .then(() => {/*console.log('test profile document deleted', id)*/ })
          .catch((e) => console.log(`test profile remove failed: ${e.message}`))
    })
  })

  describe('given a request is missing email & pass', () => {
    const expected = { statusCode: 400, message: 'email and pass are required' }
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async() => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, undefined, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName
        })
      })
      let jsonResponse = await response.json()
      expect(response.status).toBe(expected.statusCode)
      expect(jsonResponse.message).toBe(expected.message)
      return server.close()
    })
  })

  describe('given a request is missing email', () => {
    const expected = { statusCode: 400, message: 'email is required' }
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async() => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, undefined, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          pass: profile.pass
        })
      })
      let jsonResponse = await response.json()
      expect(response.status).toBe(expected.statusCode)
      expect(jsonResponse.message).toBe(expected.message)
      return server.close()
    })
  })

  describe('given a request is missing pass', () => {
    const expected = { statusCode: 400, message: 'pass is required' }
    test(`should respond with statusCode 400 and message: '${expected.message}'`, async() => {
      let requestHandler = (req, res) => {
        return apiResolver(req, res, undefined, handler)
      }
      let server = http.createServer(requestHandler)
      let url = await listen(server)
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email
        })
      })
      let jsonResponse = await response.json()
      expect(response.status).toBe(expected.statusCode)
      expect(jsonResponse.message).toBe(expected.message)
      return server.close()
    })
  })
});


afterAll(async () => {
  const {cluster, bucket, profileCollection} = await connectToDatabase();
  cluster.close()
})
