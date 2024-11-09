import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const optimizationData = await req.json()

    const djangoRes = await fetch('http://159.65.192.81/emissions/api/opt/', {
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