import { ObjectId } from 'mongodb';

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

export type UserType = {
  _id: ObjectId | string;
  login: string;
  password?: string;
  nome: string;
  endereco: string;
  sexo: string;
  itensComprados: {
    detalhes: {
      dataCompra: string;
      valor: 28;
    };
    itens: {
      preco: string;
      quantidade: 1;
      _id: ObjectId | string;
    }[];
    _id: ObjectId | string;
  }[];
};
