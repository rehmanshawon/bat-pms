/* eslint-disable @typescript-eslint/no-empty-interface */
export interface JwtPayloadInterface {
  user_id: number;
  user_name: string;
  company_id: number;
  branch_id: number;
  branch_type?: string;
  department_id: number;
  division_id: number;
  email: string;
  type: string;
  parent_branch_id: number;
}
