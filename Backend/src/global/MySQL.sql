
/* SQLINES DEMO ***  Data Transfer

 Source Server         : Oracle_ific
 Source Server Type    : Oracle
 Source Server Version : 190000
 Source Host           : 192.168.20.38:1521
 Source Schema         : APSISERP

 Target Server Type    : Oracle
 Target Server Version : 190000
 File Encoding         : 65001

 Date: 16/08/2022 01:38:42
*/


-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_action_buttons
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_action_buttons`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_action_buttons` (
  `company_id` INT VISIBLE NOT NULL,
  `btn_name` VARCHAR(50) VISIBLE NOT NULL,
  `btn_type` NVARCHAR(1000) VISIBLE DEFAULT 'button' ,
  `route_link` VARCHAR(255) VISIBLE,
  `btn_class` VARCHAR(255) VISIBLE,
  `btn_id` VARCHAR(20) VISIBLE,
  `btn_order` VARCHAR(20) VISIBLE,
  `btn_icon` VARCHAR(20) VISIBLE,
  `btn_data_attr` VARCHAR(255) VISIBLE,
  `dependency_attr` VARCHAR(255) VISIBLE,
  `dependency_attr_value` VARCHAR(255) VISIBLE,
  `btn_slug` VARCHAR(255) VISIBLE,
  `grid_slug` VARCHAR(50) VISIBLE,
  `in_dropdown` INT VISIBLE DEFAULT '0' ,
  `always_show` INT VISIBLE DEFAULT '0' ,
  `enable_status` VARCHAR(50) VISIBLE,
  `disable_status` VARCHAR(50) VISIBLE,
  `enable_multiple` INT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE,
  `action_btn_id` INT VISIBLE DEFAULT `APSISERP`.`sys_action_buttons_action_btn_id_seq`.`NEXTVAL` NOT NULL
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_approval_modules
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_approval_modules`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_approval_modules` (
  `approval_module_id` INT VISIBLE DEFAULT `APSISERP`.`sys_approval_modules_approval_module_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `approval_module_name` VARCHAR(150) VISIBLE NOT NULL COMMENT 'Approval Module Item box name',
  `icon_class` VARCHAR(120) VISIBLE NOT NULL,
  `color_class` VARCHAR(15) VISIBLE,
  `approval_url` VARCHAR(250) VISIBLE NOT NULL COMMENT 'action link which is made for the approval process by the module developer',
  `details_in_modal_url` VARCHAR(255) VISIBLE COMMENT 'job details modal view',
  `details_in_body_url` VARCHAR(255) VISIBLE COMMENT 'job details in body',
  `unique_id_logic_slug` VARCHAR(100) VISIBLE COMMENT 'the slug name which is defined in sys_unique_id_logic',
  `master_grid_name` VARCHAR(255) VISIBLE,
  `custom_query` NVARCHAR(1000) VISIBLE COMMENT 'variable name __USER_ID__',
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE,
  `bulk_approve` DOUBLE VISIBLE DEFAULT 1
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`approval_module_name` IS 'Approval Module Item box name'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`approval_url` IS 'action link which is made for the approval process by the module developer'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`details_in_modal_url` IS 'job details modal view'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`details_in_body_url` IS 'job details in body'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`unique_id_logic_slug` IS 'the slug name which is defined in sys_unique_id_logic'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_approval_modules`.`custom_query` IS 'variable name __USER_ID__'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_audit_trail_historys
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_audit_trail_historys`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_audit_trail_historys` (
  `audit_trail_history_id` DECIMAL(20,0) VISIBLE DEFAULT `APSISERP`.`sys_audit_trail_historys_audit_trail_history_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `table_name` VARCHAR(100) VISIBLE NOT NULL,
  `primary_key_column` VARCHAR(100) VISIBLE NOT NULL,
  `primary_key_id` VARCHAR(100) VISIBLE NOT NULL,
  `master_table_id` VARCHAR(100) VISIBLE,
  `reference_type` VARCHAR(25) VISIBLE NOT NULL,
  `reference_record` NVARCHAR(1000) VISIBLE NOT NULL,
  `log_time` DATETIME(6) VISIBLE NOT NULL,
  `operation_ip` VARCHAR(255) VISIBLE NOT NULL,
  `created_by` DOUBLE VISIBLE NOT NULL,
  `created_at` DATETIME(6) VISIBLE DEFAULT NOW()
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_branchs
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_branchs`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_branchs` (
  `branch_id` INT VISIBLE DEFAULT `APSISERP`.`sys_branchs_branch_id_seq`.`NEXTVAL`  NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `branch_code` VARCHAR(20) VISIBLE,
  `branch_name` VARCHAR(100) VISIBLE NOT NULL,
  `branch_short_name` VARCHAR(5) VISIBLE,
  `parent_branch_id` INT VISIBLE,
  `branch_type` NVARCHAR(1000) VISIBLE DEFAULT 'Branch' ,
  `geo_location_type_id` INT VISIBLE,
  `branch_address` NVARCHAR(1000) VISIBLE,
  `branch_mobile` BIGINT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `branch_manager_id` BIGINT VISIBLE,
  `is_zone` INT VISIBLE,
  `zone_id` INT VISIBLE,
  `division_id` INT VISIBLE,
  `district_id` INT VISIBLE,
  `parent_distance` DECIMAL(6,2) VISIBLE,
  `zone_name` VARCHAR(255) VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_branchs_bkp
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_branchs_bkp`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_branchs_bkp` (
  `branch_id` INT VISIBLE DEFAULT `APSISERP`.`sys_branchs_branch_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `branch_code` VARCHAR(20) VISIBLE,
  `branch_name` VARCHAR(100) VISIBLE NOT NULL,
  `branch_short_name` VARCHAR(5) VISIBLE,
  `parent_branch_id` INT VISIBLE,
  `branch_type` NVARCHAR(1000) VISIBLE DEFAULT 'Branch' ,
  `geo_location_type_id` INT VISIBLE,
  `branch_address` NVARCHAR(1000) VISIBLE,
  `branch_mobile` BIGINT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `branch_manager_id` BIGINT VISIBLE,
  `is_zone` INT VISIBLE,
  `zone_id` INT VISIBLE,
  `division_id` INT VISIBLE,
  `district_id` INT VISIBLE,
  `parent_distance` DECIMAL(6,2) VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_company_modules
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_company_modules`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_company_modules` (
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_companys
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_companys`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_companys` (
  `company_id` INT VISIBLE DEFAULT `APSISERP`.`sys_companys_company_id_seq`.`NEXTVAL` NOT NULL,
  `company_code` VARCHAR(20) VISIBLE NOT NULL,
  `company_name` VARCHAR(50) VISIBLE NOT NULL,
  `company_short_code` VARCHAR(5) VISIBLE,
  `company_logo` VARCHAR(255) VISIBLE,
  `company_address` VARCHAR(100) VISIBLE,
  `company_contact` NVARCHAR(1000) VISIBLE,
  `company_mobile` VARCHAR(20) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_configs
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_configs`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_configs` (
  `config_id` INT VISIBLE NOT NULL,
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `config_slug` VARCHAR(100) VISIBLE NOT NULL,
  `config_key` VARCHAR(100) VISIBLE,
  `config_value` VARCHAR(100) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `test_date` DATETIME VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_currencys
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_currencys`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_currencys` (
  `currency_id` INT VISIBLE DEFAULT `APSISERP`.`sys_currencys_currency_id_seq`.`NEXTVAL` NOT NULL,
  `currency_name` VARCHAR(20) VISIBLE NOT NULL,
  `currency_short_name` VARCHAR(10) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_dashboard_widget_privileges
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_dashboard_widget_privileges`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_dashboard_widget_privileges` (
  `dashboard_widget_id` INT VISIBLE NOT NULL,
  `role_id` INT VISIBLE NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `created_at` DATETIME(6) VISIBLE DEFAULT NOW() NOT NULL,
  `created_by` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_dashboard_widget_users
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_dashboard_widget_users`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_dashboard_widget_users` (
  `dashboard_widget_conf_id` DECIMAL(20,0) VISIBLE DEFAULT `APSISERP`.`sys_dashboard_widget_users_seq_id`.`NEXTVAL` NOT NULL,
  `user_id` DECIMAL(20,0) VISIBLE NOT NULL,
  `dashboard_widget_id` DECIMAL(20,0) VISIBLE NOT NULL,
  `dnd_layout_config` LONGTEXT VISIBLE NOT NULL,
  `module_id` DECIMAL(20,0) VISIBLE NOT NULL
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_dashboard_widgets
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_dashboard_widgets`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_dashboard_widgets` (
  `dashboard_widget_id` DECIMAL(20,0) VISIBLE DEFAULT `APSISERP`.`sys_dashboard_widgets_widget_id_seq`.`NEXTVAL` NOT NULL,
  `widget_slug` VARCHAR(255) VISIBLE NOT NULL,
  `module_id` DECIMAL(20,0) VISIBLE NOT NULL,
  `grid_space` BIGINT VISIBLE DEFAULT 4  NOT NULL,
  `order` INT VISIBLE DEFAULT 0  NOT NULL,
  `title` VARCHAR(255) VISIBLE NOT NULL,
  `subtitle` VARCHAR(255) VISIBLE,
  `additional_subtitle` VARCHAR(255) VISIBLE,
  `widget_type` NVARCHAR(1000) VISIBLE,
  `icon_class` VARCHAR(255) VISIBLE,
  `theme` VARCHAR(255) VISIBLE,
  `select_sql` NVARCHAR(2000) VISIBLE,
  `source_sql` NVARCHAR(2000) VISIBLE,
  `condition_sql` NVARCHAR(1000) VISIBLE,
  `having_sql` NVARCHAR(1000) VISIBLE,
  `groupby_sql` NVARCHAR(1000) VISIBLE,
  `orderby_sql` NVARCHAR(1000) VISIBLE,
  `limit_sql` NVARCHAR(1000) VISIBLE,
  `widget_config` VARCHAR(2000) VISIBLE,
  `status` INT VISIBLE DEFAULT 1  NOT NULL,
  `dnd_layout_config` LONGTEXT VISIBLE,
  `company_id` INT VISIBLE NOT NULL
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_columns
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_columns`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_columns` (
  `delegation_columns_id` BIGINT VISIBLE DEFAULT `APSISERP`.`sys_delegation_columns_delegation_columns_id_seq`.`NEXTVAL` NOT NULL,
  `table_name` VARCHAR(200) VISIBLE,
  `table_field` VARCHAR(200) VISIBLE,
  `table_field_value` VARCHAR(200) VISIBLE DEFAULT NULL,
  `delegation_for` VARCHAR(200) VISIBLE,
  `delegation_ref_event_id` VARCHAR(200) VISIBLE,
  `delegation_version` VARCHAR(100) VISIBLE,
  `delegation_step` BIGINT VISIBLE,
  `delegation_person` BIGINT VISIBLE,
  `delegation_reliever_id` BIGINT VISIBLE,
  `delegation_decline_count` BIGINT VISIBLE DEFAULT 0 NOT NULL,
  `delegation_final_approved` DATETIME VISIBLE,
  `delegation_type` VARCHAR(20) VISIBLE,
  `delegation_initialized` DATETIME VISIBLE,
  `delegation_manual_user` NVARCHAR(1000) VISIBLE,
  `is_manual` INT VISIBLE,
  `count_schedule` BIGINT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 
,
  `purpose` NVARCHAR(1000) VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_conf
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_conf`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_conf` (
  `delegation_conf_id` INT VISIBLE DEFAULT `APSISERP`.`sys_delegation_conf_delegation_conf_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `delegation_for` VARCHAR(50) VISIBLE NOT NULL COMMENT 'for which module or purpose. could be for Purchase or Requistion or sales or anything define by the stackholder. and always select one field in select query.',
  `ref_event_id` VARCHAR(20) VISIBLE NOT NULL COMMENT 'the value of session variable. relation with db table sys_unique_id_logic.session_variable',
  `delegation_version` VARCHAR(100) VISIBLE NOT NULL,
  `manage_by` NVARCHAR(1000) VISIBLE DEFAULT 'Hierarchy' ,
  `user_id` BIGINT VISIBLE,
  `max_limit` BIGINT VISIBLE COMMENT 'the amount of the limit.',
  `limit_type` NVARCHAR(1000) VISIBLE DEFAULT 'Maximum' ,
  `sort_number` BIGINT VISIBLE,
  `same_sort` INT VISIBLE NOT NULL COMMENT 'use for when configuration is sorting and same sort 0=not same sort 1=same sort',
  `step_number` BIGINT VISIBLE,
  `must_approve` INT VISIBLE,
  `approve_priority` NVARCHAR(1000) VISIBLE DEFAULT 'All' COMMENT 'Majority = if maximum people approve; Minority = at least one person approve, All = everyone must approve' ,
  `step_name` VARCHAR(50) VISIBLE COMMENT 'Optional if user like to define any name.',
  `decline_logic` NVARCHAR(1000) VISIBLE DEFAULT 'Initiator' ,
  `designation_id` BIGINT VISIBLE COMMENT 'if manage_by=Designation then this column fire otherwise this coloumn does not work',
  `termination_trigger` VARCHAR(50) VISIBLE,
  `session_variable` NVARCHAR(1000) VISIBLE COMMENT 'Must be a sql to find the termination trigger value. and its dynamic variable always @delegation_person_id which will be replace by current delegation person id',
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`delegation_for` IS 'for which module or purpose. could be for Purchase or Requistion or sales or anything define by the stackholder. and always select one field in select query.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`ref_event_id` IS 'the value of session variable. relation with db table sys_unique_id_logic.session_variable'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`max_limit` IS 'the amount of the limit.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`same_sort` IS 'use for when configuration is sorting and same sort 0=not same sort 1=same sort'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`approve_priority` IS 'Majority = if maximum people approve; Minority = at least one person approve, All = everyone must approve'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`step_name` IS 'Optional if user like to define any name.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`designation_id` IS 'if manage_by=Designation then this column fire otherwise this coloumn does not work'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_conf`.`session_variable` IS 'Must be a sql to find the termination trigger value. and its dynamic variable always @delegation_person_id which will be replace by current delegation person id'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_historys
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_historys`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_historys` (
  `delegation_history_id` DECIMAL(20,0) VISIBLE DEFAULT `APSISERP`.`sys_delegation_historys_id_seq`.`NEXTVAL` NOT NULL,
  `ref_event` VARCHAR(50) VISIBLE,
  `company_id` BIGINT VISIBLE NOT NULL,
  `ref_id` VARCHAR(100) VISIBLE NOT NULL,
  `step_no` BIGINT VISIBLE,
  `act_status` NVARCHAR(1000) VISIBLE NOT NULL,
  `delegation_person` BIGINT VISIBLE NOT NULL,
  `delegation_reliever_id` BIGINT VISIBLE NOT NULL,
  `act_comments` NVARCHAR(1000) VISIBLE,
  `additional_data` NVARCHAR(1000) VISIBLE,
  `delegation_decline_count` BIGINT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 


)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_matrix
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_matrix`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_matrix` (
  `delegation_matrix_id` INT VISIBLE DEFAULT `APSISERP`.`sys_delegation_matrix_delegation_matrix_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `ref_event_id` VARCHAR(255) VISIBLE,
  `delegation_slug` VARCHAR(20) VISIBLE NOT NULL COMMENT 'req_code',
  `dlm_steps` VARCHAR(20) VISIBLE NOT NULL COMMENT 'BM/HoD/CFO',
  `max_limit` DECIMAL(15,2) VISIBLE NOT NULL,
  `limit_type` VARCHAR(20) VISIBLE NOT NULL COMMENT 'Maximum/Above',
  `order_no` INT VISIBLE NOT NULL,
  `delegation_version` VARCHAR(100) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_matrix`.`delegation_slug` IS 'req_code'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_matrix`.`dlm_steps` IS 'BM/HoD/CFO'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_matrix`.`limit_type` IS 'Maximum/Above'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_matrix_logic
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_matrix_logic`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_matrix_logic` (
  `delegation_matrix_logic_id` INT VISIBLE DEFAULT `APSISERP`.`sys_delegation_matrix_logic_delegation_matrix_logic_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `dlm_steps` VARCHAR(20) VISIBLE NOT NULL COMMENT 'BM/HoD/CFO',
  `order_no` INT VISIBLE NOT NULL,
  `logic_sql` NVARCHAR(1000) VISIBLE NOT NULL COMMENT 'two variables->
1. @user_id
2. @branch_id'
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_matrix_logic`.`dlm_steps` IS 'BM/HoD/CFO'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_matrix_logic`.`logic_sql` IS 'two variables->
1. @user_id
2. @branch_id'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_delegation_tracking
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_delegation_tracking`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_delegation_tracking` (
  `delegation_tracking_id` BIGINT VISIBLE DEFAULT `APSISERP`.`sys_delegation_tracking_delegation_tracking_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `ref_id` VARCHAR(100) VISIBLE NOT NULL COMMENT 'delegation job (purchase, sales, lc etc) id or code',
  `delegation_for` VARCHAR(100) VISIBLE NOT NULL COMMENT 'id slug',
  `ref_event_id` VARCHAR(50) VISIBLE COMMENT 'delegation reference id from sys_delegation_conf',
  `delegation_version` VARCHAR(100) VISIBLE COMMENT 'delegation version from sys_delegation_conf',
  `act_status` NVARCHAR(1000) VISIBLE NOT NULL,
  `delegation_start` DATETIME(6) VISIBLE,
  `delegation_end` DATETIME(6) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_tracking`.`ref_id` IS 'delegation job (purchase, sales, lc etc) id or code'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_tracking`.`delegation_for` IS 'id slug'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_tracking`.`ref_event_id` IS 'delegation reference id from sys_delegation_conf'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_delegation_tracking`.`delegation_version` IS 'delegation version from sys_delegation_conf'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_departments
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_departments`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_departments` (
  `department_id` INT VISIBLE DEFAULT `APSISERP`.`sys_departments_department_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `department_code` VARCHAR(20) VISIBLE NOT NULL,
  `department_name` VARCHAR(50) VISIBLE NOT NULL,
  `department_short_code` VARCHAR(5) VISIBLE,
  `department_logo` VARCHAR(255) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_designation
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_designation`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_designation` (
  `designation_id` INT VISIBLE DEFAULT `APSISERP`.`sys_designation_designation_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `designation_code` VARCHAR(20) VISIBLE,
  `designation_name` VARCHAR(150) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_divisions
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_divisions`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_divisions` (
  `division_id` INT VISIBLE DEFAULT `APSISERP`.`sys_divisions_division_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `division_code` VARCHAR(20) VISIBLE NOT NULL,
  `division_name` VARCHAR(50) VISIBLE NOT NULL,
  `division_short_code` VARCHAR(5) VISIBLE,
  `division_logo` VARCHAR(255) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_dropdowns
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_dropdowns`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_dropdowns` (
  `dropdown_id` INT VISIBLE DEFAULT `APSISERP`.`sys_dropdowns_dropdown_id_seq`.`NEXTVAL` NOT NULL,
  `dropdown_name` VARCHAR(50) VISIBLE NOT NULL,
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `dropdown_slug` VARCHAR(50) VISIBLE NOT NULL,
  `dropdown_mode` NVARCHAR(1000) VISIBLE DEFAULT 'dropdown' ,
  `sql_select` NVARCHAR(1000) VISIBLE NOT NULL,
  `sql_source` NVARCHAR(1000) VISIBLE NOT NULL,
  `sql_condition` NVARCHAR(1000) VISIBLE,
  `sql_group_by` NVARCHAR(1000) VISIBLE,
  `sql_having` NVARCHAR(1000) VISIBLE,
  `sql_order_by` NVARCHAR(1000) VISIBLE,
  `sql_limit` NVARCHAR(1000) VISIBLE,
  `value_field` VARCHAR(50) VISIBLE NOT NULL,
  `option_field` VARCHAR(50) VISIBLE NOT NULL,
  `search_columns` NVARCHAR(1000) VISIBLE,
  `description` NVARCHAR(1000) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_features
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_features`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_features` (
  `feature_id` INT VISIBLE DEFAULT `APSISERP`.`sys_features_feature_id_seq`.`NEXTVAL` NOT NULL,
  `feature_name` VARCHAR(100) VISIBLE NOT NULL,
  `feature_slug` VARCHAR(100) VISIBLE NOT NULL COMMENT 'feature function name from controller',
  `parent_feature_id` INT VISIBLE NOT NULL,
  `sort_number` INT VISIBLE NOT NULL,
  `module_id` INT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_features`.`feature_slug` IS 'feature function name from controller'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_form_elements
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_form_elements`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_form_elements` (
  `form_element_id` INT VISIBLE DEFAULT `APSISERP`.`sys_form_elements_form_element_id_seq`.`NEXTVAL` NOT NULL,
  `form_slug` VARCHAR(50) VISIBLE NOT NULL,
  `company_id` INT VISIBLE,
  `form_element_section` VARCHAR(50) VISIBLE NOT NULL,
  `element_column` INT VISIBLE NOT NULL COMMENT 'number of column e.g 2/3/4/5/6',
  `label_name` VARCHAR(50) VISIBLE,
  `label_class` VARCHAR(50) VISIBLE,
  `input_type` VARCHAR(255) VISIBLE NOT NULL,
  `input_name` VARCHAR(50) VISIBLE NOT NULL,
  `input_label` VARCHAR(150) VISIBLE,
  `input_value` VARCHAR(150) VISIBLE,
  `multiple` INT VISIBLE NOT NULL COMMENT '1/0',
  `input_placeholder` VARCHAR(50) VISIBLE,
  `input_id` VARCHAR(50) VISIBLE,
  `input_class` VARCHAR(50) VISIBLE,
  `input_function` NVARCHAR(1000) VISIBLE COMMENT 'put the function name which is defined in form validator helper',
  `element_class` VARCHAR(50) VISIBLE,
  `sort_number` INT VISIBLE NOT NULL,
  `input_expression` VARCHAR(100) VISIBLE COMMENT 'put the regular expression for the input validation',
  `disabled` INT VISIBLE,
  `required` INT VISIBLE,
  `validation_rules` NVARCHAR(1000) VISIBLE,
  `dropdown_slug` VARCHAR(50) VISIBLE,
  `dropdown_options` NVARCHAR(1000) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_elements`.`element_column` IS 'number of column e.g 2/3/4/5/6'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_elements`.`multiple` IS '1/0'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_elements`.`input_function` IS 'put the function name which is defined in form validator helper'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_elements`.`input_expression` IS 'put the regular expression for the input validation'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_form_metas
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_form_metas`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_form_metas` (
  `form_meta_id` INT VISIBLE DEFAULT `APSISERP`.`sys_form_metas_form_meta_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `form_slug` VARCHAR(50) VISIBLE NOT NULL COMMENT 'sys_forms table form slug',
  `reference_id` INT VISIBLE NOT NULL COMMENT 'reference form saved data',
  `input_label` VARCHAR(100) VISIBLE NOT NULL,
  `input_value` VARCHAR(255) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_metas`.`form_slug` IS 'sys_forms table form slug'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_form_metas`.`reference_id` IS 'reference form saved data'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_forms
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_forms`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_forms` (
  `form_id` INT VISIBLE DEFAULT `APSISERP`.`sys_forms_form_id_seq`.`NEXTVAL` NOT NULL,
  `form_slug` VARCHAR(50) VISIBLE NOT NULL,
  `form_title` VARCHAR(255) VISIBLE,
  `company_id` INT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_generated_ids
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_generated_ids`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_generated_ids` (
  `generated_id` INT VISIBLE DEFAULT `APSISERP`.`sys_generated_ids_generated_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `company_code` VARCHAR(20) VISIBLE,
  `slug` VARCHAR(100) VISIBLE NOT NULL COMMENT 'unique id logic slug name',
  `sequential_id` INT VISIBLE COMMENT 'sequential generated id',
  `actual_id` VARCHAR(50) VISIBLE COMMENT 'actual generated id with prefix and others',
  `created_at` DATETIME(6) VISIBLE DEFAULT NOW(),
  `id_token` VARCHAR(20) VISIBLE COMMENT 'id token logic for generated id checking'
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_generated_ids`.`slug` IS 'unique id logic slug name'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_generated_ids`.`sequential_id` IS 'sequential generated id'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_generated_ids`.`actual_id` IS 'actual generated id with prefix and others'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_generated_ids`.`id_token` IS 'id token logic for generated id checking'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_geo_districts
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_geo_districts`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_geo_districts` (
  `geo_district_id` INT VISIBLE /* DEFAULT NULL */ NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `geo_district_name` VARCHAR(100) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 
,
  `geo_division_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_geo_divisions
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_geo_divisions`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_geo_divisions` (
  `geo_division_id` INT VISIBLE /* DEFAULT NULL */ NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `geo_division_name` VARCHAR(100) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_geo_location_types
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_geo_location_types`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_geo_location_types` (
  `geo_location_type_id` INT VISIBLE DEFAULT `APSISERP`.`sys_geo_locations_geo_location_id_seq`.`NEXTVAL`  NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `geo_type_name` VARCHAR(100) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_geo_locations
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_geo_locations`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_geo_locations` (
  `geo_location_id` INT VISIBLE DEFAULT `APSISERP`.`sys_geo_locations_geo_location_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `geo_type` VARCHAR(100) VISIBLE NOT NULL COMMENT 'get geo_type from sys_configs table',
  `division` VARCHAR(100) VISIBLE NOT NULL,
  `district` VARCHAR(100) VISIBLE NOT NULL,
  `thana` VARCHAR(100) VISIBLE NOT NULL,
  `union` VARCHAR(100) VISIBLE,
  `village` VARCHAR(100) VISIBLE,
  `post_office` VARCHAR(100) VISIBLE,
  `post_code` INT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_geo_locations`.`geo_type` IS 'get geo_type from sys_configs table'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_logger_activitys
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_logger_activitys`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_logger_activitys` (
  `logger_activity_id` INT VISIBLE DEFAULT `APSISERP`.`sys_logger_activitys_logger_activity_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE,
  `logger_event` VARCHAR(100) VISIBLE NOT NULL COMMENT 'login/failed',
  `description` NVARCHAR(1000) VISIBLE,
  `user_id` BIGINT VISIBLE,
  `user_type` VARCHAR(100) VISIBLE,
  `route` VARCHAR(255) VISIBLE COMMENT 'ip and url',
  `ip_address` VARCHAR(100) VISIBLE NOT NULL,
  `user_agent` NVARCHAR(1000) VISIBLE NOT NULL,
  `method_type` VARCHAR(20) VISIBLE,
  `created_at` DATETIME(6) VISIBLE,
  `log_out_time` DATETIME(6) VISIBLE,
  `log_out_type` NVARCHAR(1000) VISIBLE,
  `refresh_token` NVARCHAR(1000) VISIBLE,
  `access_token` NVARCHAR(1000) VISIBLE,
  `wrong_login_status` NVARCHAR(1000) VISIBLE DEFAULT '0' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_logger_activitys`.`logger_event` IS 'login/failed'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_logger_activitys`.`route` IS 'ip and url'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_master_grids
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_master_grids`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_master_grids` (
  `master_grid_id` INT VISIBLE DEFAULT `APSISERP`.`sys_master_grids_master_grid_id_seq`.`NEXTVAL` NOT NULL,
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `master_grid_slug` VARCHAR(50) VISIBLE NOT NULL,
  `master_entry_name` VARCHAR(50) VISIBLE COMMENT 'sys_master_entrys',
  `master_entry_url` VARCHAR(200) VISIBLE,
  `master_grid_title` VARCHAR(100) VISIBLE,
  `master_column_title` NVARCHAR(2000) VISIBLE,
  `sql_select` NVARCHAR(2000) VISIBLE NOT NULL COMMENT 'SQL STATEMNTS',
  `sql_source` NVARCHAR(2000) VISIBLE NOT NULL COMMENT 'SQL STATEMNTS',
  `sql_condition` NVARCHAR(1000) VISIBLE COMMENT 'SQL STATEMNTS',
  `sql_group_by` NVARCHAR(1000) VISIBLE COMMENT 'SQL STATEMNTS',
  `sql_having` NVARCHAR(1000) VISIBLE COMMENT 'SQL STATEMNTS',
  `sql_order_by` NVARCHAR(1000) VISIBLE COMMENT 'SQL STATEMNTS',
  `sql_limit` NVARCHAR(1000) VISIBLE,
  `action_table` VARCHAR(50) VISIBLE NOT NULL COMMENT 'main grid table working on',
  `primary_key_field` VARCHAR(50) VISIBLE NOT NULL COMMENT 'action table primary key field',
  `data_link` VARCHAR(100) VISIBLE,
  `status_field` VARCHAR(100) VISIBLE,
  `search_panel_slug` VARCHAR(50) VISIBLE,
  `hide_col_position` VARCHAR(100) VISIBLE,
  `search_columns` NVARCHAR(1000) VISIBLE,
  `tr_data_attr` NVARCHAR(1000) VISIBLE,
  `enable_form` INT VISIBLE DEFAULT '0' ,
  `is_selectable` INT VISIBLE DEFAULT '0' ,
  `additional_grid` VARCHAR(50) VISIBLE,
  `export_excel` INT VISIBLE DEFAULT '0' ,
  `export_pdf` INT VISIBLE DEFAULT '0' ,
  `export_csv` INT VISIBLE DEFAULT '0' ,
  `export_printing` INT VISIBLE DEFAULT '0' ,
  `client_side` INT VISIBLE DEFAULT '0' ,
  `page_customize` NVARCHAR(1000) VISIBLE,
  `grid_checkbox` INT VISIBLE DEFAULT '0' ,
  `grid_serial` INT VISIBLE DEFAULT '0' ,
  `tagg_html` INT VISIBLE DEFAULT '0' ,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 
,
  `default_data` TINYINT VISIBLE DEFAULT 1 COMMENT 'master grid load with data or not data'
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`master_entry_name` IS 'sys_master_entrys'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_select` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_source` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_condition` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_group_by` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_having` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`sql_order_by` IS 'SQL STATEMNTS'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`action_table` IS 'main grid table working on'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`primary_key_field` IS 'action table primary key field'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_master_grids`.`default_data` IS 'master grid load with data or not data'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_menus
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_menus`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_menus` (
  `menu_id` INT VISIBLE DEFAULT `APSISERP`.`sys_menus_menu_id_seq`.`NEXTVAL`   NOT NULL,
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `menu_name` VARCHAR(100) VISIBLE NOT NULL,
  `menu_description` VARCHAR(100) VISIBLE,
  `menu_icon_class` VARCHAR(100) VISIBLE NOT NULL,
  `menu_url` VARCHAR(100) VISIBLE NOT NULL COMMENT 'after base url',
  `parent_menu_id` INT VISIBLE NOT NULL,
  `sort_number` INT VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1'
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_menus`.`menu_url` IS 'after base url'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_modules
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_modules`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_modules` (
  `module_id` BIGINT VISIBLE DEFAULT `APSISERP`.`sys_modules_module_id_seq`.`NEXTVAL` NOT NULL,
  `module_name` VARCHAR(100) VISIBLE NOT NULL,
  `module_icon` VARCHAR(100) VISIBLE NOT NULL,
  `module_lang` VARCHAR(100) VISIBLE,
  `module_url` VARCHAR(100) VISIBLE NOT NULL COMMENT 'value only after base url. Should not use the full URL',
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_modules`.`module_url` IS 'value only after base url. Should not use the full URL'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_pdf_templates
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_pdf_templates`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_pdf_templates` (
  `pdf_templates_id` INT VISIBLE DEFAULT `APSISERP`.`sys_pdf_templates_pdf_templates_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `template_slug` VARCHAR(200) VISIBLE,
  `module_id` INT VISIBLE,
  `template_title` VARCHAR(255) VISIBLE,
  `template_content` NVARCHAR(1000) VISIBLE,
  `template_watermark` NVARCHAR(1000) VISIBLE,
  `template_ref_function` VARCHAR(255) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_events
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_events`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_events` (
  `event_id` INT VISIBLE DEFAULT `APSISERP`.`sys_privilege_events_event_id_seq`.`NEXTVAL` NOT NULL,
  `event_slug` VARCHAR(100) VISIBLE NOT NULL COMMENT 'A Name to identify the event. Must be meaningful. Could be duplicate. But all those duplicate for the same action. That means if multiple record found for any particular action all must be consider for access control.',
  `event_ref` NVARCHAR(1000) VISIBLE DEFAULT 'sys_dropdowns' Comment 'dropdown or grid' ,
  `event_key` NVARCHAR(1000) VISIBLE NOT NULL COMMENT 'user_level or department or something which is stored in Session.Could be logical input. such as : Department OR Designation Department And Designation',
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `company_id` INT VISIBLE,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_privilege_events`.`event_slug` IS 'A Name to identify the event. Must be meaningful. Could be duplicate. But all those duplicate for the same action. That means if multiple record found for any particular action all must be consider for access control.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_privilege_events`.`event_ref` IS 'dropdown or grid'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_privilege_events`.`event_key` IS 'user_level or department or something which is stored in Session.Could be logical input. such as : Department OR Designation Department And Designation'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_features
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_features`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_features` (
  `role_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `feature_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_item_users
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_item_users`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_item_users` (
  `privilege_item_user_id` DECIMAL(20,0) VISIBLE DEFAULT `APSISERP`.`sys_privilege_item_user_id_seq`.`NEXTVAL` NOT NULL,
  `reference_userid` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `event_ref` NVARCHAR(1000) VISIBLE DEFAULT 'sys_dropdowns' ,
  `event_slug` VARCHAR(100) VISIBLE NOT NULL,
  `event_slug_key` VARCHAR(100) VISIBLE NOT NULL,
  `permission` NVARCHAR(1000) VISIBLE NOT NULL,
  `no_permission` NVARCHAR(1000) VISIBLE,
  `sql_where_clause` NVARCHAR(1000) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_items
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_items`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_items` (
  `privilege_item_id` INT VISIBLE DEFAULT `APSISERP`.`sys_privilege_items_privilege_item_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `event_id` INT VISIBLE NOT NULL,
  `reference_value` VARCHAR(100) VISIBLE NOT NULL,
  `sql_where_clause` NVARCHAR(1000) VISIBLE,
  `event_slug_key` VARCHAR(100) VISIBLE NOT NULL COMMENT 'the name of the field for which the value will check',
  `permission` NVARCHAR(1000) VISIBLE COMMENT 'for which this permission has settings',
  `no_permission` NVARCHAR(1000) VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_privilege_items`.`event_slug_key` IS 'the name of the field for which the value will check'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_privilege_items`.`permission` IS 'for which this permission has settings'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_menus
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_menus`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_menus` (
  `menu_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `role_id` INT VISIBLE,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `previlege_menu_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_modules
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_modules`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_modules` (
  `module_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `user_id` BIGINT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_privilege_roles
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_privilege_roles`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_privilege_roles` (
  `role_id` INT VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `user_id` BIGINT VISIBLE,
  `created_by` BIGINT VISIBLE,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_roles
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_roles`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_roles` (
  `role_id` INT VISIBLE DEFAULT `APSISERP`.`sys_roles_role_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `module_id` INT VISIBLE,
  `role_name` VARCHAR(50) VISIBLE NOT NULL,
  `description` NVARCHAR(1000) VISIBLE,
  `min_username_length` INT VISIBLE NOT NULL COMMENT 'default 8 char username ',
  `max_username_length` INT VISIBLE NOT NULL COMMENT 'maximum allowed char in the username',
  `multi_login_allow` INT VISIBLE NOT NULL COMMENT 'default not allow',
  `max_wrong_login_attemp` BIGINT VISIBLE NOT NULL COMMENT 'action perform after 3 time wrong password. 0 for unlimited try',
  `wrong_login_attemp` NVARCHAR(1000) VISIBLE DEFAULT 'No Restriction' ,
  `block_period` INT VISIBLE DEFAULT 5 COMMENT 'minute number for login block if wrong login attempt is blocked for a period',
  `session_time_out` INT VISIBLE DEFAULT 30 Comment '30 min is the default time. input must be in minuite. For unlimited session please input 0',
  `password_regex` VARCHAR(255) VISIBLE NOT NULL,
  `password_regex_error_msg` VARCHAR(255) VISIBLE NOT NULL,
  `password_expiry_notify` INT VISIBLE DEFAULT 15 Comment 'How many days earlier notify will activated.',
  `password_expiry_duration` INT VISIBLE DEFAULT 90 Comment '90 days is the default. input must be in day. Use 0 for unlimited validity',
  `password_expiry_action` NVARCHAR(1000) VISIBLE DEFAULT 'Notify' ,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`min_username_length` IS 'default 8 char username '; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`max_username_length` IS 'maximum allowed char in the username'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`multi_login_allow` IS 'default not allow'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`max_wrong_login_attemp` IS 'action perform after 3 time wrong password. 0 for unlimited try'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`block_period` IS 'minute number for login block if wrong login attempt is blocked for a period'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`session_time_out` IS '30 min is the default time. input must be in minuite. For unlimited session please input 0'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`password_expiry_notify` IS 'How many days earlier notify will activated.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_roles`.`password_expiry_duration` IS '90 days is the default. input must be in day. Use 0 for unlimited validity'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_search_panel_details
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_search_panel_details`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_search_panel_details` (
  `search_panel_detail_id` INT VISIBLE DEFAULT `APSISERP`.`sys_search_panel_details_search_panel_detail_id_seq`.`NEXTVAL` NOT NULL,
  `search_panel_slug` VARCHAR(50) VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `column_space` INT VISIBLE DEFAULT '3' ,
  `label_name` VARCHAR(50) VISIBLE NOT NULL,
  `label_class` VARCHAR(50) VISIBLE,
  `input_type` NVARCHAR(1000) VISIBLE DEFAULT 'NVARCHAR2(1000)' ,
  `input_name` VARCHAR(100) VISIBLE NOT NULL,
  `input_default_val` VARCHAR(100) VISIBLE,
  `input_id` VARCHAR(100) VISIBLE,
  `input_class` VARCHAR(100) VISIBLE,
  `input_placeholder` VARCHAR(100) VISIBLE,
  `input_operation_type` NVARCHAR(1000) VISIBLE DEFAULT 'WHERE LIKE' ,
  `single_compare` INT VISIBLE DEFAULT '0' ,
  `sorting` INT VISIBLE DEFAULT '0' ,
  `required` INT VISIBLE DEFAULT '0' ,
  `dropdown_slug` VARCHAR(255) VISIBLE,
  `dropdown_options` NVARCHAR(1000) VISIBLE NOT NULL,
  `multiple` INT VISIBLE DEFAULT '0' ,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_search_panels
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_search_panels`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_search_panels` (
  `search_panel_id` INT VISIBLE DEFAULT `APSISERP`.`sys_search_panels_search_panel_id_seq`.`NEXTVAL` NOT NULL,
  `search_panel_slug` VARCHAR(50) VISIBLE NOT NULL,
  `search_panel_title` VARCHAR(100) VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `default_search_by` VARCHAR(200) VISIBLE NOT NULL,
  `description` NVARCHAR(1000) VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_status_flows
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_status_flows`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_status_flows` (
  `status_flow_id` INT VISIBLE DEFAULT `APSISERP`.`sys_status_flows_status_flow_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `status_flow_slug` VARCHAR(100) VISIBLE NOT NULL COMMENT 'unique status flow slug name',
  `status_flows_name` VARCHAR(100) VISIBLE NOT NULL COMMENT 'Must be within 40 char.',
  `description` NVARCHAR(1000) VISIBLE,
  `parent_status_id` INT VISIBLE COMMENT 'if Null That will be the parent status',
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_status_flows`.`status_flow_slug` IS 'unique status flow slug name'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_status_flows`.`status_flows_name` IS 'Must be within 40 char.'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_status_flows`.`parent_status_id` IS 'if Null That will be the parent status'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_timelines
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_timelines`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_timelines` (
  `timeline_id` BIGINT VISIBLE DEFAULT `APSISERP`.`sys_timelines_timeline_id_seq`.`NEXTVAL`  NOT NULL,
  `ref_slug` NVARCHAR(200) VISIBLE NOT NULL,
  `ref_value` BIGINT VISIBLE NOT NULL,
  `status_flow_id` BIGINT VISIBLE,
  `current_branch_id` BIGINT VISIBLE,
  `current_department_id` BIGINT VISIBLE,
  `current_location` NVARCHAR(1000) VISIBLE,
  `track_time` DATETIME(6) VISIBLE,
  `company_id` BIGINT VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1'
)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_unique_id_logics
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_unique_id_logics`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_unique_id_logics` (
  `unique_id_logic_id` INT VISIBLE DEFAULT `APSISERP`.`sys_unique_id_logics_unique_id_logic_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `id_for` VARCHAR(50) VISIBLE NOT NULL COMMENT 'A unique name why system need id$1',
  `slug` VARCHAR(100) VISIBLE NOT NULL COMMENT 'Unique identifier name',
  `id_length` INT VISIBLE DEFAULT 6 COMMENT 'default 6 digit ID',
  `id_format` VARCHAR(100) VISIBLE NOT NULL COMMENT 'unique id generation format',
  `token_reset_logic` VARCHAR(100) VISIBLE NOT NULL COMMENT 'YY=1,MM=0.BR=1, if 1 then id sequence will be start from begining for that change',
  `starting_id` INT VISIBLE DEFAULT 1 COMMENT 'Default startting id for unique id logic(Default 1)',
  `delegation_trigger` VARCHAR(50) VISIBLE DEFAULT 'SQL' COMMENT 'any thing define by the user. could be department or designation or location',
  `delegation_type` NVARCHAR(1000) VISIBLE DEFAULT 'WF' ,
  `session_variable` VARCHAR(50) VISIBLE,
  `trigger_sql` NVARCHAR(1000) VISIBLE,
  `ref_event_slug` NVARCHAR(1000) VISIBLE,
  `delegation_version` VARCHAR(100) VISIBLE DEFAULT 1 COMMENT 'current version should update every time while new process flow define',
  `operation_function` VARCHAR(100) VISIBLE COMMENT 'the name of function (placed in delegationHelper) where the status change occure additional operation during the final approval or status change',
  `draft_status` INT VISIBLE NOT NULL COMMENT 'an id from sys_status_flow table',
  `after_approve_status` INT VISIBLE NOT NULL COMMENT 'an id from sys_status_flow table',
  `initiate_approve_status` INT VISIBLE NOT NULL COMMENT 'an id from sys_status_flow table',
  `after_decline_status` INT VISIBLE NOT NULL COMMENT 'an id from sys_status_flow table',
  `ref_db_table_name` VARCHAR(100) VISIBLE COMMENT 'database table name where the delegation information has to update',
  `ref_id_field` VARCHAR(100) VISIBLE COMMENT 'could be primary key field name or the unique key field name of the referance db table',
  `ref_status_field` VARCHAR(100) VISIBLE COMMENT 'referance db table delegation status field',
  `sql_calc_amount` NVARCHAR(1000) VISIBLE,
  `function_delegation_initialize` VARCHAR(255) VISIBLE COMMENT 'a custom function when delegation start first time',
  `function_delegation_approved` VARCHAR(255) VISIBLE COMMENT 'a custom function when delegation completed or final approved',
  `function_delegation_declined` VARCHAR(255) VISIBLE COMMENT 'a custom function when delegation decline to draft status',
  `status` INT VISIBLE,
  `module_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`id_for` IS 'A unique name why system need id$1'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`slug` IS 'Unique identifier name'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`id_length` IS 'default 6 digit ID'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`id_format` IS 'unique id generation format'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`token_reset_logic` IS 'YY=1,MM=0.BR=1, if 1 then id sequence will be start from begining for that change'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`starting_id` IS 'Default startting id for unique id logic(Default 1)'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`delegation_trigger` IS 'any thing define by the user. could be department or designation or location'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`delegation_version` IS 'current version should update every time while new process flow define'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`operation_function` IS 'the name of function (placed in delegationHelper) where the status change occure additional operation during the final approval or status change'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`draft_status` IS 'an id from sys_status_flow table'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`after_approve_status` IS 'an id from sys_status_flow table'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`initiate_approve_status` IS 'an id from sys_status_flow table'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`after_decline_status` IS 'an id from sys_status_flow table'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`ref_db_table_name` IS 'database table name where the delegation information has to update'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`ref_id_field` IS 'could be primary key field name or the unique key field name of the referance db table'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`ref_status_field` IS 'referance db table delegation status field'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`function_delegation_initialize` IS 'a custom function when delegation start first time'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`function_delegation_approved` IS 'a custom function when delegation completed or final approved'; */
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_unique_id_logics`.`function_delegation_declined` IS 'a custom function when delegation decline to draft status'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_user_tokens
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_user_tokens`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_user_tokens` (
  `user_token_id` INT VISIBLE DEFAULT `APSISERP`.`sys_user_tokens_user_token_id_seq`.`NEXTVAL` NOT NULL,
  `company_id` INT VISIBLE NOT NULL,
  `user_id` BIGINT VISIBLE NOT NULL,
  `refresh_token` VARCHAR(255) VISIBLE NOT NULL,
  `refresh_token_expiry_date` DATETIME VISIBLE NOT NULL,
  `access_token` NVARCHAR(1000) VISIBLE NOT NULL,
  `ip_address` VARCHAR(100) VISIBLE NOT NULL,
  `created_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' 

)
DISABLE ROW MOVEMENT
;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** or sys_users
-- SQLINES DEMO *** -----------
DROP TABLE `APSISERP`.`sys_users`;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE `APSISERP`.`sys_users` (
  `user_id` BIGINT VISIBLE DEFAULT `APSISERP`.`sys_users_user_id_seq`.`NEXTVAL`  NOT NULL,
  `user_code` VARCHAR(20) VISIBLE NOT NULL,
  `is_employee` TINYINT VISIBLE,
  `user_name` VARCHAR(100) VISIBLE NOT NULL,
  `email` VARCHAR(100) VISIBLE NOT NULL,
  `password` VARCHAR(100) VISIBLE NOT NULL,
  `full_name` VARCHAR(100) VISIBLE NOT NULL,
  `mobile` VARCHAR(20) VISIBLE,
  `company_id` INT VISIBLE NOT NULL,
  `date_of_birth` DATETIME VISIBLE,
  `verified_at` DATETIME(6) VISIBLE,
  `gender` NVARCHAR(1000) VISIBLE,
  `user_image` VARCHAR(100) VISIBLE,
  `password_reset_token` VARCHAR(255) VISIBLE,
  `password_reset_token_expiry_date` DATETIME(6) VISIBLE,
  `branch_id` INT VISIBLE NOT NULL,
  `department_id` INT VISIBLE,
  `division_id` INT VISIBLE,
  `default_module_id` INT VISIBLE COMMENT 'default module id for the user',
  `is_reliever` INT VISIBLE,
  `reliever_to` BIGINT VISIBLE,
  `reliever_start_datetime` DATETIME(6) VISIBLE,
  `reliever_end_datetime` DATETIME(6) VISIBLE,
  `line_manager_id` BIGINT VISIBLE NOT NULL,
  `created_by` BIGINT VISIBLE NOT NULL,
  `updated_by` BIGINT VISIBLE,
  `deleted_by` BIGINT VISIBLE,
  `created_at` DATETIME(6) VISIBLE NOT NULL,
  `updated_at` DATETIME(6) VISIBLE,
  `deleted_at` DATETIME(6) VISIBLE,
  `status` INT VISIBLE DEFAULT '1' ,
  `designation_id` INT VISIBLE DEFAULT NULL,
  `functional_designation_id` INT VISIBLE
)
DISABLE ROW MOVEMENT
;
/* Moved to CREATE TABLE
COMMENT ON COLUMN `APSISERP`.`sys_users`.`default_module_id` IS 'default module id for the user'; */

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_action_buttons
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `sys_action_buttons_pkey` PRIMARY KEY (`action_btn_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_action_buttons
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `SYS_C0019335` CHECK (`action_btn_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `SYS_C0019336` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `SYS_C0019337` CHECK (`btn_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `SYS_C0019338` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `SYS_C0019339` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_action_buttons` ADD CONSTRAINT `sys_action_buttons_btn_type_check` CHECK (`btn_type` IN ('button' , 'link' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_action_buttons
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_action_buttons_company_id_index`
  ON `APSISERP`.`sys_action_buttons` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_approval_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `sys_approval_modules_pkey` PRIMARY KEY (`approval_module_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_approval_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019340` CHECK (`approval_module_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019341` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019342` CHECK (`approval_module_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019343` CHECK (`icon_class` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019344` CHECK (`approval_url` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019345` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_approval_modules` ADD CONSTRAINT `SYS_C0019346` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_approval_modules
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_approval_modules_company_id_index`
  ON `APSISERP`.`sys_approval_modules` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_audit_trail_historys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `sys_audit_trail_historys_pkey` PRIMARY KEY (`audit_trail_history_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_audit_trail_historys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019347` CHECK (`audit_trail_history_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019348` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019349` CHECK (`table_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019350` CHECK (`primary_key_column` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019351` CHECK (`primary_key_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019352` CHECK (`reference_type` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019353` CHECK (`reference_record` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019354` CHECK (`log_time` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019355` CHECK (`operation_ip` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_audit_trail_historys` ADD CONSTRAINT `SYS_C0019356` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_audit_trail_historys
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_audit_trail_historys_company_id_index`
  ON `APSISERP`.`sys_audit_trail_historys` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_branchs
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050378` PRIMARY KEY (`branch_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_branchs
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050369` CHECK (`branch_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050370` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050371` CHECK (`branch_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050372` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050373` CHECK (`branch_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050374` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050375` CHECK (`branch_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050376` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs` ADD CONSTRAINT `SYS_C0050377` CHECK (`branch_type` IN ('Branch' , 'Uposhakha' , 'Head office' , 'Corporate Branch' , 'Principal Branch' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_branchs
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_company_id_index_copy1`
  ON `APSISERP`.`sys_branchs` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_geo_location_id_index_copy1`
  ON `APSISERP`.`sys_branchs` (`geo_location_type_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_parent_branch_id_index_copy1`
  ON `APSISERP`.`sys_branchs` (`parent_branch_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_branchs_bkp
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `sys_branchs_pkey` PRIMARY KEY (`branch_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_branchs_bkp
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `SYS_C0019357` CHECK (`branch_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `SYS_C0019358` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `SYS_C0019359` CHECK (`branch_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `SYS_C0019360` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_branchs_bkp` ADD CONSTRAINT `sys_branchs_branch_type_check` CHECK (`branch_type` IN ('Branch' , 'Uposhakha' , 'Head office' , 'Corporate Branch' , 'Principal Branch' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_branchs_bkp
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_company_id_index`
  ON `APSISERP`.`sys_branchs_bkp` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_geo_location_id_index`
  ON `APSISERP`.`sys_branchs_bkp` (`geo_location_type_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_branchs_parent_branch_id_index`
  ON `APSISERP`.`sys_branchs_bkp` (`parent_branch_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_company_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_company_modules` ADD CONSTRAINT `uk_company_modules` UNIQUE (`module_id`, `company_id`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_company_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_company_modules` ADD CONSTRAINT `SYS_C0019361` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_company_modules
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_company_modules_company_id_index`
  ON `APSISERP`.`sys_company_modules` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_company_modules_module_id_index`
  ON `APSISERP`.`sys_company_modules` (`module_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_companys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019715` PRIMARY KEY (`company_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_companys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019362` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019363` CHECK (`company_code` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019364` CHECK (`company_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019365` CHECK (`company_mobile` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019366` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_companys` ADD CONSTRAINT `SYS_C0019367` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_configs
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019914` PRIMARY KEY (`config_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_configs
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019368` CHECK (`config_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019369` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019370` CHECK (`config_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019371` CHECK (`config_value` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019372` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_configs` ADD CONSTRAINT `SYS_C0019373` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_configs
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_configs_company_id_index`
  ON `APSISERP`.`sys_configs` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_configs_module_id_index`
  ON `APSISERP`.`sys_configs` (`module_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_currencys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `sys_currencys_pkey` PRIMARY KEY (`currency_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_currencys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `SYS_C0019379` CHECK (`currency_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `SYS_C0019380` CHECK (`currency_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `SYS_C0019381` CHECK (`currency_short_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `SYS_C0019382` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_currencys` ADD CONSTRAINT `SYS_C0019383` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_dashboard_widget_privileges
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widget_privileges` ADD CONSTRAINT `SYS_C0058633` CHECK (`dashboard_widget_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_privileges` ADD CONSTRAINT `SYS_C0058634` CHECK (`role_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_privileges` ADD CONSTRAINT `SYS_C0058635` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_privileges` ADD CONSTRAINT `SYS_C0058636` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_dashboard_widget_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050362` PRIMARY KEY (`dashboard_widget_conf_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_dashboard_widget_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050361` CHECK (`dashboard_widget_conf_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050364` CHECK (`user_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050365` CHECK (`dashboard_widget_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050367` CHECK (`dnd_layout_config` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widget_users` ADD CONSTRAINT `SYS_C0050368` CHECK (`module_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_dashboard_widgets
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050035` PRIMARY KEY (`dashboard_widget_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_dashboard_widgets
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `sys_dashboard_widgets_widget_slug` UNIQUE (`widget_slug`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_dashboard_widgets
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050031` CHECK (`grid_space` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050032` CHECK (`order` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050033` CHECK (`status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050037` CHECK (`widget_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050038` CHECK (`module_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0050039` CHECK (`title` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `SYS_C0059002` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dashboard_widgets` ADD CONSTRAINT `sys_dashboard_widgets_widget_types` CHECK (`widget_type` IN ('Line' , 'Map' , 'Area' , 'Column','Bar','Pie','Card' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_columns
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_columns` ADD CONSTRAINT `sys_delegation_columns_pkey` PRIMARY KEY (`delegation_columns_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_columns
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_columns` ADD CONSTRAINT `SYS_C0019384` CHECK (`delegation_columns_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_columns` ADD CONSTRAINT `SYS_C0019385` CHECK (`delegation_decline_count` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_columns` ADD CONSTRAINT `SYS_C0019386` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_columns` ADD CONSTRAINT `SYS_C0019387` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_conf
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `sys_delegation_conf_pkey` PRIMARY KEY (`delegation_conf_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_conf
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019388` CHECK (`delegation_conf_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019389` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019390` CHECK (`delegation_for` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019391` CHECK (`ref_event_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019392` CHECK (`delegation_version` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019393` CHECK (`same_sort` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019394` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `SYS_C0019395` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `sys_delegation_conf_approve_priority_check` CHECK (`approve_priority` IN ('Majority' , 'Minority' , 'All' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `sys_delegation_conf_decline_logic_check` CHECK (`decline_logic` IN ('Previous Approval' , 'Initiator' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `sys_delegation_conf_limit_type_check` CHECK (`limit_type` IN ('Maximum' , 'Above' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_conf` ADD CONSTRAINT `sys_delegation_conf_manage_by_check` CHECK (`manage_by` IN ('Hierarchy' , 'Sorting' , 'Limit' , 'Designation' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_delegation_conf
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_delegation_conf_company_id_index`
  ON `APSISERP`.`sys_delegation_conf` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_historys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039292` PRIMARY KEY (`delegation_history_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_historys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039284` CHECK (`delegation_history_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039285` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039286` CHECK (`ref_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039287` CHECK (`act_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039288` CHECK (`delegation_person` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039289` CHECK (`delegation_reliever_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039290` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_historys` ADD CONSTRAINT `SYS_C0039291` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_matrix
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `sys_delegation_matrix_pkey` PRIMARY KEY (`delegation_matrix_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_matrix
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019403` CHECK (`delegation_matrix_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019404` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019405` CHECK (`delegation_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019406` CHECK (`dlm_steps` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019407` CHECK (`max_limit` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019408` CHECK (`limit_type` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019409` CHECK (`order_no` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019410` CHECK (`delegation_version` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019411` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix` ADD CONSTRAINT `SYS_C0019412` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_delegation_matrix
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_delegation_matrix_company_id_index`
  ON `APSISERP`.`sys_delegation_matrix` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_matrix_logic
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `sys_delegation_matrix_logic_pkey` PRIMARY KEY (`delegation_matrix_logic_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_matrix_logic
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `SYS_C0019413` CHECK (`delegation_matrix_logic_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `SYS_C0019414` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `SYS_C0019415` CHECK (`dlm_steps` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `SYS_C0019416` CHECK (`order_no` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_matrix_logic` ADD CONSTRAINT `SYS_C0019417` CHECK (`logic_sql` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_delegation_matrix_logic
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_delegation_matrix_logic_company_id_index`
  ON `APSISERP`.`sys_delegation_matrix_logic` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_delegation_tracking
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `sys_delegation_tracking_pkey` PRIMARY KEY (`delegation_tracking_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_delegation_tracking
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019418` CHECK (`delegation_tracking_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019419` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019420` CHECK (`ref_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019421` CHECK (`delegation_for` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019422` CHECK (`act_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019423` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `SYS_C0019424` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_delegation_tracking` ADD CONSTRAINT `sys_delegation_tracking_act_status_check` CHECK (`act_status` IN ('Approved' , 'Declined' , 'Canceled' , 'Processing' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_delegation_tracking
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_delegation_tracking_company_id_index`
  ON `APSISERP`.`sys_delegation_tracking` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_departments
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `sys_departments_pkey` PRIMARY KEY (`department_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_departments
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019425` CHECK (`department_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019426` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019427` CHECK (`department_code` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019428` CHECK (`department_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019429` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_departments` ADD CONSTRAINT `SYS_C0019430` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_departments
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_departments_company_id_index`
  ON `APSISERP`.`sys_departments` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_designation
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `sys_designation_pkey` PRIMARY KEY (`designation_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_designation
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `SYS_C0019431` CHECK (`designation_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `SYS_C0019432` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `SYS_C0019434` CHECK (`designation_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `SYS_C0019435` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_designation` ADD CONSTRAINT `SYS_C0019436` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_designation
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_designation_company_id_index`
  ON `APSISERP`.`sys_designation` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_divisions
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `sys_divisions_pkey` PRIMARY KEY (`division_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_divisions
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019437` CHECK (`division_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019438` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019439` CHECK (`division_code` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019440` CHECK (`division_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019441` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_divisions` ADD CONSTRAINT `SYS_C0019442` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_divisions
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_divisions_company_id_index`
  ON `APSISERP`.`sys_divisions` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_dropdowns
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `sys_dropdowns_pkey` PRIMARY KEY (`dropdown_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_dropdowns
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019443` CHECK (`dropdown_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019444` CHECK (`dropdown_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019445` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019446` CHECK (`dropdown_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019447` CHECK (`sql_select` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019448` CHECK (`sql_source` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019449` CHECK (`value_field` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019450` CHECK (`option_field` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019451` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `SYS_C0019452` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_dropdowns` ADD CONSTRAINT `sys_dropdowns_dropdown_mode_check` CHECK (`dropdown_mode` IN ('dropdown' , 'autocomplete_suggest' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_dropdowns
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_dropdowns_company_id_index`
  ON `APSISERP`.`sys_dropdowns` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_features
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `sys_features_pkey` PRIMARY KEY (`feature_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_features
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019453` CHECK (`feature_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019454` CHECK (`feature_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019455` CHECK (`feature_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019456` CHECK (`parent_feature_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019457` CHECK (`sort_number` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019458` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_features` ADD CONSTRAINT `SYS_C0019459` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_features
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_features_module_id_index`
  ON `APSISERP`.`sys_features` (`module_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_form_elements
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `sys_form_elements_pk` PRIMARY KEY (`form_element_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_form_elements
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019460` CHECK (`form_element_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019461` CHECK (`form_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019462` CHECK (`form_element_section` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019463` CHECK (`element_column` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019465` CHECK (`input_type` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019466` CHECK (`input_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019467` CHECK (`multiple` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019468` CHECK (`sort_number` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019469` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_elements` ADD CONSTRAINT `SYS_C0019470` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_form_metas
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `sys_form_metas_pkey` PRIMARY KEY (`form_meta_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_form_metas
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019471` CHECK (`form_meta_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019472` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019473` CHECK (`form_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019474` CHECK (`reference_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019475` CHECK (`input_label` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019476` CHECK (`input_value` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019477` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_form_metas` ADD CONSTRAINT `SYS_C0019478` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_form_metas
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_form_metas_company_id_index`
  ON `APSISERP`.`sys_form_metas` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_forms
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_forms` ADD CONSTRAINT `sys_forms_pkey` PRIMARY KEY (`form_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_forms
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_forms` ADD CONSTRAINT `SYS_C0019479` CHECK (`form_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_forms` ADD CONSTRAINT `SYS_C0019480` CHECK (`form_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_forms` ADD CONSTRAINT `SYS_C0019481` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_forms` ADD CONSTRAINT `SYS_C0019482` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_forms
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_forms_company_id_index`
  ON `APSISERP`.`sys_forms` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_generated_ids
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_generated_ids` ADD CONSTRAINT `sys_generated_ids_pkey` PRIMARY KEY (`generated_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_generated_ids
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_generated_ids` ADD CONSTRAINT `SYS_C0019483` CHECK (`generated_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_generated_ids` ADD CONSTRAINT `SYS_C0019484` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_generated_ids` ADD CONSTRAINT `SYS_C0019485` CHECK (`slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_generated_ids
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_generated_ids_company_code_index`
  ON `APSISERP`.`sys_generated_ids` (`company_code` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_generated_ids_company_id_index`
  ON `APSISERP`.`sys_generated_ids` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_generated_ids_slug_index`
  ON `APSISERP`.`sys_generated_ids` (`slug` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_geo_districts
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050360` PRIMARY KEY (`geo_district_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_geo_districts
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050339` CHECK (`geo_district_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050340` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050341` CHECK (`geo_district_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050342` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050343` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050344` CHECK (`geo_district_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050345` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050346` CHECK (`geo_district_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050347` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050348` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050349` CHECK (`geo_district_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050350` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050351` CHECK (`geo_district_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050352` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050353` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050354` CHECK (`geo_district_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050355` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050356` CHECK (`geo_district_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050357` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_districts` ADD CONSTRAINT `SYS_C0050358` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_geo_districts
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_geo_locations_company_id_index_copy1_copy1_copy1`
  ON `APSISERP`.`sys_geo_districts` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_geo_divisions
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050338` PRIMARY KEY (`geo_division_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_geo_divisions
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050321` CHECK (`geo_division_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050322` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050323` CHECK (`geo_division_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050324` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050325` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050326` CHECK (`geo_division_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050327` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050328` CHECK (`geo_division_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050329` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050330` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050331` CHECK (`geo_division_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050332` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050333` CHECK (`geo_division_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050334` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_divisions` ADD CONSTRAINT `SYS_C0050335` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_geo_divisions
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_geo_locations_company_id_index_copy1_copy1`
  ON `APSISERP`.`sys_geo_divisions` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_geo_location_types
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049700` PRIMARY KEY (`geo_location_type_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_geo_location_types
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049684` CHECK (`geo_location_type_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049685` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049686` CHECK (`geo_type_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049690` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049691` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049692` CHECK (`geo_location_type_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049693` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049694` CHECK (`geo_type_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049698` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_location_types` ADD CONSTRAINT `SYS_C0049699` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_geo_location_types
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_geo_locations_company_id_index_copy1`
  ON `APSISERP`.`sys_geo_location_types` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_geo_locations
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `sys_geo_locations_pkey` PRIMARY KEY (`geo_location_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_geo_locations
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019486` CHECK (`geo_location_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019487` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019488` CHECK (`geo_type` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019489` CHECK (`division` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019490` CHECK (`district` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019491` CHECK (`thana` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019492` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_geo_locations` ADD CONSTRAINT `SYS_C0019493` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_geo_locations
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_geo_locations_company_id_index`
  ON `APSISERP`.`sys_geo_locations` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_logger_activitys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `sys_logger_activitys_pkey` PRIMARY KEY (`logger_activity_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_logger_activitys
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `SYS_C0019494` CHECK (`logger_activity_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `SYS_C0019496` CHECK (`logger_event` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `SYS_C0019500` CHECK (`ip_address` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `SYS_C0019501` CHECK (`user_agent` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_logger_activitys` ADD CONSTRAINT `sys_logger_activitys_log_out_type_check` CHECK (`log_out_type` IN ('Force' , 'Normal' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_logger_activitys
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_logger_activitys_company_id_index`
  ON `APSISERP`.`sys_logger_activitys` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_master_grids
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019915` PRIMARY KEY (`master_grid_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_master_grids
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019503` CHECK (`master_grid_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019504` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019505` CHECK (`master_grid_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019506` CHECK (`sql_select` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019507` CHECK (`sql_source` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019508` CHECK (`action_table` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019509` CHECK (`primary_key_field` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019510` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_master_grids` ADD CONSTRAINT `SYS_C0019511` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_master_grids
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_master_grids_company_id_index`
  ON `APSISERP`.`sys_master_grids` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_menus
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039338` PRIMARY KEY (`menu_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_menus
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039329` CHECK (`menu_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039330` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039331` CHECK (`menu_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039332` CHECK (`menu_icon_class` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039333` CHECK (`menu_url` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039334` CHECK (`parent_menu_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039335` CHECK (`sort_number` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039336` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_menus` ADD CONSTRAINT `SYS_C0039337` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `sys_modules_pkey` PRIMARY KEY (`module_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019521` CHECK (`module_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019522` CHECK (`module_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019523` CHECK (`module_icon` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019524` CHECK (`module_url` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019525` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_modules` ADD CONSTRAINT `SYS_C0019526` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_pdf_templates
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_pdf_templates` ADD CONSTRAINT `sys_pdf_templates_pkey` PRIMARY KEY (`pdf_templates_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_pdf_templates
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_pdf_templates` ADD CONSTRAINT `SYS_C0019527` CHECK (`pdf_templates_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_pdf_templates` ADD CONSTRAINT `SYS_C0019528` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_pdf_templates` ADD CONSTRAINT `SYS_C0019529` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_pdf_templates` ADD CONSTRAINT `SYS_C0019530` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_pdf_templates
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_pdf_templates_company_id_index`
  ON `APSISERP`.`sys_pdf_templates` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_privilege_events
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `sys_privilege_events_pkey` PRIMARY KEY (`event_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_events
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `SYS_C0019531` CHECK (`event_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `SYS_C0019532` CHECK (`event_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `SYS_C0019533` CHECK (`event_key` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `SYS_C0019534` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `SYS_C0019535` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `sys_privilege_events_event_key_check` CHECK (`event_key` IN ('Department' , 'Designation' , 'Division' , 'Branch' , 'Unit' , 'Section' , 'Level' , 'User' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_events` ADD CONSTRAINT `sys_privilege_events_event_ref_check` CHECK (`event_ref` IN ('sys_dropdowns' , 'sys_master_grid' , 'sys_buttons' , 'url' , 'dashboard' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_features
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_features` ADD CONSTRAINT `uk_role_features` UNIQUE (`role_id`, `company_id`, `feature_id`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_features
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_features` ADD CONSTRAINT `SYS_C0019536` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_features
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_features_company_id_index`
  ON `APSISERP`.`sys_privilege_features` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_features_feature_id_index`
  ON `APSISERP`.`sys_privilege_features` (`feature_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_features_role_id_index`
  ON `APSISERP`.`sys_privilege_features` (`role_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_privilege_item_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039309` PRIMARY KEY (`privilege_item_user_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_item_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039302` CHECK (`privilege_item_user_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039303` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039304` CHECK (`event_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039305` CHECK (`event_slug_key` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039306` CHECK (`permission` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039307` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_item_users` ADD CONSTRAINT `SYS_C0039308` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_privilege_items
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `sys_privilege_items_pkey` PRIMARY KEY (`privilege_item_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_items
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019543` CHECK (`privilege_item_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019544` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019545` CHECK (`event_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019546` CHECK (`reference_value` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019547` CHECK (`event_slug_key` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019548` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_items` ADD CONSTRAINT `SYS_C0019549` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_items
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_items_company_id_index`
  ON `APSISERP`.`sys_privilege_items` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_menus
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_menus` ADD CONSTRAINT `uk_role_menus` UNIQUE (`menu_id`, `company_id`, `role_id`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_menus
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_menus` ADD CONSTRAINT `SYS_C0019550` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_menus` ADD CONSTRAINT `SYS_C0019551` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_privilege_menus` ADD CONSTRAINT `SYS_C0019552` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_menus
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_menus_company_id_index`
  ON `APSISERP`.`sys_privilege_menus` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_menus_menu_id_index`
  ON `APSISERP`.`sys_privilege_menus` (`menu_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_menus_role_id_index`
  ON `APSISERP`.`sys_privilege_menus` (`role_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_modules` ADD CONSTRAINT `uk_user_modules` UNIQUE (`module_id`, `company_id`, `user_id`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_modules
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_modules` ADD CONSTRAINT `SYS_C0019553` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_modules
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_modules_company_id_index`
  ON `APSISERP`.`sys_privilege_modules` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_modules_module_id_index`
  ON `APSISERP`.`sys_privilege_modules` (`module_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_modules_user_id_index`
  ON `APSISERP`.`sys_privilege_modules` (`user_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_roles
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_roles` ADD CONSTRAINT `uk_user_role` UNIQUE (`role_id`, `company_id`, `user_id`) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_privilege_roles
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_privilege_roles` ADD CONSTRAINT `SYS_C0019554` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_privilege_roles
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_roles_company_id_index`
  ON `APSISERP`.`sys_privilege_roles` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_roles_role_id_index`
  ON `APSISERP`.`sys_privilege_roles` (`role_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_privilege_roles_user_id_index`
  ON `APSISERP`.`sys_privilege_roles` (`user_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_roles
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `sys_roles_pkey` PRIMARY KEY (`role_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_roles
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019557` CHECK (`role_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019558` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019559` CHECK (`role_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019560` CHECK (`min_username_length` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019561` CHECK (`max_username_length` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019562` CHECK (`multi_login_allow` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019563` CHECK (`max_wrong_login_attemp` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019564` CHECK (`password_regex` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0019565` CHECK (`password_regex_error_msg` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `SYS_C0046737` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `sys_roles_password_expiry_action_check` CHECK (`password_expiry_action` IN ('Notify' , 'Force' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_roles` ADD CONSTRAINT `sys_roles_wrong_login_attemp_check` CHECK (`wrong_login_attemp` IN ('No Restriction' , 'Blocked' , 'Block for a Period' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_roles
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_roles_company_id_index`
  ON `APSISERP`.`sys_roles` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_roles_module_id_index`
  ON `APSISERP`.`sys_roles` (`module_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_search_panel_details
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `sys_search_panel_details_pkey` PRIMARY KEY (`search_panel_detail_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_search_panel_details
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019568` CHECK (`search_panel_detail_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019569` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019570` CHECK (`label_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019571` CHECK (`input_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019572` CHECK (`dropdown_options` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019573` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `SYS_C0019574` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `sys_search_panel_details_input_operation_type_check` CHECK (`input_operation_type` IN ('WHERE EQUAL' , 'WHERE IN' , 'WHERE LIKE' , 'WHERE DATERANGE' , 'WHERE RANGE' , 'WHERE DATETIME' , 'HAVING EQUAL' , 'HAVING LIKE' , 'HAVING DATERANGE' , 'HAVING IN' , 'HAVING RANGE' , 'HAVING DATETIME' , 'WHERE TIME' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panel_details` ADD CONSTRAINT `sys_search_panel_details_input_type_check` CHECK (`input_type` IN ('dropdown' , 'autocomplete' , 'multi_select' , 'email' , 'date' , 'text' , 'checkbox' , 'radio' , 'button' , 'number' , 'submit' , 'date_range' , 'number_range' , 'month' , 'year' , 'time' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_search_panel_details
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_search_panel_details_company_id_index`
  ON `APSISERP`.`sys_search_panel_details` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_search_panel_details_dropdown_slug_index`
  ON `APSISERP`.`sys_search_panel_details` (`dropdown_slug` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_search_panel_details_search_panel_slug_index`
  ON `APSISERP`.`sys_search_panel_details` (`search_panel_slug` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_search_panels
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `sys_search_panels_pkey` PRIMARY KEY (`search_panel_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_search_panels
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019575` CHECK (`search_panel_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019576` CHECK (`search_panel_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019577` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019578` CHECK (`default_search_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019579` CHECK (`description` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019580` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_search_panels` ADD CONSTRAINT `SYS_C0019581` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_search_panels
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_search_panels_company_id_index`
  ON `APSISERP`.`sys_search_panels` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_status_flows
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `sys_status_flows_pkey` PRIMARY KEY (`status_flow_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_status_flows
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019582` CHECK (`status_flow_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019583` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019584` CHECK (`status_flow_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019585` CHECK (`status_flows_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019586` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_status_flows` ADD CONSTRAINT `SYS_C0019587` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_status_flows
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_status_flows_company_id_index`
  ON `APSISERP`.`sys_status_flows` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_timelines
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `sys_timelines_pkey` PRIMARY KEY (`timeline_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_timelines
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050448` CHECK (`timeline_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050449` CHECK (`ref_value` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050450` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050451` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050452` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_timelines` ADD CONSTRAINT `SYS_C0050454` CHECK (`ref_slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_timelines
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_timelines_company_id_index`
  ON `APSISERP`.`sys_timelines` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_unique_id_logics
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `sys_unique_id_logics_pkey` PRIMARY KEY (`unique_id_logic_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_unique_id_logics
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019588` CHECK (`unique_id_logic_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019589` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019590` CHECK (`id_for` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019591` CHECK (`slug` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019592` CHECK (`id_format` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019593` CHECK (`token_reset_logic` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019594` CHECK (`draft_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019595` CHECK (`after_approve_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019596` CHECK (`initiate_approve_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `SYS_C0019597` CHECK (`after_decline_status` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_unique_id_logics` ADD CONSTRAINT `sys_unique_id_logics_delegation_type_enum_check` CHECK (`delegation_type` IN ('MC' , 'WF' , 'DLM' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_unique_id_logics
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_unique_id_logics_company_id_index`
  ON `APSISERP`.`sys_unique_id_logics` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_user_tokens
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `sys_user_tokens_pkey` PRIMARY KEY (`user_token_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_user_tokens
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019601` CHECK (`user_token_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019602` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019603` CHECK (`user_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019604` CHECK (`refresh_token` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019605` CHECK (`refresh_token_expiry_date` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019606` CHECK (`access_token` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_user_tokens` ADD CONSTRAINT `SYS_C0019607` CHECK (`ip_address` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_user_tokens
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_user_tokens_company_id_index`
  ON `APSISERP`.`sys_user_tokens` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** ture for table sys_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050402` PRIMARY KEY (`user_id`);

-- SQLINES DEMO *** -----------
-- SQLINES DEMO *** for table sys_users
-- SQLINES DEMO *** -----------
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050379` CHECK (`user_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050380` CHECK (`user_code` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050381` CHECK (`user_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050382` CHECK (`email` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050383` CHECK (`password` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050384` CHECK (`full_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050385` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050386` CHECK (`branch_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050387` CHECK (`line_manager_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050388` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050389` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050390` CHECK (`user_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050391` CHECK (`user_code` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050392` CHECK (`user_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050393` CHECK (`email` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050394` CHECK (`password` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050395` CHECK (`full_name` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050396` CHECK (`company_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050397` CHECK (`branch_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050398` CHECK (`line_manager_id` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050399` CHECK (`created_by` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050400` CHECK (`created_at` IS NOT NULL) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;
ALTER TABLE `APSISERP`.`sys_users` ADD CONSTRAINT `SYS_C0050401` CHECK (`gender` IN ('Male' , 'Female' )) NOT DEFERRABLE INITIALLY IMMEDIATE NORELY VALIDATE;

-- SQLINES DEMO *** -----------
-- SQLINES DEMO ***  for table sys_users
-- SQLINES DEMO *** -----------
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_users_branch_id_index_copy1`
  ON `APSISERP`.`sys_users` (`branch_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_users_company_id_index_copy1`
  ON `APSISERP`.`sys_users` (`company_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_users_department_id_index_copy1`
  ON `APSISERP`.`sys_users` (`department_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;
-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE INDEX `sys_users_division_id_index_copy1`
  ON `APSISERP`.`sys_users` (`division_id` ASC)
  VISIBLE
PCTFREE 10
INITRANS 2
STORAGE (
  INITIAL 65536 
  NEXT 1048576 
  MINEXTENTS 1
  MAXEXTENTS 2147483645
  BUFFER_POOL DEFAULT
  FLASH_CACHE DEFAULT
)
   USABLE;

