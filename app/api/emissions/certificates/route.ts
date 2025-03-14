import { NextRequest, NextResponse } from "next/server";

// Use process.env here, not client-side env variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${API_BASE_URL}/emissions/certificates/`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      credentials: "include",
    });

    const data = await response.json();
    
    const nextResponse = NextResponse.json(data);
    
    if (response.headers.has('set-cookie')) {
      const djangoCookies = response.headers.get('set-cookie');
      if (djangoCookies) {
        nextResponse.headers.set('set-cookie', djangoCookies);
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}