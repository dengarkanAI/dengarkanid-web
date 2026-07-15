import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const documentId = searchParams.get('documentId');

  if (!uid || !documentId) {
    return NextResponse.json({ error: 'Missing uid or documentId' }, { status: 400 });
  }

  // Handle specific content types
  if (uid === 'api::blog.blog') {
    try {
      const cmsUrl = process.env.NODE_ENV === 'production' ? 'http://cms:1337' : 'http://127.0.0.1:1337';
      const res = await fetch(`${cmsUrl}/api/blogs/${documentId}?status=draft`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const data = await res.json();
      
      const slug = data?.data?.slug;
      if (slug) {
        return NextResponse.redirect(new URL(`/artikel/${slug}?preview=true`, request.url));
      }
    } catch (error) {
      console.error("Preview routing error:", error);
      return NextResponse.redirect(new URL('/artikel', request.url));
    }
  }

  // General pages redirect to home
  if (uid === 'api::hero.hero' || uid === 'api::homepage.homepage' || uid === 'api::faq.faq') {
    return NextResponse.redirect(new URL(`/?preview=true`, request.url));
  }

  return NextResponse.redirect(new URL(`/?preview=true`, request.url));
}
