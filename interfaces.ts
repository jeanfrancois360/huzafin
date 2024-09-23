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
  item_classification_code: string;
  packaging_unit_code: string;
  package: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
  tax_type: string;
  taxable_amount: number;
  tax_rate: number;
  tax_amount: number;
  discount_rate: number;
  discount_amount: number;
  external_id: string;
}

export interface IInvoice {
  invoice_number: string;
  original_invoice_number: string;
  customer_tin: string;
  purchase_code: string;
  sender: string;
  recipient: string;
  sales_type_code: string;
  receipt_type_code: string;
  payment_type_code: string;
  invoice_status_code: string;
  validated_date: string;
  date: string;
  due_date: string;
  notes: string;
  terms: string;
  subtotal: number;
  total: number;
  taxable_amount: number;
  discount: number;
  amount_paid: number;
  balance_due: number;
  registrant_id: string;
  registrant_name: string;
  modifier_id: string;
  modifier_name: string;
  report_number: string;
  items: IItem[];
}

export interface IProfile {
  name: string;
  email: string;
}
export interface IPassword {
  old_password: string;
  new_password: string;
}
