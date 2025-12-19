import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/user-service';
import { registerSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  console.log('🚀 Register API called (Prisma)');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    console.log('✅ Validated data:', validatedData);
    
    // Create user with Prisma
    console.log('👤 Creating user with Prisma...');
    const user = await UserService.createUser(validatedData);
    console.log('✅ User created successfully:', user);

    return NextResponse.json(
      { message: 'Registration successful', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('💥 Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Email already exists') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Invalid') || error.message.includes('validation')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      // Return the actual error message for debugging
      return NextResponse.json(
        { error: error.message || 'Registration failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
