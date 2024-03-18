export interface IBook {
  id: number;
  title: string;
  content?: string;
  available: boolean;
  customerId?: number;
}
