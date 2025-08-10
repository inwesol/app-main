import { NextRequest, NextResponse } from 'next/server';
import { db, feedback } from '@/lib/db';

export async function GET() {
  return NextResponse.json({
    message: 'Feedback API endpoint. Submit feedback via POST to this URL.',
    method: 'POST',
    requiredFields: ['userId', 'feeling', 'rating'],
    optionalFields: ['takeaway', 'wouldRecommend', 'suggestions', 'sessionId'],
  });
}

export async function POST(request: NextRequest) {
  console.log('🚀 Feedback API route called');
  
  try {
    const body = await request.json();
    console.log('📥 Received feedback data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.feeling || !body.rating) {
      console.log('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Feeling and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      console.log('❌ Validation failed: Invalid rating range');
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate sessionId (zero-based integer)
    let sessionIdInt: number | null = null;
    if (body.sessionNumber !== undefined && body.sessionNumber !== null) {
      // Backward compat: allow sessionNumber and convert to zero-based session_id
      const n = Number(body.sessionNumber);
      if (!Number.isFinite(n) || n < 1) {
        return NextResponse.json(
          { error: 'sessionNumber must be a positive integer' },
          { status: 400 }
        );
      }
      sessionIdInt = n - 1; // convert to zero-based
    }
    if (body.sessionId !== undefined && body.sessionId !== null) {
      const n = Number(body.sessionId);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json(
          { error: 'session_id must be a non-negative integer' },
          { status: 400 }
        );
      }
      sessionIdInt = n;
    }

    console.log('✅ Validation passed, preparing to insert into database...');

    const feedbackData = {
      userId: String(body.userId),
      feeling: String(body.feeling),
      takeaway: body.takeaway ? String(body.takeaway) : null,
      rating: Number(body.rating),
      wouldRecommend: Boolean(body.wouldRecommend),
      suggestions: body.suggestions ? String(body.suggestions) : null,
      sessionId: sessionIdInt,
      userAgent: request.headers.get('user-agent') || null,
      createdAt: new Date(),
    } as const;

    console.log('📊 Data to be inserted:', JSON.stringify(feedbackData, null, 2));

    // Add retry logic for database operations
    let retries = 3;
    let result;
    
    while (retries > 0) {
      try {
        result = await db.insert(feedback).values(feedbackData).returning();
        break; // Success, break out of retry loop
      } catch (dbError: any) {
        retries--;
        console.log(`❌ Database error (${retries} retries left):`, dbError.message);
        
        if (retries === 0) {
          throw dbError; // Re-throw after all retries failed
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('✅ Feedback successfully saved to database!');
    console.log('📝 Inserted record:', JSON.stringify(result![0], null, 2));
    console.log('🆔 Generated ID:', result![0].id);

    return NextResponse.json(
      { 
        message: 'Feedback submitted successfully',
        id: result![0].id
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error submitting feedback:', error);
    
    // Handle specific error types
    if (error.message?.includes('timeout') || error.message?.includes('session')) {
      return NextResponse.json(
        { error: 'Database connection timeout. Please try again.' },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 }
    );
  }
}
