import test from 'node:test';
import assert from 'node:assert/strict';
import { paymentRequirements } from '../server/index.mjs';
import { discover, readData } from '../client/index.mjs';
const valid = {
  amount: '0.000001',
  decimals: 6,
  recipient: '0x' + '1'.repeat(40),
  asset: '0x' + '2'.repeat(40),
  resource: 'https://example.com/data',
};
test('payment amount preserves smallest-unit precision', () => {
  assert.equal(paymentRequirements(valid).amount, '1');
  assert.equal(
    paymentRequirements({ ...valid, amount: '9007199254740993.000001' }).amount,
    '9007199254740993000001',
  );
});
test('rejects invalid transaction requirements', () => {
  for (const patch of [
    { amount: '-1' },
    { amount: '0' },
    { amount: '0.0000001' },
    { decimals: undefined },
    { recipient: '0x123' },
    { asset: 'ETH' },
    { resource: 'http://example.com' },
  ])
    assert.throws(() => paymentRequirements({ ...valid, ...patch }));
});
test('client rejects unsupported sources before network access', async () => {
  await assert.rejects(readData('https://example.com', 'sendTransaction'));
});
test('catalog rejects malformed upstream payload', async () => {
  await assert.rejects(
    discover('/api/catalog', { fetcher: async () => new Response('{}') }),
  );
  const result = await discover('/api/catalog', {
    fetcher: async () =>
      Response.json({ services: [], executionEnabled: false }),
  });
  assert.equal(result.executionEnabled, false);
});
