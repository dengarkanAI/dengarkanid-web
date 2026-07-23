import { NextResponse } from 'next/server';
import { STRAPI_API_URL } from '@/utils/strapi';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });
  }

  try {
    const url = `${STRAPI_API_URL}${q}`;
    const res = await fetch(url, {
      cache: 'no-store'
    });
    const status = res.status;
    let data;
    try {
      data = await res.json();
    } catch(e) {
      data = await res.text();
    }

    return NextResponse.json({
      url,
      status,
      data
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
