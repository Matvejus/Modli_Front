import { NextRequest, NextResponse } from "next/server";

// Use a consistent URL for your Django backend
const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';

export async function GET(
  request: NextRequest,
) {
  try {
    const cookies = request.headers.get('cookie') || '';    
    const response = await fetch(`${DJANGO_API_URL}/emissions/gowns/`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      credentials: "include",
    });

    const data = await response.json();
    
    const nextResponse = NextResponse.json(data);
    
    // Forward cookies from Django to the client
    if (response.headers.has('set-cookie')) {
      const djangoCookies = response.headers.get('set-cookie');
      if (djangoCookies) {
        console.log("Setting cookies:", djangoCookies); // Debug log
        nextResponse.headers.set('set-cookie', djangoCookies);
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error("Error fetching gowns:", error);
    return NextResponse.json({ error: "Failed to fetch gown" }, { status: 500 });
  }
}