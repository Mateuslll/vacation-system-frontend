import * as yup from 'yup';

export const signInSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(8).required('Senha é obrigatória'),
});