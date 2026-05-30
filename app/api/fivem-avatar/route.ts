import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) return Response.json({ url: null });

  try {
    const res = await fetch(
      `https://forum.cfx.re/u/${encodeURIComponent(username)}.json`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return Response.json({ url: null });

    const data = await res.json();
    const template: string | undefined = data?.user?.avatar_template;
    if (!template) return Response.json({ url: null });

    const url = `https://forum.cfx.re${template.replace('{size}', '80')}`;
    return Response.json({ url });
  } catch {
    return Response.json({ url: null });
  }
}
