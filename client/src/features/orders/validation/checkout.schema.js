import { z } from 'zod';

export const checkoutAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(80, 'Recipient name must be 80 characters or less'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid 10-digit mobile number')
    .max(15, 'Phone number cannot exceed 15 digits'),
  address: z
    .string()
    .trim()
    .min(5, 'Delivery address is required')
    .max(200, 'Address is too long'),
  instructions: z
    .string()
    .max(200, 'Instructions must be 200 characters or less')
    .optional(),
  paymentMethod: z.enum(['cod', 'card', 'upi']).default('cod'),
});

