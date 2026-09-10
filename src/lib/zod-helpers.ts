import { z } from 'zod'

export const optionalIntString = z
  .string()
  .refine(
    (value) =>
      value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0),
  )
  .optional()

export const optionalDecimalString = z
  .string()
  .refine(
    (value) =>
      value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0),
  )
  .optional()
