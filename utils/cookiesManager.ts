export const getUserIdFromCookie = () => {
  return JSON.parse(document.cookie.slice(9));
};

export const setUserIdandJwtOnCookie = (obj: { id: string; jwt: string }) => {
  return (document.cookie = 'idAndJwt=' + JSON.stringify(obj));
};

export const clearUserIdOnCookie = () => {
  return (document.cookie = 'idAndJwt=' + JSON.stringify({ id: '', jwt: '' }));
};
