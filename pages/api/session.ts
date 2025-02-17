import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "../../lib/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const token = await getSession()
    if (!token) {
      return res.status(401).json({ error: "No session found" })
    }
    res.status(200).json({ token })
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

