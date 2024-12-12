export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  name: string;
  email: string;
  password: string;
}

export interface ISettings {
  tin: string;
  mrc: string;
  branch_id: string;
  address: string;
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
  external_id: number;
}

export interface IInvoice {
  invoice_number?: number;
  original_invoice_number?: number;
  customer_tin: number;
  purchase_code?: number;
  sender: string;
  recipient: string;
  recipient_phone_number?: string;
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
  amount_paid: number;
  balance_due: number;
  taxable_amount: number;
  tax: number;
  discount: number;
  registrant_id: string;
  registrant_name: string;
  modifier_id: string;
  modifier_name: string;
  report_number: number;
  cancel_requested_date?: string;
  cancel_date?: string;
  refund_date?: string;
  refunded_reason_code?: string;
  items: IItem[];
  print_size?: string;
}

export interface IProfile {
  name: string;
  email: string;
}
export interface IPassword {
  old_password: string;
  new_password: string;
}
