import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Please choose a rating between 1 and 5' })
    .int()
    .min(1, 'Please select at least 1 star')
    .max(5, 'Maximum rating is 5 stars'),
  comment: z
    .string()
    .trim()
    .max(500, 'Review comment must be 500 characters or less')
    .optional(),
});

