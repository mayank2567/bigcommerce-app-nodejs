import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React from "react";

import { Button } from "react-bootstrap";
import Alert from "@mui/material/Alert";



const Stripe_card = ({ rechargeAmount, user, updateUser }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [confirm_payment, setConfirmPayment] = React.useState(null);
  const [processing, setProcessing] = React.useState(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cardElement = elements?.getElement("card");
    try {
      if (!stripe || !cardElement) return null;
      setProcessing("Processing payment");
      const { data } = await axios.post("/api/payments", {
        data: { amount: rechargeAmount },
      });
      const clientSecret = data;

      let confirm_payment_res = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      setProcessing(null);
      setConfirmPayment(confirm_payment_res);
      setTimeout(() => {
        setConfirmPayment(null);
      }, 5000);
      if (confirm_payment_res?.paymentIntent?.status == "succeeded") {
        let amount = confirm_payment_res?.paymentIntent?.amount / 100;
        let charCount = user.charCount + amount * 1000000;
        updateUser(user, charCount);
      }
      console.log(confirm_payment_res);
    } catch (error) {
        setProcessing('Error processing payment');
        setTimeout(() => {
            setProcessing(null);
          }, 5000);
      console.log(error);
    }
  };
  return (
    <div>
      {" "}
      <form onSubmit={onSubmit}>
        {confirm_payment?.paymentIntent?.status == "succeeded" ? (
          <Alert severity="success">Payment successful</Alert>
        ) : null}
        {confirm_payment?.paymentIntent?.status == "failed" ||
        confirm_payment?.error ? (
          <Alert severity="error">Payment failed </Alert>
        ) : null}
        {confirm_payment?.error?.message ? (
          <Alert severity="error">{confirm_payment?.error?.message}</Alert>
        ) : null}
        {processing ? <Alert severity="info">{processing}</Alert> : null}
        
        <h3>Enter card details</h3>
        <CardElement /> 
        {(rechargeAmount > 0 && !processing) ? <Button type="submit">Submit</Button> 
        : null}
      </form>
    </div>
  );
};

export default Stripe_card;
