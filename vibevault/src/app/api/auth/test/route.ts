import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * Test endpoint for debugging authentication issues
 * GET /api/auth/test
 * 
 * This endpoint helps diagnose authentication problems by:
 * 1. Testing database connection
 * 2. Checking if admin user exists
 * 3. Verifying password hash
 * 4. Testing environment variables
 */
export async function GET(request: NextRequest) {
  const results: {
    timestamp: string;
    tests: Array<{
      name: string;
      status: 'pass' | 'fail' | 'warning';
      message: string;
      details?: any;
    }>;
  } = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  // Test 1: Environment Variables
  try {
    const hasAuthSecret = !!process.env.AUTH_SECRET;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasAuthUrl = !!process.env.AUTH_URL;

    results.tests.push({
      name: 'Environment Variables',
      status: hasAuthSecret && hasDatabaseUrl && hasAuthUrl ? 'pass' : 'fail',
      message: hasAuthSecret && hasDatabaseUrl && hasAuthUrl
        ? 'All required environment variables are set'
        : `Missing: ${!hasAuthSecret ? 'AUTH_SECRET ' : ''}${!hasDatabaseUrl ? 'DATABASE_URL ' : ''}${!hasAuthUrl ? 'AUTH_URL' : ''}`,
      details: {
        AUTH_SECRET: hasAuthSecret ? 'Set' : 'Missing',
        DATABASE_URL: hasDatabaseUrl ? 'Set' : 'Missing',
        AUTH_URL: hasAuthUrl ? process.env.AUTH_URL : 'Missing',
      },
    });
  } catch (error) {
    results.tests.push({
      name: 'Environment Variables',
      status: 'fail',
      message: `Error checking environment variables: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }

  // Test 2: Database Connection
  try {
    await prisma.$connect();
    results.tests.push({
      name: 'Database Connection',
      status: 'pass',
      message: 'Successfully connected to database',
    });
  } catch (error) {
    results.tests.push({
      name: 'Database Connection',
      status: 'fail',
      message: `Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error: error instanceof Error ? error.stack : String(error),
      },
    });
    return NextResponse.json(results, { status: 500 });
  }

  // Test 3: Admin User Exists
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@vibevault.com' },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    if (adminUser) {
      results.tests.push({
        name: 'Admin User Exists',
        status: 'pass',
        message: 'Admin user found in database',
        details: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          hasPassword: !!adminUser.password,
          passwordLength: adminUser.password?.length || 0,
          passwordPreview: adminUser.password?.substring(0, 20) + '...',
        },
      });

      // Test 4: Password Hash Validation
      if (adminUser.password) {
        try {
          const isValid = await bcrypt.compare('admin123', adminUser.password);
          results.tests.push({
            name: 'Password Hash Validation',
            status: isValid ? 'pass' : 'fail',
            message: isValid
              ? 'Password hash is valid and matches "admin123"'
              : 'Password hash does not match "admin123"',
            details: {
              hashLength: adminUser.password.length,
              hashPrefix: adminUser.password.substring(0, 7),
            },
          });
        } catch (error) {
          results.tests.push({
            name: 'Password Hash Validation',
            status: 'fail',
            message: `Error validating password hash: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      } else {
        results.tests.push({
          name: 'Password Hash Validation',
          status: 'fail',
          message: 'Admin user has no password',
        });
      }
    } else {
      results.tests.push({
        name: 'Admin User Exists',
        status: 'fail',
        message: 'Admin user not found in database. Run CREATE_ADMIN.sql in Supabase SQL Editor.',
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'Admin User Exists',
      status: 'fail',
      message: `Error checking admin user: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }

  // Test 5: NextAuth Configuration
  try {
    const authSecret = process.env.AUTH_SECRET;
    if (authSecret && authSecret.length >= 32) {
      results.tests.push({
        name: 'NextAuth Configuration',
        status: 'pass',
        message: 'AUTH_SECRET is set and has sufficient length',
        details: {
          length: authSecret.length,
        },
      });
    } else {
      results.tests.push({
        name: 'NextAuth Configuration',
        status: 'warning',
        message: 'AUTH_SECRET is set but may be too short (recommended: 32+ characters)',
        details: {
          length: authSecret?.length || 0,
        },
      });
    }
  } catch (error) {
    results.tests.push({
      name: 'NextAuth Configuration',
      status: 'fail',
      message: `Error checking NextAuth configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }

  // Summary
  const passed = results.tests.filter((t) => t.status === 'pass').length;
  const failed = results.tests.filter((t) => t.status === 'fail').length;
  const warnings = results.tests.filter((t) => t.status === 'warning').length;

  return NextResponse.json(
    {
      ...results,
      summary: {
        total: results.tests.length,
        passed,
        failed,
        warnings,
        allPassed: failed === 0,
      },
    },
    { status: failed > 0 ? 500 : 200 }
  );
}

