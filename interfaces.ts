export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export interface IItem {
  name: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
}

export interface IInvoice {
  invoice_number: string;
  sender: string;
  recipient: string;
  date: string;
  due_date: string;
  notes: string;
  terms: string;
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  amount_paid: number;
  balance_due: number;
  items: IItem[];
}
