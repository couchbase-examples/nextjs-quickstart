
import { NextRequest, NextResponse } from "next/server"

import { getDatabase } from "@/lib/couchbase-connection"

/**
 * @swagger
 * /api/airline/{id}:
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
  const { id } = params
  // Fetch the airline from your data source
  // This is just a placeholder and should be replaced with your actual data fetching logic
  const { airlineCollection } = await getDatabase()

  const airline = await airlineCollection.get(id)
  if (airline) {
    return NextResponse.json(airline.content, { status: 200 })
  } else {
    return NextResponse.json(
      { message: "Failed to fetch airline" },
      { status: 400 }
    )
  }
}

/**
 * @swagger
 * /api/airline/{id}:
 *   post:
 *     description: Create an airline
 *     responses:
 *       201:
 *         description: Returns the created airline
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const airline = req.body
  // Create the airline in your data source
  // This is just a placeholder and should be replaced with your actual data creation logic
  const { airlineCollection } = await getDatabase()
  const createdAirline = await airlineCollection.insert(id, airline)
  if (createdAirline) {
    return NextResponse.json(createdAirline, { status: 201 })
  } else {
    return NextResponse.json(
      { message: "Failed to create airline" },
      { status: 400 }
    )
  }
}
/**
 * @swagger
 * /api/airline/{id}:
 *   put:
 *     description: Update an airline
 *     responses:
 *       200:
 *         description: Returns the updated airline
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const airline = req.body
  // Update the airline in your data source
  // This is just a placeholder and should be replaced with your actual data updating logic
  const { airlineCollection } = await getDatabase()
  const updatedAirline = await airlineCollection.replace(id, airline)
  if (updatedAirline) {
    return NextResponse.json(updatedAirline, { status: 200 })
  } else {
    return NextResponse.json(
      { message: "Failed to update airline" },
      { status: 400 }
    )
  }
}

/**
 * @swagger
 * /api/airline/{id}:
 *   delete:
 *     description: Delete an airline
 *     responses:
 *       204:
 *         description: Successfully deleted the airline
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  // Delete the airline from your data source
  // This is just a placeholder and should be replaced with your actual data deletion logic
  const { airlineCollection } = await getDatabase()
  const deletedAirline = await airlineCollection.remove(id)
  if (deletedAirline) {
    return NextResponse.json(deletedAirline, { status: 204 })
  } else {
    return NextResponse.json(
      { message: "Failed to delete airline" },
      { status: 400 }
    )
  }
}
