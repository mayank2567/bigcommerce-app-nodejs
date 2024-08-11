import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// export async function POST(req: NextRequest) {
//   const { data } = await req.json();
//   const { amount } = data;
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Number(amount) * 100,
//       currency: "USD",
//     });

//     return new NextResponse(paymentIntent.client_secret, { status: 200 });
//   } catch (error: any) {
//     return new NextResponse(error, {
//       status: 400,
//     });
//   }
// }

export default async function products(req: NextApiRequest, res: NextApiResponse) {
  const {
      body,
      body: { data },
      method,
  } = req;

  switch (method) {
      case 'POST':
          try {
              // const session = await stripe.checkout.sessions.create({
              //     line_items: [
              //       {
              //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              //         price: 'prod_Qc9C17JHmAIrSU',
              //         quantity: 1,
              //     },],
              //     mode: 'payment',
              //     success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/settings?success=true`,
              //     cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/settings?canceled=true`,
              // });
              // res.send({ url: session.url });
              const paymentIntent = await stripe.paymentIntents.create({
                amount: Number(data.amount) * 100,
                currency: "USD",
                description: "Recharge",
                shipping: {
                  name: 'Customer Name',
                  address: {
                    line1: '123 Main Street',
                    line2: 'Apt 4B',
                    city: 'Anytown',
                    state: 'CA',
                    postal_code: '12345',
                    country: 'US',
                  },
                  phone: '555-555-5555',
                },
                // confirm: true,
                // return_url: `${process.env.CALLBACK}/settings?success=true`,
                // customer: 'cus_QcAQlutI6feuoZ',
                // add customer name and address
                // payment_method: 'pm_1J7J3n2eZvKYlo2C5t2cJr1e',

              });
              res.status(200).json(paymentIntent.client_secret);
          } catch (error) {
              res.status(400).json(error);
          }
          break;
      default:
          res.setHeader('Allow', ['POST']);
          res.status(405).end(`Method ${method} Not Allowed`);
  }
}
