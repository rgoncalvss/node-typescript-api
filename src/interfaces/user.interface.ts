import { IBook } from './book.interface';

export interface IUser {
  id: number;
  email: string;
  name: string;
  Books?: IBook[];
}
