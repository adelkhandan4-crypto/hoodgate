import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export function validateSettings(input) {
  if (
    typeof input.contract !== 'string' ||
    (input.contract && !/^0x[0-9a-fA-F]{40}$/.test(input.contract))
  )
    throw Error(
      'Contract must be empty or an EVM address with 40 hexadecimal characters.',
    );
  if (input.twitter) {
    const u = new URL(input.twitter);
    if (
      u.protocol !== 'https:' ||
      !['x.com', 'twitter.com'].includes(u.hostname) ||
      u.username ||
      u.password
    )
      throw Error(
        'Use an official https://x.com/ or https://twitter.com/ profile URL.',
      );
  }
  return { ...input, network: 'Robinhood Chain' };
}
export async function update(file, changes) {
  let previous = { contract: '', network: 'Robinhood Chain', twitter: '' };
  try {
    previous = JSON.parse(await readFile(file, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const next = validateSettings({
    ...previous,
    ...changes,
    updatedAt: new Date().toISOString(),
  });
  await mkdir(dirname(file), { recursive: true });
  const temp = file + '.' + process.pid + '.tmp';
  await writeFile(temp, JSON.stringify(next, null, 2) + '\n');
  await rename(temp, file);
  return next;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    const args = process.argv.slice(2),
      changes = {};
    let file = fileURLToPath(new URL('../public/token.json', import.meta.url));
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === '--file') {
        if (!args[i + 1]) throw Error('--file needs a path');
        file = resolve(args[++i]);
      } else if (arg === '--clear') changes.contract = '';
      else if (arg === '--twitter') {
        if (args[i + 1] === undefined) throw Error('--twitter needs a URL');
        changes.twitter = args[++i];
      } else if (/^0x/.test(arg)) changes.contract = arg;
      else
        throw Error(
          'Usage: node scripts/update-contract.mjs 0xADDRESS | --clear | --twitter URL [--file path]',
        );
    }
    if (!Object.keys(changes).length)
      throw Error('Provide a contract, --clear or --twitter URL.');
    const result = await update(file, changes);
    console.log(JSON.stringify({ file, ...result }, null, 2));
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
