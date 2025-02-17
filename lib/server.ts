import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const secretKey = "XUY"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + 2 * 60 * 60) // 2 hours from now in seconds
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function auth() {
  const currentTime = Date.now()
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  const session = await encrypt({
    sub: "user123",
    iat: Math.floor(currentTime / 1000),
    exp: Math.floor(expires.getTime() / 1000),
  })
  cookies().set("session", session, { expires, httpOnly: true })
  return session
}

export async function getSession() {
  const session = cookies().get("session")?.value
  if (!session) return null
  return session
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.exp = Math.floor((Date.now() + 2 * 60 * 60 * 1000) / 1000) // 2 hours from now
  const res = NextResponse.next()
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: new Date(parsed.exp * 1000),
  })
  return res
}

