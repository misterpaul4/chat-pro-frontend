export interface IBaseType {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IBaseCrudResponseType {
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

