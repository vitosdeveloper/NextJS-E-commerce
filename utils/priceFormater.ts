export default function priceFormater(price: string | number): string {
  const toNumber = Number(price);
  const formato = { style: 'currency', currency: 'BRL' };
  const formated = toNumber.toLocaleString('pt-BR', formato);
  return formated;
}
