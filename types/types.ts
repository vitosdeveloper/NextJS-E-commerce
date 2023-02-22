export interface IStoreItem {
  _id: string;
  productImg: string;
  productTitle: string;
  productPrice: string;
  class: string;
  status: string;
  estoque: number;
  numDeCompras: number;
}

export type UpdatedDataType = {
  productPrice: string;
  estoque: number;
  numDeCompras: number;
};
