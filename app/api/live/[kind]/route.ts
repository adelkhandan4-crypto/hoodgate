import { live } from '@/lib/live';
export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  if (
    ![
      'network',
      'models',
      'markets',
      'agents',
      'kraken',
      'weather',
      'defi',
      'search',
      'wiki',
      'commons',
      'github',
    ].includes(kind)
  )
    return Response.json({ error: 'Unknown source' }, { status: 404 });
  const q = new URL(request.url).searchParams.get('q') || '';
  if (q.length > 100)
    return Response.json({ error: 'Query too long' }, { status: 400 });
  try {
    return Response.json(await live(kind, q), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { error: 'The data provider is temporarily unavailable. Try again.' },
      { status: 502 },
    );
  }
}
