import { z } from 'zod';

export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Dish name must be at least 2 characters')
    .max(80, 'Dish name must be 80 characters or less'),
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(40, 'Category must be 40 characters or less'),
  price: z
    .coerce
    .number({ invalid_type_error: 'Price must be a valid number' })
    .min(0, 'Price cannot be negative')
    .max(50000, 'Price must be reasonable'),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
});

