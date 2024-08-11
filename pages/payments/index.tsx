import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import axios from "axios";
import React from "react";
import { Button } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import { getUser } from "../../lib/hooks";
import { useSession } from "../../context/session";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
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
  const stripe = useStripe();
  const elements = useElements();
const [confirm_payment, setConfirmPayment] = React.useState(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement("card");
    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post("/api/payments", {
        data: { amount: rechargeAmount },
      });
      const clientSecret = data;

      let confirm_payment_res = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      setConfirmPayment(confirm_payment_res);
      setTimeout(() => {
        setConfirmPayment(null);
      }, 5000);
      if(confirm_payment_res?.paymentIntent?.status == "succeeded"){
        let amount = confirm_payment_res?.paymentIntent?.amount/100;
        let charCount = user.charCount + amount*1000000;
        updateUser(user, charCount);
      }
      console.log(confirm_payment_res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {confirm_payment?.paymentIntent?.status == "succeeded" ? (
        <Alert severity="success">Payment successful</Alert>
      ) : null}
      {(confirm_payment?.paymentIntent?.status == "failed" || confirm_payment?.error)? (
        <Alert severity="error">Payment failed </Alert>
      ) : null}
      {confirm_payment?.error?.message ? (
        <Alert severity="error">{confirm_payment?.error?.message}</Alert>
      ) : null}
      {rechargeAmount > 0 ? <CardElement /> : null}
      <Button type="submit">Submit</Button>
    </form>
  );
}
