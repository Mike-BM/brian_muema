import { NextRequest, NextResponse } from 'next/server';
import { getGithubBinary } from '@/lib/github';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const subPath = pathSegments.join('/');
    const relPath = `public/uploads/${subPath}`;
    
    const buffer = await getGithubBinary(relPath);
    if (!buffer) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const ext = subPath.split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Since uploaded files have unique timestamps in their names, they can be cached safely once created
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving dynamic upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
