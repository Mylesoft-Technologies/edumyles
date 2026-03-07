import { NextRequest, NextResponse } from 'next/server';
import { isBypassRequestAllowed, setAuthCookie } from '@/lib/auth-bypass';

export async function GET(request: NextRequest) {
  if (!isBypassRequestAllowed(request)) {
    return NextResponse.json(
      { error: "Access denied: bypass auth is disabled in production" },
      { status: 403 }
    );
  }

  // Create mock master admin session
  const mockUser = {
    _id: 'platform-admin-demo',
    email: 'platform-admin@edumyles.demo',
    firstName: 'Platform',
    lastName: 'Admin',
    role: 'PLATFORM_ADMIN',
    tenantId: null, // Platform level has no tenant
    eduMylesUserId: 'platform-admin-demo',
    permissions: ['platform.admin', 'tenant.manage', 'system.config'],
    isDemo: true
  };

  // Set auth cookie
  await setAuthCookie(mockUser);

  // Redirect to platform dashboard
  return NextResponse.redirect(new URL('/platform', request.url));
}

