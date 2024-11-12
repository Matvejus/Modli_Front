import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const optimizationData = await req.json()
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
    const djangoRes = await fetch(`${API_BASE_URL}/emissions/api/opt/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optimizationData),
    })

    const data = await djangoRes.json()

    if (!djangoRes.ok) {
      console.error('Django API error:', data)
      return NextResponse.json({ error: `Django API error: ${JSON.stringify(data)}` }, { status: djangoRes.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error in optimization API:', error)
    return NextResponse.json({ error: `Failed to start optimization: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 })
  }
}