export function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export function decimalOnly(value: string) {
  return value.replace(/[^0-9.]/g, '')
}
