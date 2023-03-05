export default function getHours() {
  const diaCompleto = new Date();
  const horario =
    (diaCompleto.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    diaCompleto.getDate().toString().padStart(2, '0') +
    ', às ' +
    diaCompleto.getHours().toString().padStart(2, '0') +
    ':' +
    diaCompleto.getMinutes().toString().padStart(2, '0');
  return horario;
}
