import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TOKEN_PACK_PRICE_ID = process.env.STRIPE_TOKEN_PACK_100K_PRICE_ID!;
const SUBSCRIPTION_PRICE_ID = process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID!;
const TOKEN_PACK_AMOUNT = 100_000;
const SUBSCRIPTION_TOKEN_AMOUNT = 100_000; // Adjust if different for subscription

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers.get('stripe-signature') as string;
  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('[WEBHOOK] Stripe Webhook Signature Error:', err);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('[WEBHOOK] Received Stripe event:', event.type);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('[WEBHOOK] Processing checkout.session.completed, session ID:', session.id);

      const userId = session.metadata?.userId;
      let priceId = session.metadata?.priceId; 

      if (!priceId) {
        console.warn('[WEBHOOK] priceId not found in session.metadata. Attempting to retrieve from line_items.');
        try {
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['line_items'],
          });
          const lineItems = (fullSession as any).line_items?.data;
          if (Array.isArray(lineItems) && lineItems.length > 0) {
            priceId = lineItems[0]?.price?.id;
          }
          console.log('[WEBHOOK] Fetched priceId from expanded line_items:', priceId);
        } catch (fetchErr) {
          console.error('[WEBHOOK] Error fetching expanded session for priceId:', fetchErr);
        }
      }
      
      const stripeCustomerId = session.customer as string | null;
      const customerEmail = session.customer_details?.email || null;

      console.log('[WEBHOOK] Extracted values for checkout.session.completed:', { userId, priceId, stripeCustomerId, customerEmail, sessionId: session.id });

      if (!userId || !priceId) {
        console.error('[WEBHOOK] CRITICAL: Missing userId or priceId in checkout.session.completed. Cannot process.', { userId, priceId });
        break; 
      }

      if (stripeCustomerId) {
        try {
          console.log('[WEBHOOK] Attempting to upsert stripe_customer:', { userId, stripeCustomerId, customerEmail });
          const { data: customerUpsertData, error: customerUpsertError } = await supabase.from('stripe_customers').upsert({
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            email: customerEmail, // This will fail if 'email' column doesn't exist
          }, { onConflict: 'user_id' });
          console.log('[WEBHOOK] stripe_customers upsert result:', { customerUpsertData, customerUpsertError });
          if (customerUpsertError) {
              console.error('[WEBHOOK] Supabase error upserting stripe_customer:', customerUpsertError);
          }
        } catch (customerDbErr) {
          console.error('[WEBHOOK] Exception during stripe_customers upsert:', customerDbErr);
        }
      } else {
          console.warn('[WEBHOOK] Stripe Customer ID (session.customer) is null. Skipping upsert into stripe_customers.');
      }

      if (priceId === TOKEN_PACK_PRICE_ID) {
        console.log('[WEBHOOK] Processing token pack purchase for priceId:', priceId);
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('increment_token_balance', {
            p_user_id: userId, 
            p_tokens: TOKEN_PACK_AMOUNT,
          });
          console.log('[WEBHOOK] increment_token_balance result (token pack):', { rpcData, rpcError });
          if (rpcError) console.error('[WEBHOOK] Supabase RPC error (token pack - increment_token_balance):', rpcError);

          const { data: insertData, error: insertError } = await supabase.from('token_purchases').insert({
            user_id: userId,
            stripe_payment_intent_id: session.payment_intent as string | null,
            tokens_purchased: TOKEN_PACK_AMOUNT,
            amount_paid: session.amount_total,
          });
          console.log('[WEBHOOK] token_purchases insert result:', { insertData, insertError });
          if (insertError) console.error('[WEBHOOK] Supabase error inserting token_purchase:', insertError);

          console.log('[WEBHOOK] Token pack purchase processed for user:', userId);
        } catch (dbErr) {
          console.error('[WEBHOOK] Exception during token pack DB operations:', dbErr);
        }
      } else if (priceId === SUBSCRIPTION_PRICE_ID) {
        console.log('[WEBHOOK] Processing subscription purchase for priceId:', priceId);
        const stripeSubscriptionId = session.subscription as string | null;
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('increment_token_balance', {
            p_user_id: userId, 
            p_tokens: SUBSCRIPTION_TOKEN_AMOUNT,
          });
          console.log('[WEBHOOK] increment_token_balance result (subscription):', { rpcData, rpcError });
          if (rpcError) console.error('[WEBHOOK] Supabase RPC error (subscription - increment_token_balance):', rpcError);

          if (!stripeSubscriptionId) {
            console.error('[WEBHOOK] Stripe Subscription ID (session.subscription) is null. Cannot upsert into subscriptions.');
          } else {
            const { data: upsertData, error: upsertError } = await supabase.from('subscriptions').upsert({
              user_id: userId,
              stripe_subscription_id: stripeSubscriptionId,
              status: 'active',
              current_period_end: session.expires_at
                ? new Date(session.expires_at * 1000).toISOString()
                : null,
            }, { onConflict: 'user_id' }); 
            console.log('[WEBHOOK] subscriptions upsert result:', { upsertData, upsertError });
            if (upsertError) console.error('[WEBHOOK] Supabase error upserting subscription:', upsertError);
          }
          console.log('[WEBHOOK] Subscription processed for user:', userId);
        } catch (dbErr) {
          console.error('[WEBHOOK] Exception during subscription DB operations:', dbErr);
        }
      } else {
        console.warn('[WEBHOOK] Unknown priceId in checkout.session.completed', { priceId, userId });
      }
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('[WEBHOOK] Processing invoice.paid, invoice ID:', invoice.id);

      let stripeSubscriptionId = (invoice as any).subscription as string;
       if (!stripeSubscriptionId && (invoice as any).subscription_details?.subscription) {
        stripeSubscriptionId = (invoice as any).subscription_details.subscription;
      }
      console.log('[WEBHOOK] Resolved stripeSubscriptionId from invoice:', stripeSubscriptionId);

      if (!stripeSubscriptionId) {
        console.warn('[WEBHOOK] No subscription ID found on invoice.paid event.');
        break;
      }
      
      let userId = null;
      try {
        const { data: subscriptionRows, error: subSelectError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', stripeSubscriptionId)
          .limit(1);

        if (subSelectError) {
          console.error('[WEBHOOK] Supabase error selecting subscription by stripe_subscription_id:', subSelectError);
          break;
        }
        if (!subscriptionRows || subscriptionRows.length === 0) {
          console.error('[WEBHOOK] No user found for subscription in invoice.paid.', { stripeSubscriptionId });
          break;
        }
        userId = subscriptionRows[0].user_id;
        console.log('[WEBHOOK] Found user for subscription renewal:', { userId, stripeSubscriptionId });

        const { data: rpcData, error: rpcError } = await supabase.rpc('increment_token_balance', {
          p_user_id: userId, 
          p_tokens: SUBSCRIPTION_TOKEN_AMOUNT,
        });
        console.log('[WEBHOOK] increment_token_balance result (renewal):', { rpcData, rpcError });
        if (rpcError) console.error('[WEBHOOK] Supabase RPC error (renewal - increment_token_balance):', rpcError);
        
        const { data: updateData, error: updateError } = await supabase.from('subscriptions').update({
          status: 'active',
          current_period_end: invoice.lines?.data?.[0]?.period?.end
            ? new Date(invoice.lines.data[0].period.end * 1000).toISOString()
            : null,
        }).eq('user_id', userId); 
        console.log('[WEBHOOK] subscriptions update result (renewal):', { updateData, updateError });
        if (updateError) console.error('[WEBHOOK] Supabase error updating subscription (renewal):', updateError);

        console.log('[WEBHOOK] Subscription renewal processed for user:', userId);
      } catch (dbErr) {
        console.error('[WEBHOOK] Exception during invoice.paid DB operations:', dbErr);
      }
      break;
    }
    default:
      console.log('[WEBHOOK] Unhandled Stripe event type:', event.type);
      break;
  }

  return NextResponse.json({ received: true });
}