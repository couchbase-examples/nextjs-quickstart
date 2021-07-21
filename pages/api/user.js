import {connectToDatabase} from "../../util/couchbase";
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'

export default async function handler(req, res) {
  const {cluster, bucket, profileCollection} = await connectToDatabase();

  // Parse the body only if it is present
  // TODO: check if we even need to parse the body? Only if its raw? What form do we want it in
  console.log(req.body.firstName);
  console.log("PARSING BODY");
  let body = !!req.body ? JSON.parse(req.body) : null;
  console.log(body);
  if (req.method === 'POST') {
    /**
     *  POST HANDLER
     */
    if (!body.email || !body.pass) {
      return res.status(400).send({
        "message": `${!body.email ? 'email ' : ''}${
            (!body.email && !body.pass)
                ? 'and pass are required' : (body.email && !body.pass)
                ? 'pass is required' : 'is required'
        }`
      })
    }

    const id = v4();
    const profile = {
      pid: id,
      ...body,
      pass: bcrypt.hashSync(body.pass, 10)
    }

    await profileCollection.insert(profile.pid, profile)
        .then((result) => {
          console.log("sent");
          res.send(result);
        })
        .catch((e) => {
          console.log("broke");
          res.status(500).send({
            "message": `Profile Insert Failed: ${e.message}`
          })
        })
  } else if (req.method === 'PUT') {
    /**
     *  PUT HANDLER
     */

    try {
      await profileCollection.get(req.query.pid)
          .then(async (result) => {
            /* Create a New Document with new values,
              if they are not passed from request, use existing values */
            const newDoc = {
              pid: result.content.pid,
              firstName: body.firstName ? body.firstName : result.content.firstName,
              lastName: body.lastName ? body.lastName : result.content.lastName,
              email: body.email ? body.email : result.content.email,
              pass: body.pass ? bcrypt.hashSync(body.pass, 10) : result.content.pass,
            }

            /* Persist updates with new doc */
            await profileCollection.upsert(req.query.pid, newDoc)
                .then((result) => res.send({ ...newDoc, ...result }))
                .catch((e) => res.status(500).send(e))
          })
          .catch((e) => res.status(500).send({
            "message": `Profile Not Found, cannot update: ${e.message}`
          }))
    } catch (e) {
      console.error(e)
    }
  } else if (req.method === 'GET') {
    /**
     *  GET HANDLER
     */
    try {
      const options = {
        parameters: {
          SKIP: Number(req.query.skip || 0),
          LIMIT: Number(req.query.limit || 5),
          SEARCH: req.query.search ? `%${req.query.search.toLowerCase()}%` : null
        }
      }

      const query = `
      SELECT p.*
      FROM ${process.env.TEST_BUCKET_NAME}._default.profile p
      WHERE lower(p.firstName) LIKE $SEARCH OR lower(p.lastName) LIKE $SEARCH
      LIMIT $LIMIT OFFSET $SKIP;
    `
      await cluster.query(query, options)
          .then((result) => res.send(result.rows))
          .catch((error) => res.status(500).send({
            "message": `Query failed: ${error.message}`
          }))
    } catch (e) {
      console.error(e)
    }
  } else if (req.method === 'DELETE') {
    /**
     *  DELETE HANDLER
     */
    try {
      await profileCollection.remove(req.query.pid)
          .then((result) => {
            res.status(200).send("Successfully Deleted: " + req.query.pid)
          })
          .catch((error) => res.status(500).send({
            "message": `Profile Not Found, cannot delete: ${error.message}`
          }))
    } catch (e) {
      console.error(e)
    }
  }

}


// TODO; should we pass the collection? see node.js quickstart example and RENAME the collection var? Maybe do diff than default
async function insertProfile(collection, data) {


}
