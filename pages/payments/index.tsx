
import Stripe_card from "@components/stripe";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
import { getUser } from "../../lib/hooks";
import { useSession } from "../../context/session";
export default function PaymentForm({
  rechargeAmount,
}: {
  rechargeAmount: number;
}) {
  const encodedContext = useSession()?.context;
  const user = getUser();
  async function updateUser(user, charCount) {
    let updatedUser = { ...user, charCount: charCount };
    let response = await fetch(`/api/user/${user.id}?context=${encodedContext}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: updatedUser }),
    });
    response = await response.json();
  }
  

  return (
    <div>
    {rechargeAmount > 0 ?<Elements stripe={stripePromise}>
      <Stripe_card user={user} rechargeAmount={rechargeAmount} updateUser={updateUser}/>
    </Elements> : null}
    </div>
  );
}
