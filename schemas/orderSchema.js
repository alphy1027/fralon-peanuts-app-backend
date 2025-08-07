const { z } = require("zod");

const itemSchema = z.object({
  quantity: z.number(),
  price: z.number(),
  product: z.string(),
  priceType: z.enum(["wholesale", "retail"]),
  subTotal: z.number(),
});

const addressSchema = z.object({
  county: z.string().optional(),
  subCounty: z.string(),
  ward: z.string(),
  area: z.string(),
  additionalDetails: z.string().optional(),
});

// Main Schema
const orderRequestSchema = z.object({
  address: addressSchema,
  items: z.array(itemSchema).min(1, "At least one item is required to place order"),
  paymentMethod: z.enum(["cash", "mpesa", "bank", "paypal"]),
  notes: z.string().nullable().optional(),
});

module.exports = orderRequestSchema;
