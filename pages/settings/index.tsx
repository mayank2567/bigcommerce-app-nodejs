import React, { useEffect, useState } from 'react';
import { useSession } from "../../context/session";
import { Button } from "@mui/material";
import { getUser } from "../../lib/hooks";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../payments";
import {Input} from "@mui/material";
const Settings = () => {
  const encodedContext = useSession()?.context;
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  const [showRecharge, setShowRecharge] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(1);
  const user = getUser();
    console.log(`User after getuser: ${JSON.stringify(user)}`);
    
    return (
        <div>
            <h1>Settings</h1>
            <h2>User: {user?.email}</h2>
            <h2>Remaining balance: ${user?.charCount/1000000}</h2>
            <h2>ID: {user?.id}</h2>
            <Button onClick={() => setShowRecharge(true)}>Recharge</Button>
            {showRecharge ?(
              <div>
                <Input type="number" placeholder="Enter amount" value={rechargeAmount}
                onChange={(e) => setRechargeAmount(parseFloat(e.target.value))} />
                <Elements stripe={stripePromise} >
              <PaymentForm  rechargeAmount={rechargeAmount}  />
            </Elements>

              </div>
            ): null}
            
        </div>
    );
}

export default Settings;
