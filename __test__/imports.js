import request from 'supertest'
import { describe, test, expect } from '@jest/globals'

import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
import handler from "../pages/api/user";

import { connectToDatabase } from '../util/couchbase'

module.exports = {
  request, describe, test, expect, //supertest
  bcrypt, v4,                      // utilities
  connectToDatabase,      // couchbase
  handler
}
