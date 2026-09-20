import { services } from '@/lib/catalog';
export async function GET() {
  return Response.json({
    name: 'HoodGate',
    network: 'eip155:4663',
    services,
    executionEnabled: false,
  });
}
