import {z} from 'zod';

export const ConsentFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),
    email: z.string().email('Invalid email address'),
    consentGivenFor: z
        .array(z.string())
        .min(1, 'At least one consent must be selected'),
});

export type Consent = {
    name: string;
    email: string;
    consentGivenFor: string[];
};

export type ConsentFormType = z.infer<typeof ConsentFormSchema>;
