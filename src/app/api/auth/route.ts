import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const credentialsPath = path.join(process.cwd(), 'data', 'credentials.json');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let savedPassword = '';
    let savedUsername = '';
    try {
      const fileContents = await fs.readFile(credentialsPath, 'utf8');
      const credentials = JSON.parse(fileContents);
      savedPassword = credentials.password;
      savedUsername = credentials.username;
    } catch {
      // Ignored if file doesn't exist
    }

    const envPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
    const envUsername = process.env.ADMIN_USERNAME || "brian";
    
    // Check saved credentials if they exist, otherwise fallback to env
    const isValidPassword = savedPassword ? password === savedPassword : password === envPassword;
    const isValidUsername = savedUsername ? username === savedUsername : username === envUsername;

    if (isValidPassword && isValidUsername) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
