import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory counter (resets on deployment)
// For production, use a database like Redis or Vercel KV
let totalUsageCount = 0;
const MAX_REQUESTS = 50; // Adjust based on your $5 budget and Modal pricing

export async function GET() {
  return NextResponse.json({
    used: totalUsageCount,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - totalUsageCount),
  });
}

export async function POST(request: NextRequest) {
  if (totalUsageCount >= MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: 'Usage limit reached',
        message: 'The free tier has reached its limit. Please contact support for more credits.'
      },
      { status: 429 }
    );
  }

  totalUsageCount++;

  return NextResponse.json({
    success: true,
    remaining: MAX_REQUESTS - totalUsageCount,
  });
}
