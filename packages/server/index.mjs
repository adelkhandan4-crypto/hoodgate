/** Configuration helpers only. This package does not verify or settle payments. */
export function paymentRequirements({
  amount,
  recipient,
  resource,
  decimals,
  asset,
}) {
  if (!/^0x[0-9a-fA-F]{40}$/.test(recipient || ''))
    throw new Error('Invalid recipient');
  if (!/^0x[0-9a-fA-F]{40}$/.test(asset || ''))
    throw new Error('Invalid asset');
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36)
    throw new Error('Read and supply token decimals');
  const value = String(amount);
  if (!/^\d+(\.\d+)?$/.test(value)) throw new Error('Invalid amount');
  const [whole, fraction = ''] = value.split('.');
  if (fraction.length > decimals)
    throw new Error('Amount exceeds token precision');
  const units =
    BigInt(whole) * 10n ** BigInt(decimals) +
    BigInt(fraction.padEnd(decimals, '0') || '0');
  if (units <= 0n) throw new Error('Amount must be positive');
  const url = new URL(resource);
  if (url.protocol !== 'https:' || url.username || url.password)
    throw new Error('Resource must use HTTPS');
  return {
    network: 'eip155:4663',
    asset,
    amount: units.toString(),
    payTo: recipient,
    resource: url.href,
  };
}
