import * as yup from 'yup';
import { addDays, isBefore, isWeekend, startOfDay } from 'date-fns';

export const newVacationRequestSchema = yup.object({
  startDate: yup
    .date()
    .required('Data de início é obrigatória')
    .min(startOfDay(new Date()), 'Data de início deve ser hoje ou no futuro'),
  endDate: yup
    .date()
    .required('Data de término é obrigatória')
    .test('after-start', 'Data de término deve ser após a data de início', function (value) {
      const { startDate } = this.parent;
      return value && startDate ? !isBefore(value, startDate) : true;
    }),
  reason: yup
    .string()
    .required('Motivo da solicitação é obrigatório')
    .min(10, 'Motivo deve ter pelo menos 10 caracteres')
    .max(500, 'Motivo deve ter no máximo 500 caracteres'),
});