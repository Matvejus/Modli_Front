// app/api/emissions/selected-gowns-emissions/route.ts
import { NextRequest, NextResponse } from "next/server";

// Use a consistent URL for your Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export async function GET(
  request: NextRequest,
) {
  try {
    // Get the cookies from the incoming request
    const cookies = request.headers.get('cookie') || '';
    console.log("Forwarding cookies to Django:", cookies); // Debug log
    
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids') || '';
    
    // Forward the request to Django with cookies
    const response = await fetch(`${API_BASE_URL}/emissions/api/selected-gowns-emissions/?ids=${ids}`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      console.error("Django API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Django API returned status ${response.status}` }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log("Django API response data:", data); // Debug log
    
    const nextResponse = NextResponse.json(data);
    
    // Forward cookies from Django to the client
    if (response.headers.has('set-cookie')) {
      const djangoCookies = response.headers.get('set-cookie');
      if (djangoCookies) {
        console.log("Setting cookies from Django:", djangoCookies); // Debug log
        nextResponse.headers.set('set-cookie', djangoCookies);
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error("Error fetching selected gowns emissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch selected gowns emissions" }, 
      { status: 500 }
    );
  }
}