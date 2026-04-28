import { signInSchema, signUpSchema, rejectVacationSchema, newVacationRequestSchema } from "@/lib/validations/schemas";
import { InferType } from "yup";


export type SignInFormData = InferType<typeof signInSchema>;
export type SignUpFormData = InferType<typeof signUpSchema>;


export type RejectVacationFormData = InferType<typeof rejectVacationSchema>;
export type NewVacationRequestFormData = InferType<typeof newVacationRequestSchema>;
