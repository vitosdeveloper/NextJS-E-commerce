export const putIntoLocalStorage = (storageName: string, id: string) => {
  const prevItensJson = window.localStorage.getItem(storageName);
  const prevItens = prevItensJson ? JSON.parse(prevItensJson) : [];
  const favHasThisItem = prevItens.includes(id);

  if (!favHasThisItem) {
    window.localStorage.setItem(
      storageName,
      JSON.stringify([...prevItens, id])
    );
  }
  return favHasThisItem;
};
