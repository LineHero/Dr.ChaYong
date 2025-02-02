export function autoHyphen(phoneNumber: string): string {
  return phoneNumber
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
}
