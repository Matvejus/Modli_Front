import { NextRequest, NextResponse } from "next/server";

// Use a consistent URL for your Django backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookies = request.headers.get('cookie') || '';
    const id = params.id;
    
    console.log("Forwarding cookies:", cookies); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/emissions/gowns/${id}/`, {
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
    console.error("Error fetching gown:", error);
    return NextResponse.json({ error: "Failed to fetch gown" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const cookies = request.headers.get('cookie') || '';
    const id = params.id;
    
    console.log("Forwarding cookies on POST:", cookies); // Debug log

    const response = await fetch(`${API_BASE_URL}/emissions/gowns/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookies,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    // Handle potential error responses
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Django error response:", errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    
    const nextResponse = NextResponse.json(data);
    
    // Forward cookies from Django to the client
    if (response.headers.has('set-cookie')) {
      const djangoCookies = response.headers.get('set-cookie');
      if (djangoCookies) {
        console.log("Setting cookies on POST response:", djangoCookies); // Debug log
        nextResponse.headers.set('set-cookie', djangoCookies);
      }
    }
    
    return nextResponse;
  } catch (error) {
    console.error("Error updating gown:", error);
    return NextResponse.json({ error: "Failed to update gown" }, { status: 500 });
  }
}