import HoodGate from '../hoodgate';
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <HoodGate initialPath={'/' + slug.join('/')} />;
}
