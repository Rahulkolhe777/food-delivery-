import { z } from 'zod';

export const restaurantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(80, 'Restaurant name must be 80 characters or less'),
  city: z.string().min(1, 'Please select a city'),
  area: z
    .string()
    .trim()
    .min(2, 'Area or neighborhood must be at least 2 characters')
    .max(80, 'Area must be 80 characters or less'),
  cuisines: z
    .array(z.string())
    .min(1, 'Please select at least one cuisine served by this kitchen'),
  lng: z
    .number({ invalid_type_error: 'Longitude must be a valid coordinate number' })
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  lat: z
    .number({ invalid_type_error: 'Latitude must be a valid coordinate number' })
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  isOpen: z.boolean().default(true),
});

