import { NextRequest, NextResponse } from 'next/server';
import { upsertCareerStory1, getCareerStory1 } from '@/lib/db/queries'; // Import your existing functions

export async function POST(request: NextRequest) {
  console.log('🚀 Career Story 1 API route called');
  
  try {
    const body = await request.json();
    console.log('📥 Received career story 1 data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.userId || !body.your_current_transition || !body.career_asp || !body.heroes) {
      console.log('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'User ID, current transition, career aspirations, and heroes are required' },
        { status: 400 }
      );
    }

    // Validate heroes array
    if (!Array.isArray(body.heroes) || body.heroes.length === 0 || body.heroes.length > 3) {
      console.log('❌ Validation failed: Heroes must be an array with 1-3 entries');
      return NextResponse.json(
        { error: 'Heroes must be an array with 1 to 3 entries' },
        { status: 400 }
      );
    }

    // Validate each hero has required fields
    for (let i = 0; i < body.heroes.length; i++) {
      const hero = body.heroes[i];
      if (!hero.name || typeof hero.name !== 'string' || hero.name.trim() === '') {
        console.log(`❌ Validation failed: Hero ${i + 1} missing name`);
        return NextResponse.json(
          { error: `Hero ${i + 1} must have a name` },
          { status: 400 }
        );
      }
      
      // Validate hero name length
      if (hero.name.length > 500) {
        console.log(`❌ Validation failed: Hero ${i + 1} name too long`);
        return NextResponse.json(
          { error: `Hero ${i + 1} name must be 500 characters or less` },
          { status: 400 }
        );
      }
    }

    // Validate field lengths (matching your schema's 4000 char limit)
    const maxLength = 4000;
    if (body.your_current_transition.length > maxLength || 
        body.career_asp.length > maxLength) {
      console.log('❌ Validation failed: Field too long');
      return NextResponse.json(
        { error: `Transition and career aspiration fields must be ${maxLength} characters or less` },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, preparing to upsert into database...');

    const answers = {
      your_current_transition: body.your_current_transition,
      career_asp: body.career_asp,
      heroes: body.heroes.map((hero: any) => ({
        name: hero.name.trim(),
        description: (hero.description || '').trim(),
      })),
    };

    console.log('📊 Data to be upserted:', JSON.stringify(answers, null, 2));

    // Add retry logic for database operations
    let retries = 3;
    
    while (retries > 0) {
      try {
        await upsertCareerStory1(body.userId, answers);
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

    console.log('✅ Career story 1 successfully saved to database!');

    return NextResponse.json(
      { 
        message: 'Career story 1 submitted successfully',
        userId: body.userId
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ Error submitting career story 1:', error);
    
    // Handle specific error types
    if (error.message?.includes('timeout') || error.message?.includes('session')) {
      return NextResponse.json(
        { error: 'Database connection timeout. Please try again.' },
        { status: 503 } // Service Unavailable
      );
    }
    
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'User already has a career story. Use PUT to update.' },
        { status: 409 } // Conflict
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit career story. Please try again.' },
      { status: 500 }
    );
  }
}

// GET method to retrieve career story 1 for a user
export async function GET(request: NextRequest) {
  console.log('🚀 Get Career Story 1 API route called');
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('📥 Fetching career story 1 for userId:', userId);

    const story = await getCareerStory1(userId);

    if (!story) {
      return NextResponse.json(
        { message: 'No career story found for this user' },
        { status: 404 }
      );
    }

    console.log('✅ Career story 1 retrieved successfully');

    return NextResponse.json(
      { 
        story,
        userId
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error fetching career story 1:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch career story. Please try again.' },
      { status: 500 }
    );
  }
}

// PUT method to update existing career story 1
export async function PUT(request: NextRequest) {
  console.log('🚀 Update Career Story 1 API route called');
  
  try {
    const body = await request.json();
    console.log('📥 Received career story 1 update data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.userId || !body.your_current_transition || !body.career_asp || !body.heroes) {
      console.log('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'User ID, current transition, career aspirations, and heroes are required' },
        { status: 400 }
      );
    }

    // Validate heroes array
    if (!Array.isArray(body.heroes) || body.heroes.length === 0 || body.heroes.length > 3) {
      console.log('❌ Validation failed: Heroes must be an array with 1-3 entries');
      return NextResponse.json(
        { error: 'Heroes must be an array with 1 to 3 entries' },
        { status: 400 }
      );
    }

    // Validate each hero has required fields
    for (let i = 0; i < body.heroes.length; i++) {
      const hero = body.heroes[i];
      if (!hero.name || typeof hero.name !== 'string' || hero.name.trim() === '') {
        console.log(`❌ Validation failed: Hero ${i + 1} missing name`);
        return NextResponse.json(
          { error: `Hero ${i + 1} must have a name` },
          { status: 400 }
        );
      }
      
      // Validate hero name length
      if (hero.name.length > 500) {
        console.log(`❌ Validation failed: Hero ${i + 1} name too long`);
        return NextResponse.json(
          { error: `Hero ${i + 1} name must be 500 characters or less` },
          { status: 400 }
        );
      }
    }

    // Validate field lengths
    const maxLength = 4000;
    if (body.your_current_transition.length > maxLength || 
        body.career_asp.length > maxLength) {
      console.log('❌ Validation failed: Field too long');
      return NextResponse.json(
        { error: `Transition and career aspiration fields must be ${maxLength} characters or less` },
        { status: 400 }
      );
    }

    const answers = {
      your_current_transition: body.your_current_transition,
      career_asp: body.career_asp,
      heroes: body.heroes.map((hero: any) => ({
        name: hero.name.trim(),
        description: (hero.description || '').trim(),
      })),
    };

    // Use the same upsert function since it handles both insert and update
    await upsertCareerStory1(body.userId, answers);

    console.log('✅ Career story 1 successfully updated!');

    return NextResponse.json(
      { 
        message: 'Career story 1 updated successfully',
        userId: body.userId
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error updating career story 1:', error);
    
    return NextResponse.json(
      { error: 'Failed to update career story. Please try again.' },
      { status: 500 }
    );
  }
}
