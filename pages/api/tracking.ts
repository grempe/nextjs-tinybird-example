import type { NextApiRequest, NextApiResponse } from "next"

// 'api.tinybird.co' is the Tinybird API endpoint for the EU
// 'api.us-east.tinybird.co' for US
const HOST = process.env.TINYBIRD_TRACKER_HOST ?? "api.tinybird.co"

const DATASOURCE = process.env.TINYBIRD_TRACKER_DATASOURCE ?? "analytics_events"

const TOKEN = process.env.TINYBIRD_TRACKER_TOKEN

interface TrackerEvent {
  timestamp: string
  action: string
  version: string
  session_id: string
  payload: any
}

/**
 * User-defined type guard to check if an object implements an interface in TypeScript.
 * @param {Object} obj - The object to check.
 * @param {string} obj.timestamp - The timestamp of the event.
 * @param {string} obj.action - The action of the event.
 * @param {string} obj.version - The version of the event.
 * @param {string} obj.session_id - The session_id of the event.
 * @param {string} obj.payload - The payload of the event.
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @see https://bobbyhadz.com/blog/typescript-check-if-object-implements-interface
 */
function isTrackerEvent(obj: any): obj is TrackerEvent {
  return (
    "timestamp" in obj &&
    "action" in obj &&
    "version" in obj &&
    "session_id" in obj &&
    "payload" in obj
  )
}

/**
 * Post event to Tinybird HFI
 *
 * @param {Object} event - The TrackerEvent object to send.
 * @param {string} event.timestamp - The timestamp of the event.
 * @param {string} event.action - The action of the event.
 * @param {string} event.version - The version of the event.
 * @param {string} event.session_id - The session_id of the event.
 * @param {string} event.payload - The payload of the event.
 *
 * @return { string } Tinybird HFI response
 */
async function postEvent(event: TrackerEvent) {
  const options = {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  }

  const response = await fetch(
    `https://${HOST}/v0/events?name=${DATASOURCE}`,
    options
  )

  if (!response.ok) {
    throw response.statusText
  }

  return response.json()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (!TOKEN) {
    return res.status(400).send("Missing Tinybird tracker token")
  }

  if (req.method !== "POST") {
    return res.status(400).send("Only POST requests are allowed")
  }

  const { body } = req

  if (!body) {
    return res.status(400).json("Missing body")
  }

  // Check if the body implements the TrackerEvent interface
  // After this check, TypeScript will know that body is a TrackerEvent
  if (!isTrackerEvent(body)) {
    return res.status(400).json("Invalid body")
  }

  // Don't send any unknown keys in the body object to Tinybird
  // See: https://www.delftstack.com/howto/typescript/typescript-create-object-from-interface/
  const safeEvent: TrackerEvent = {} as TrackerEvent
  safeEvent.timestamp = body.timestamp
  safeEvent.action = body.action
  safeEvent.version = body.version
  safeEvent.session_id = body.session_id
  safeEvent.payload = body.payload

  await postEvent(safeEvent)
  return res.status(200).send("ok")
}
