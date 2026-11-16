import { jsonNoCache } from '@/lib/github';
import { readCredentials, writeCredentials } from '@/lib/credentials';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Both handlers are admin-only: src/proxy.ts rejects requests without a valid signed session.

export async function GET() {
  const creds = await readCredentials();
  return jsonNoCache({ email: creds.email, username: creds.username });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { password, email, username } = data as { password?: string; email?: string; username?: string };

    if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) {
      return jsonNoCache({ error: 'Please enter a valid email address.' }, 400);
    }
    if (username !== undefined && (typeof username !== 'string' || username.trim().length < 3 || username.length > 60)) {
      return jsonNoCache({ error: 'Username must be 3-60 characters.' }, 400);
    }
    if (password && (typeof password !== 'string' || password.length < 10 || password.length > 200)) {
      return jsonNoCache({ error: 'Password must be at least 10 characters.' }, 400);
    }

    const current = await readCredentials();
    const next = {
      ...current,
      ...(email !== undefined && { email }),
      ...(username !== undefined && { username: username.trim() }),
      // a non-empty password is stored only as a hash; empty means "leave unchanged"
      ...(password ? { password: hashPassword(password) } : {}),
    };

    // Saving a username only makes sense together with a stored password (otherwise env credentials apply)
    await writeCredentials(next);
    return jsonNoCache({ success: true }, 200);
  } catch (error) {
    console.error('Error saving credentials:', error);
    return jsonNoCache({ error: 'Failed to save credentials' }, 500);
  }
}
