export type TCustomer = {
  customer_id: string;
  customer_name: string;
  customer_description: string;
  logo: string;
  created_by: string;
  updated_at: string;
  created_at: string;
  is_deleted: boolean;
  deleted_by: string;
  deleted_at: string;
};

export type TCreateUpdateCustomer = {
  customer_id?: string;
  customer_name: string;
  customer_description: string;
  logo: string;
};
