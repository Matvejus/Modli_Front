import type { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../lib/server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const token = await auth()
      res.status(200).json({ token })
    } catch (error) {
      console.error("Auth error:", error)
      res.status(500).json({ error: "Failed to create session" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

