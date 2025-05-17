import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil', // Ensure this matches your Stripe SDK version's expectation
});

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, mode = 'payment' } = await req.json();

    // Validate required parameters
    if (!priceId) {
      console.error('[STRIPE CHECKOUT] Missing priceId in request body');
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }
    if (!userId) {
      console.error('[STRIPE CHECKOUT] Missing userId in request body');
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Log parameters being used to create the session
    console.log('[STRIPE CHECKOUT] Creating Stripe Checkout Session with:', {
      userId,
      priceId,
      mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode, // 'payment' for one-time, 'subscription' for recurring
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
      metadata: {
        userId: userId, // userId is already correctly included
        priceId: priceId, // **MODIFICATION: Add priceId to metadata**
      },
      // If you want to associate the Checkout Session with an existing Stripe Customer
      // customer: stripeCustomerId, // You'd need to pass stripeCustomerId or fetch/create it here
      // customer_email: email, // Or pass email to prefill
      // customer_creation: 'always', // Or 'if_required'
    });

    console.log('[STRIPE CHECKOUT] Successfully created Stripe Checkout Session:', session.id);
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('[STRIPE CHECKOUT] Error creating session:', err); // Log the full error
    return NextResponse.json({ error: err.message || 'Failed to create checkout session.' }, { status: 500 });
  }
}