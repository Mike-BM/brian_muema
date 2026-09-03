import { NextResponse } from 'next/server';
import { getGithubBinary, NO_CACHE_HEADERS } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const buffer = await getGithubBinary('public/cv.pdf');
    if (!buffer) {
      return new NextResponse('CV file not found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Brian_Muema_CV.pdf"',
        ...NO_CACHE_HEADERS,
      },
    });
  } catch (error) {
    console.error('Error serving CV:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
