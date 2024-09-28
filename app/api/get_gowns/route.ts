import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch the gown data from the external API
    const res = await fetch('http://localhost:8000/gowns/');
    
    // Check if the response is ok
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const gowns = await res.json();

    // Transform the data if needed (e.g., adding currency formatting, or any other transformation)
    const transformedGowns = gowns.map((gown: any) => ({
      ...gown,
      cost: `$${gown.cost.toFixed(2)}`, // Format cost with a dollar sign and two decimal places
      reusableText: gown.reusable ? 'Yes' : 'No', // Human-readable reusable text
    }));

    // Return the transformed data as a JSON response
    return NextResponse.json(transformedGowns);

  } catch (error) {
    // Handle any errors during the fetch
    return NextResponse.json({ error: 'Failed to fetch gowns' }, { status: 500 });
  }
}
