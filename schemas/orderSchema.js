const { z } = require("zod");

const itemSchema = z.object({
  quantity: z.number(),
  price: z.number(),
  product: z.string(),
  priceType: z.enum(["wholesale", "retail"]),
  subTotal: z.number(),
});

const addressSchema = z.object({
  county: z.string(),
  subCounty: z.string(),
  ward: z.string(),
  area: z.string(),
  additionalDetails: z.string(),
});

// Main Schema
const orderRequestSchema = z
  .object({
    deliveryMethod: z.enum(["pickup", "delivery"]),
    address: addressSchema.optional(),
    items: z.array(itemSchema).min(1, "At least one item is required to place order"),
    paymentMethod: z.enum(["cash", "mpesa", "bank", "paypal"]),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!(
          data.address &&
          data.address.subCounty &&
          data.address.ward &&
          data.address.area &&
          data.address.additionalDetails
        );
      }
      return true;
    },
    {
      message: "Address is required for delivery orders.",
      path: ["address"], // points the error to `address`
    }
  );

module.exports = orderRequestSchema;
