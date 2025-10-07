import * as yup from 'yup';

export const rejectVacationSchema = yup.object({
  rejectionReason: yup.string().min(10, 'Motivo deve ter pelo menos 10 caracteres').required('Motivo é obrigatório'),
});