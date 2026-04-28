import * as yup from 'yup';

export const signUpSchema = yup.object({
  firstName: yup.string().min(2, 'O nome deve ter ao menos 2 caracteres').max(50, 'O nome deve ter no máximo 50 caracteres').required('Nome é obrigatório'),
  lastName: yup.string().min(2, 'O sobrenome deve ter ao menos 2 caracteres').max(50, 'O sobrenome deve ter no máximo 50 caracteres').required('Sobrenome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("Senha é obrigatória"),
});