'use client';
import { useEffect, useRef, useState } from 'react';
import { CHAIN, USDG } from '@/lib/catalog';
export function useWallet() {
  const [providers, setProviders] = useState<any[]>([]),
    [account, setAccount] = useState(''),
    [chain, setChain] = useState(''),
    [balances, setBalances] = useState<{
      eth: string | null;
      usdg: string | null;
    }>({ eth: null, usdg: null }),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const active = useRef<any>(null),
    generation = useRef(0);
  useEffect(() => {
    function announce(e: any) {
      const d = e.detail;
      if (d?.provider && d?.info)
        // The injected wallet is an external browser source, read once after hydration.
        // oxlint-disable-next-line react/react-compiler
        setProviders((prev) =>
          prev.some((p) => p.provider === d.provider) ? prev : [...prev, d],
        );
    }
    window.addEventListener('eip6963:announceProvider', announce);
    window.dispatchEvent(new Event('eip6963:requestProvider'));
    const eth = (window as any).ethereum;
    // The legacy provider is external browser state loaded after hydration.
    if (eth)
      // oxlint-disable-next-line react/react-compiler
      setProviders((prev) =>
        prev.length
          ? prev
          : (eth.providers || [eth]).map((p: any, i: number) => ({
              provider: p,
              info: {
                name: p.isMetaMask
                  ? 'MetaMask'
                  : p.isCoinbaseWallet
                    ? 'Coinbase Wallet'
                    : 'Browser wallet ' + (i + 1),
                uuid: 'legacy-' + i,
              },
            })),
      );
    return () =>
      window.removeEventListener('eip6963:announceProvider', announce);
  }, []);
  async function refresh(provider = active.current) {
    if (!provider) return;
    const run = ++generation.current;
    try {
      const [accounts, c] = await Promise.all([
        provider.request({ method: 'eth_accounts' }),
        provider.request({ method: 'eth_chainId' }),
      ]);
      if (run !== generation.current) return;
      setAccount(accounts[0] || '');
      setChain(c);
      setBalances({ eth: null, usdg: null });
      if (!accounts[0] || c !== CHAIN.chainId) return;
      const [eth, usd, decimals] = await Promise.allSettled([
        provider.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        }),
        provider.request({
          method: 'eth_call',
          params: [
            {
              to: USDG,
              data: '0x70a08231' + accounts[0].slice(2).padStart(64, '0'),
            },
            'latest',
          ],
        }),
        provider.request({
          method: 'eth_call',
          params: [{ to: USDG, data: '0x313ce567' }, 'latest'],
        }),
      ]);
      if (run !== generation.current) return;
      setBalances({
        eth:
          eth.status === 'fulfilled'
            ? (Number(BigInt(eth.value)) / 1e18).toFixed(5)
            : null,
        usdg:
          usd.status === 'fulfilled' &&
          decimals.status === 'fulfilled' &&
          Number(BigInt(decimals.value)) <= 36
            ? (
                Number(BigInt(usd.value)) /
                10 ** Number(BigInt(decimals.value))
              ).toFixed(2)
            : null,
      });
    } catch {
      setError('Could not read the wallet. Please retry.');
    }
  }
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const p = active.current;
    if (!p) return;
    const handler = () => refresh(p);
    p.on?.('accountsChanged', handler);
    p.on?.('chainChanged', handler);
    p.on?.('disconnect', handler);
    const timer = setInterval(() => {
      if (!document.hidden) void refresh(p);
    }, 30000);
    return () => {
      clearInterval(timer);
      p.removeListener?.('accountsChanged', handler);
      p.removeListener?.('chainChanged', handler);
      p.removeListener?.('disconnect', handler);
    };
  }, [revision]);
  async function connect(p: any) {
    setBusy(true);
    setError('');
    try {
      await p.request({ method: 'eth_requestAccounts' });
      active.current = p;
      setRevision((x) => x + 1);
      await refresh(p);
    } catch (e: any) {
      setError(
        e.code === 4001
          ? 'Connection request cancelled.'
          : 'Wallet connection failed. Try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function switchChain() {
    try {
      await active.current?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN.chainId }],
      });
    } catch (e: any) {
      if (e.code === 4902)
        try {
          await active.current?.request({
            method: 'wallet_addEthereumChain',
            params: [CHAIN],
          });
        } catch {
          setError('Network request cancelled.');
        }
      else setError('Could not switch networks.');
    }
    await refresh();
  }
  function disconnect() {
    generation.current++;
    active.current = null;
    setAccount('');
    setChain('');
    setBalances({ eth: null, usdg: null });
    setRevision((x) => x + 1);
  }
  return {
    providers,
    account,
    chain,
    balances,
    error,
    busy,
    connect,
    switchChain,
    disconnect,
    refresh,
  };
}
