import Stripe from "stripe";
//Not a safe option to put environment keys like this, will hide it
export const stripeConfig = new Stripe(
  "sk_test_51MjZnWCABlc2vtOjisywKyRZIE6umq27En5ns9fUG5LzQR22NjFRboOy6vd3pGUArWjR9luPrp2x4zBoR5P3CYnZ00P3aYRDqj",
  {
    apiVersion: "2022-11-15",
    typescript: true,
  }
);
