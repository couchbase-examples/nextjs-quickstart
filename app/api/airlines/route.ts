import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"
import { Airline } from "@/app/models/AirlineModel"
import { QueryResult } from "couchbase"

/**
 * @swagger
 * /api/airline/list:
 *   get:
 *     description: Get an airline by ID
 *     responses:
 *       200:
 *        description: Returns the airline
 *       400:
 *        description: Failed to fetch airline
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { scope } = await getDatabase()
  // Fetching parameters
  const { country }: Partial<Airline> = await req.json()
  const { limit, offset } = await req.json()

  let query: string
  type QueryOptions = {
    parameters: {
      COUNTRY?: string
      LIMIT: number
      OFFSET: number
    }
  }
  let options: QueryOptions
  if (country !== "") {
    query = `
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          WHERE airline.country = $COUNTRY
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `
    options = {
      parameters: { COUNTRY: country, LIMIT: limit, OFFSET: offset },
    }
  } else {
    query = `
          SELECT airline.callsign,
                 airline.country,
                 airline.iata,
                 airline.icao,
                 airline.name
          FROM airline AS airline
          ORDER BY airline.name
          LIMIT $LIMIT
          OFFSET $OFFSET;
        `

    options = { parameters: { LIMIT: limit, OFFSET: offset } }
  }
  await makeResponse(res, async () => {
    const results: QueryResult = await scope.query(query, options)
    return results["rows"]
  })
}
