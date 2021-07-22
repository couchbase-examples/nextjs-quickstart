import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
// import { app } from '../src/app'
import handler from "../pages/api/user";
// TODO: import handler instead of app , then await handler(req, res)

import { connectToDatabase } from '../util/couchbase'

module.exports = {
  request, describe, test, expect, //supertes
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  // app                              // REST application
  handler
}
