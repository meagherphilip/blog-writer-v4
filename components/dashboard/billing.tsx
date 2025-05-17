"use client";
import React, { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const TOKEN_PACK_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_TOKEN_PACK_100K_PRICE_ID!;
const SUBSCRIPTION_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID!;

export function Billing() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        if (!session?.user) throw new Error('User not found');
        const userId = session.user.id;
        // Fetch token balance
        const { data: balanceRow } = await supabase
          .from('token_balance')
          .select('balance')
          .eq('user_id', userId)
          .single();
        setTokenBalance(balanceRow?.balance ?? 0);
        // Fetch subscription status
        const { data: subRow } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', userId)
          .single();
        setSubscriptionStatus(subRow?.status ?? 'none');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, supabase]);

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    setLoading(true);
    setError(null);
    try {
      const userId = session?.user?.id;
      const res = await fetch('/api/integrations/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode, userId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Billing & Tokens</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="mb-4">
            <div>Token Balance: <span className="font-mono">{tokenBalance ?? '—'}</span></div>
            <div>Subscription Status: <span className="font-mono">{subscriptionStatus}</span></div>
          </div>
          <button
            className="w-full mb-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleCheckout(TOKEN_PACK_PRICE_ID, 'payment')}
            disabled={loading}
          >
            Buy 100,000 Tokens ($10)
          </button>
          <button
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleCheckout(SUBSCRIPTION_PRICE_ID, 'subscription')}
            disabled={loading}
          >
            Subscribe Monthly ($49.95)
          </button>
        </>
      )}
    </div>
  );
} 