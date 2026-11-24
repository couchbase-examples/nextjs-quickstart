import { randomUUID } from 'node:crypto';
import { connectToDatabase } from '../../util/couchbase';

/**
 * Parse the request body once. Returns `{}` when no body was sent so method
 * handlers never have to null-check it, or `null` when the body is not valid JSON.
 */
function parseBody(req) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body !== 'string') {
    return req.body;
  }
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

/**
 * Single place that maps a Couchbase SDK error to an HTTP response:
 * authentication failures become 401, everything else 500 with `fallbackMessage`.
 */
function sendDbError(res, error, fallbackMessage) {
  if (error.message === 'authentication failure') {
    return res.status(401).json({ message: error.message });
  }
  return res.status(500).json({ message: fallbackMessage });
}

async function createProfile({ res, body, profileCollection }) {
  if (!body.email) {
    return res.status(400).json({ message: 'email is required' });
  }

  const profile = { pid: randomUUID(), ...body };
  try {
    const result = await profileCollection.insert(profile.pid, profile);
    return res.status(201).json({ ...profile, ...result });
  } catch (error) {
    return sendDbError(res, error, `Profile Insert Failed: ${error.message}`);
  }
}

async function updateProfile({ req, res, body, profileCollection }) {
  let existing;
  try {
    existing = (await profileCollection.get(req.query.pid)).content;
  } catch (error) {
    return res.status(500).json({
      message: `Profile Not Found, cannot update: ${error.message}`,
    });
  }

  /* Create a New Document with new values,
    if they are not passed from request, use existing values */
  const newDoc = {
    pid: existing.pid,
    firstName: body.firstName ? body.firstName : existing.firstName,
    lastName: body.lastName ? body.lastName : existing.lastName,
    email: body.email ? body.email : existing.email,
  };

  try {
    const result = await profileCollection.upsert(req.query.pid, newDoc);
    return res.json({ ...newDoc, ...result });
  } catch (error) {
    return sendDbError(res, error, error.message);
  }
}

async function listProfiles({ req, res, cluster }) {
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
  const query =
    options.parameters.SEARCH == null
      ? `
        SELECT p.*
        FROM \`${process.env.CB_BUCKET}\`._default.profile p
        LIMIT $LIMIT OFFSET $SKIP;
        `
      : `
        SELECT p.*
        FROM \`${process.env.CB_BUCKET}\`._default.profile p
        WHERE lower(p.firstName) LIKE $SEARCH OR lower(p.lastName) LIKE $SEARCH
        LIMIT $LIMIT OFFSET $SKIP;
      `;
  try {
    const result = await cluster.query(query, options);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: `Query failed: ${error.message}` });
  }
}

async function deleteProfile({ req, res, profileCollection }) {
  try {
    await profileCollection.remove(req.query.pid);
    return res
      .status(200)
      .json({ message: `Successfully Deleted: ${req.query.pid}` });
  } catch (error) {
    return sendDbError(
      res,
      error,
      `Profile Not Found, cannot delete: ${error.message}`
    );
  }
}

/** The route's interface: one entry per supported HTTP method. */
const methodHandlers = {
  GET: listProfiles,
  POST: createProfile,
  PUT: updateProfile,
  DELETE: deleteProfile,
};

async function handler(req, res) {
  const methodHandler = methodHandlers[req.method];
  if (!methodHandler) {
    res.setHeader('Allow', Object.keys(methodHandlers).join(', '));
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  const body = parseBody(req);
  if (body === null) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  const { cluster, profileCollection } = await connectToDatabase();
  return methodHandler({ req, res, body, cluster, profileCollection });
}

export default handler;
