export interface AttachmentLogInterface {
  attach_config_slug: string;
  file: Express.Multer.File[];
  file_name: { [x: string]: any };
  reference_id: any;
  attach_type_name: any;
}
