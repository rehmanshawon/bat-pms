export interface SaveOrUpdateFormMetaInterface {
  readonly form_slug: string;
  readonly company_id: number;
  readonly reference_id: number;
  readonly user_id: number;
  readonly input_label: string[];
  readonly input_value: string[];
}
