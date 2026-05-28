import { randomUUID } from 'node:crypto';
import { connectToDatabase } from '../../util/couchbase';

async function handler(req, res) {
  const { cluster, profileCollection } = await connectToDatabase();

  let body = null;
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({
          message: 'Invalid JSON body',
        });
      }
    } else {
      body = req.body;
    }
  }

  if (req.method === 'POST') {
    /**
     *  POST HANDLER
     */
    if (!body.email) {
      return res.status(400).json({
        message: 'email is required',
      });
    }

    const id = randomUUID();
    const profile = {
      pid: id,
      ...body,
    };
    await profileCollection.insert(profile.pid, profile)
        .then((result) => {
          res.status(201).json({ ...profile, ...result });
        })
        .catch((error) => {
          if (error.message === 'authentication failure') {
            return res.status(401).json({
              message: error.message,
            });
          }

          res.status(500).json({
            message: `Profile Insert Failed: ${error.message}`,
          });
        });
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
            };

            /* Persist updates with new doc */
            await profileCollection.upsert(req.query.pid, newDoc)
                .then((result) => res.json({ ...newDoc, ...result }))
                .catch((error) => {
                  if (error.message === 'authentication failure') {
                    return res.status(401).json({
                      message: error.message,
                    });
                  }

                  res.status(500).json({
                    message: error.message,
                  });
                });
          })
          .catch((e) => res.status(500).json({
            message: `Profile Not Found, cannot update: ${e.message}`,
          }));
    } catch (e) {
      console.error(e);
    }
  } else if (req.method === 'GET') {
    /**
     *  GET HANDLER
     */
    try {
      const scanConsistency =
        process.env.COUCHBASE_SCAN_CONSISTENCY ||
        (process.env.NODE_ENV === 'test' ? 'request_plus' : undefined);
      const options = {
        ...(scanConsistency ? { scanConsistency } : {}),
        parameters: {
          SKIP: Number(req.query.skip || 0),
          LIMIT: Number(req.query.limit || 25),
          SEARCH: req.query.search ? `%${req.query.search.toLowerCase()}%` : null,
        },
      };
      const query = options.parameters.SEARCH == null ? `
        SELECT p.*
        FROM \`${process.env.CB_BUCKET}\`._default.profile p
        LIMIT $LIMIT OFFSET $SKIP;
        ` : `
        SELECT p.*
        FROM \`${process.env.CB_BUCKET}\`._default.profile p
        WHERE lower(p.firstName) LIKE $SEARCH OR lower(p.lastName) LIKE $SEARCH
        LIMIT $LIMIT OFFSET $SKIP;
      `;
      await cluster.query(query, options)
          .then((result) => res.json(result.rows))
          .catch((error) => res.status(500).json({
            message: `Query failed: ${error.message}`,
          }));
    } catch (e) {
      console.error(e);
    }
  } else if (req.method === 'DELETE') {
    /**
     *  DELETE HANDLER
     */
    try {
      await profileCollection.remove(req.query.pid)
          .then(() => {
            res.status(200).json({ message: `Successfully Deleted: ${req.query.pid}` });
          })
          .catch((error) => {
            if (error.message === 'authentication failure') {
              return res.status(401).json({
                message: error.message,
              });
            }

            res.status(500).json({
              message: `Profile Not Found, cannot delete: ${error.message}`,
            });
          });
    } catch (e) {
      console.error(e);
    }
  }

}

export default handler;

