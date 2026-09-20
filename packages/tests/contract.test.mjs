import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { update } from '../../scripts/update-contract.mjs';

test('contract updates preserve the social link; clearing removes only the contract', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'hoodgate-contract-'));
  try {
    const file = join(folder, 'token.json');
    const contract = '0x' + 'a'.repeat(40);
    await update(file, { twitter: 'https://x.com/example' });
    const result = await update(file, { contract });
    assert.equal(result.contract, contract);
    assert.equal(result.twitter, 'https://x.com/example');
    assert.equal(result.network, 'Robinhood Chain');
    const cleared = await update(file, { contract: '' });
    assert.equal(cleared.contract, '');
    assert.equal(cleared.twitter, result.twitter);
    const before = await readFile(file, 'utf8');
    await assert.rejects(update(file, { contract: '0x123' }));
    await assert.rejects(
      update(file, { twitter: 'https://x.com.evil.example/user' }),
    );
    assert.equal(await readFile(file, 'utf8'), before);
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});
