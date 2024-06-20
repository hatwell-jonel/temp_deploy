CREATE TABLE `fims_availment` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`requisition_no` varchar(255) NOT NULL,
	`budget_source_id` bigint NOT NULL,
	`sub_account_id` bigint NOT NULL,
	`coa_id` bigint NOT NULL,
	`opex_id` bigint NOT NULL,
	`month` enum('jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dece') NOT NULL,
	`year` int NOT NULL,
	`amount` float NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_availment_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_requisition` UNIQUE(`requisition_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_cash_advance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`request_type_id` bigint NOT NULL,
	`cash_advance_no` varchar(255) NOT NULL,
	`payee_id` bigint NOT NULL,
	`sub_payee_id` bigint NOT NULL,
	`requested_amount` float NOT NULL,
	`requestorId` bigint NOT NULL,
	`date_needed` timestamp NOT NULL,
	`release_date` timestamp NOT NULL,
	`status` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_cash_advance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_cash_advance_type` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_cash_advance_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_check_voucher` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`cv_no` varchar(255) NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`rfp_no` varchar(255) NOT NULL,
	`check_number` varchar(255),
	`status` int NOT NULL DEFAULT 0,
	`reason_for_rejection_id` bigint,
	`release_date` date,
	`is_draft` boolean DEFAULT true,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`final_status` int NOT NULL DEFAULT 0,
	`reviewer1_status` int NOT NULL DEFAULT 0,
	`reviewer2_status` int NOT NULL DEFAULT 0,
	`approver1_status` int NOT NULL DEFAULT 0,
	`approver2_status` int NOT NULL DEFAULT 0,
	`approver3_status` int NOT NULL DEFAULT 0,
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` int NOT NULL,
	CONSTRAINT `fims_check_voucher_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_check_voucher_cv_no_unique` UNIQUE(`cv_no`),
	CONSTRAINT `fims_check_voucher_purchasing_id_unique` UNIQUE(`purchasing_id`)
);
--> statement-breakpoint
CREATE TABLE `fims_check_voucher_or_si_number` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`cv_no` varchar(255) NOT NULL,
	`or_number` varchar(255),
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_check_voucher_or_si_number_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_check_voucher_or_si_number_or_number_unique` UNIQUE(`or_number`)
);
--> statement-breakpoint
CREATE TABLE `fims_freight` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`voyage_no` varchar(255) NOT NULL,
	`wing_van_id` bigint NOT NULL,
	`sub_account_id` bigint NOT NULL,
	`date_needed` timestamp NOT NULL,
	`transaction_date_from` timestamp NOT NULL,
	`transaction_date_to` timestamp NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`requested_amount` float NOT NULL,
	`receipt_no` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_freight_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_freight_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`freight_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_freight_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_freight_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_petty_cash` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sub_account_id` bigint NOT NULL,
	`date_needed` timestamp NOT NULL,
	`transaction_date_from` timestamp NOT NULL,
	`transaction_date_to` timestamp NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`requested_amount` float NOT NULL,
	`receipt_no` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_petty_cash_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_petty_cash_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`petty_cash_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_petty_cash_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_petty_cash_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_revolving_funds` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sub_account_id` bigint NOT NULL,
	`date_needed` timestamp NOT NULL,
	`transaction_date_from` timestamp NOT NULL,
	`transaction_date_to` timestamp NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`requested_amount` float NOT NULL,
	`receipt_no` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_revolving_funds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_revolving_funds_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`revolving_funds_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_revolving_funds_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_revolving_funds_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_rfp` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`rfp_no` varchar(255) NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`date_requested` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_needed` timestamp NOT NULL,
	`transaction_date_from` timestamp NOT NULL,
	`transaction_date_to` timestamp NOT NULL,
	`due_date` timestamp NOT NULL,
	`priority_level_id` bigint NOT NULL,
	`requestor_id` bigint NOT NULL,
	`status` int NOT NULL DEFAULT 0,
	`amount` float NOT NULL DEFAULT 0,
	`tin` varchar(255) NOT NULL DEFAULT '008-022-724-000',
	`request_type` enum('RFP') DEFAULT 'RFP',
	`payee_id` bigint NOT NULL,
	`sub_payee_id` bigint,
	`release_date` timestamp,
	`is_draft` boolean DEFAULT true,
	`particular_type` enum('po','recurring','jo') NOT NULL DEFAULT 'po',
	`budget_source_id` bigint NOT NULL,
	`opex_category_id` bigint NOT NULL,
	`chart_of_account_id` bigint NOT NULL,
	`jo_number` varchar(255),
	`po_number` varchar(255),
	`sub_account_id` bigint NOT NULL,
	`remarks` varchar(255),
	`requested_by` bigint NOT NULL,
	`vatable` boolean DEFAULT false,
	`ewt_percentage` float,
	`reason_for_rejection_id` bigint,
	`final_status` int NOT NULL DEFAULT 0,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`reviewer1_status` int NOT NULL DEFAULT 0,
	`reviewer2_status` int NOT NULL DEFAULT 0,
	`approver1_status` int NOT NULL DEFAULT 0,
	`approver2_status` int NOT NULL DEFAULT 0,
	`approver3_status` int NOT NULL DEFAULT 0,
	`reviewer1_status_date` timestamp,
	`reviewer2_status_date` timestamp,
	`approver1_status_date` timestamp,
	`approver2_status_date` timestamp,
	`approver3_status_date` timestamp,
	`reviewer1_remarks` varchar(255),
	`reviewer2_remarks` varchar(255),
	`approver1_remarks` varchar(255),
	`approver2_remarks` varchar(255),
	`approver3_remarks` varchar(255),
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` int NOT NULL,
	CONSTRAINT `fims_rfp_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_rfp_rfp_no_unique` UNIQUE(`rfp_no`),
	CONSTRAINT `fims_rfp_purchasing_id_unique` UNIQUE(`purchasing_id`)
);
--> statement-breakpoint
CREATE TABLE `fims_rfp_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`rfp_no` varchar(255) NOT NULL,
	`url` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`size` float NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_rfp_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_rfp_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_rfp_particulars` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`rfp_no` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`amount` float NOT NULL,
	`quantity` int NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_rfp_particulars_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_single_transaction` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sub_account_id` bigint NOT NULL,
	`date_needed` timestamp NOT NULL,
	`transaction_date_from` timestamp NOT NULL,
	`transaction_date_to` timestamp NOT NULL,
	`purpose` varchar(255) NOT NULL,
	`requested_amount` float NOT NULL,
	`receipt_no` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_single_transaction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_single_transaction_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`single_transaction_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_single_transaction_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_single_transaction_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_yearly_budget` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`opex_category_id` bigint NOT NULL,
	`chart_of_accounts_id` bigint NOT NULL,
	`division_id` bigint NOT NULL,
	`year` int NOT NULL,
	`jan` float NOT NULL DEFAULT 0,
	`feb` float NOT NULL DEFAULT 0,
	`mar` float NOT NULL DEFAULT 0,
	`apr` float NOT NULL DEFAULT 0,
	`may` float NOT NULL DEFAULT 0,
	`jun` float NOT NULL DEFAULT 0,
	`jul` float NOT NULL DEFAULT 0,
	`aug` float NOT NULL DEFAULT 0,
	`sep` float NOT NULL DEFAULT 0,
	`oct` float NOT NULL DEFAULT 0,
	`nov` float NOT NULL DEFAULT 0,
	`dece` float NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_yearly_budget_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_coa` UNIQUE(`chart_of_accounts_id`,`division_id`,`year`)
);
--> statement-breakpoint
CREATE TABLE `fims_access` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`path` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_access_path_unique` UNIQUE(`path`)
);
--> statement-breakpoint
CREATE TABLE `fims_access_rights` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`access_id` bigint NOT NULL,
	`user_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_access_rights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_bank` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_bank_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_budget_source` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_budget_source_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_carrier` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`transport_mode_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_carrier_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_chart_of_accounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`account_code` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_chart_of_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_hub` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_hub_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_industry` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_industry_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_item_category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_recurring` boolean NOT NULL DEFAULT false,
	`budget_source_id` bigint NOT NULL,
	`opex_category_id` bigint NOT NULL,
	`chart_of_accounts_id` bigint NOT NULL,
	`sub_accounts_id` bigint NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_item_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_combination` UNIQUE(`budget_source_id`,`opex_category_id`,`chart_of_accounts_id`,`sub_accounts_id`)
);
--> statement-breakpoint
CREATE TABLE `fims_item_description` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`item_category_id` bigint NOT NULL,
	`description` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_item_description_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_leasor` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_leasor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_loa_management` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`sub_module_id` bigint NOT NULL,
	`division_id` bigint NOT NULL,
	`min_amount` float NOT NULL,
	`max_amount` float NOT NULL,
	`level` int NOT NULL,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_loa_management_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_moduleByDivision` UNIQUE(`sub_module_id`,`division_id`,`level`)
);
--> statement-breakpoint
CREATE TABLE `fims_manpower` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`middle_name` varchar(255),
	`last_name` varchar(255) NOT NULL,
	`email_address` varchar(255) NOT NULL,
	`mobile_number` varchar(255) NOT NULL,
	`tel_number` varchar(255),
	`agency` varchar(255) NOT NULL,
	`tin` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_manpower_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_method_of_delivery` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_method_of_delivery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_opex_category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`category` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_opex_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_payment_mode` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_payment_mode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_payment_option` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_payment_option_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_priority_level` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` longtext,
	`days_max` int NOT NULL,
	`days_min` int NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_priority_level_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_priority_level_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `fims_provider` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_provider_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_purpose` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_purpose_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_queue_reference` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`prefix` varchar(255) NOT NULL,
	`date_part` varchar(255) NOT NULL,
	`number` int NOT NULL DEFAULT 1,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_queue_reference_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_reference` UNIQUE(`prefix`,`date_part`)
);
--> statement-breakpoint
CREATE TABLE `fims_reason_for_rejection` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_reason_for_rejection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_requisition_type` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_requisition_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_service_category` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_recurring` boolean NOT NULL DEFAULT false,
	`budget_source_id` bigint NOT NULL,
	`opex_category_id` bigint NOT NULL,
	`chart_of_accounts_id` bigint NOT NULL,
	`sub_accounts_id` bigint NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_service_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_combination` UNIQUE(`budget_source_id`,`opex_category_id`,`chart_of_accounts_id`,`sub_accounts_id`)
);
--> statement-breakpoint
CREATE TABLE `fims_service_description` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service_category_id` bigint NOT NULL,
	`description` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_service_description_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_service_provider` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_service_provider_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_sub_accounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`account_code` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_sub_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_sub_module` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_sub_module_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_subscription` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_subscription_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_supplier` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`trade_name` varchar(255) NOT NULL,
	`tin` varchar(255) NOT NULL,
	`industry_id` bigint NOT NULL,
	`barangay_id` bigint NOT NULL,
	`city_id` bigint NOT NULL,
	`region_id` bigint NOT NULL,
	`postal_code` varchar(255) NOT NULL,
	`address` longtext NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`middle_name` varchar(255),
	`last_name` varchar(255) NOT NULL,
	`email_address` varchar(255) NOT NULL,
	`mobile_number` varchar(255) NOT NULL,
	`tel_number` varchar(255),
	`payee_name` varchar(255) NOT NULL,
	`payee_account_number` varchar(255) NOT NULL,
	`bank_account_number` varchar(255) NOT NULL,
	`bank_account_name` varchar(255) NOT NULL,
	`bank_id` bigint NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_supplier_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_trainings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`learning_objective` varchar(255) NOT NULL,
	CONSTRAINT `fims_trainings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_transport_mode` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_transport_mode_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_unit` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` int NOT NULL DEFAULT 1,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_unit_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_utility_type` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_utility_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_wing_van` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_wing_van_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_airline_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reference_no` varchar(255) NOT NULL,
	`transport_mode_id` bigint NOT NULL,
	`carrier_id` bigint NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`soa_number` varchar(255) NOT NULL,
	`mawb_number` varchar(255),
	`amount` float NOT NULL DEFAULT 0,
	`rejection_id` bigint,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_airline_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_airline_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`airline_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_airline_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_airline_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_canvas_purchase` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`canvas_request_no` varchar(255) NOT NULL,
	`item_description_id` bigint NOT NULL,
	`quantity` int NOT NULL,
	`supplier_id` bigint NOT NULL,
	`unit_price` float NOT NULL,
	`delivery_date` timestamp NOT NULL,
	`payment_option_id` bigint NOT NULL,
	`installment_terms` int NOT NULL,
	`payment_terms` int NOT NULL,
	`payment_mode_id` bigint NOT NULL,
	`method_of_delivery_id` bigint NOT NULL,
	`reason_id` bigint,
	`is_approved` boolean DEFAULT true,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_canvas_purchase_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_canvas_purchase_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`canvas_request_no` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_canvas_purchase_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_canvas_purchase_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_canvas_service` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`canvas_request_no` varchar(255) NOT NULL,
	`service_description_id` bigint NOT NULL,
	`worker_id` bigint NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`hours` int NOT NULL,
	`extent_of_work` varchar(255) NOT NULL,
	`rate` float NOT NULL,
	`reason_id` bigint,
	`is_approved` boolean DEFAULT true,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_canvas_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_canvas_service_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`canvas_request_no` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_canvas_service_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_canvas_service_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_canvassing` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`canvas_request_no` varchar(255) NOT NULL,
	`priority_level_id` bigint NOT NULL,
	`expected_start_date` timestamp NOT NULL,
	`expected_end_date` timestamp NOT NULL,
	`type` int NOT NULL DEFAULT 1,
	`final_status` int NOT NULL DEFAULT 0,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`reviewer1_status` int NOT NULL DEFAULT 0,
	`reviewer2_status` int NOT NULL DEFAULT 0,
	`approver1_status` int NOT NULL DEFAULT 0,
	`approver2_status` int NOT NULL DEFAULT 0,
	`approver3_status` int NOT NULL DEFAULT 0,
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` bigint NOT NULL,
	`requested_by` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_canvassing_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_canvassing_purchasing_id_unique` UNIQUE(`purchasing_id`),
	CONSTRAINT `fims_canvassing_canvas_request_no_unique` UNIQUE(`canvas_request_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_order` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`order_no` varchar(255) NOT NULL,
	`priority_level_id` bigint NOT NULL,
	`expected_start_date` timestamp NOT NULL,
	`expected_end_date` timestamp NOT NULL,
	`type` int NOT NULL DEFAULT 1,
	`final_status` int NOT NULL DEFAULT 0,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`reviewer1_status` int NOT NULL DEFAULT 0,
	`reviewer2_status` int NOT NULL DEFAULT 0,
	`approver1_status` int NOT NULL DEFAULT 0,
	`approver2_status` int NOT NULL DEFAULT 0,
	`approver3_status` int NOT NULL DEFAULT 0,
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_order_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_order_purchasing_id_unique` UNIQUE(`purchasing_id`),
	CONSTRAINT `fims_order_order_no_unique` UNIQUE(`order_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_purchase_requisition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`requisition_no` varchar(255) NOT NULL,
	`item_category_id` bigint NOT NULL,
	`item_description_id` bigint NOT NULL,
	`quantity` int NOT NULL,
	`unit_id` bigint NOT NULL,
	`estimated_price` float NOT NULL,
	`estimated_total` float NOT NULL,
	`purpose_id` bigint,
	`beneficial_branch_id` bigint NOT NULL,
	`preferred_supplier_id` bigint,
	`rejection_id` bigint,
	`remarks` varchar(255),
	`is_sample_product` boolean NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_purchase_requisition_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_purchase_requisition_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`purchase_requisition_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_purchase_requisition_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_purchase_requisition_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_purchasing` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`requisition_final_status` int DEFAULT 0,
	`canvassing_final_status` int DEFAULT 0,
	`request_final_status` int DEFAULT 0,
	`order_final_status` int DEFAULT 0,
	`rfp_final_status` int DEFAULT 0,
	`check_voucher_final_status` int DEFAULT 0,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_purchasing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_recurring_requisition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`requisition_no` varchar(255) NOT NULL,
	`service_category_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_recurring_requisition_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_lease_or_rental_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`type` int NOT NULL DEFAULT 1,
	`reference_no` varchar(255) NOT NULL,
	`hub_id` bigint NOT NULL,
	`leasor_id` bigint NOT NULL,
	`start_date` timestamp NOT NULL,
	`terms` int NOT NULL DEFAULT 0,
	`end_date` timestamp,
	`amount` float NOT NULL DEFAULT 0,
	`rejection_id` bigint,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_lease_or_rental_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_rentals_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`rental_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_rentals_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_rentals_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_request` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`request_no` varchar(255) NOT NULL,
	`priority_level_id` bigint NOT NULL,
	`expected_start_date` timestamp NOT NULL,
	`expected_end_date` timestamp NOT NULL,
	`type` int NOT NULL DEFAULT 1,
	`final_status` int NOT NULL DEFAULT 0,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`reviewer1_status` int NOT NULL DEFAULT 0,
	`reviewer2_status` int NOT NULL DEFAULT 0,
	`approver1_status` int NOT NULL DEFAULT 0,
	`approver2_status` int NOT NULL DEFAULT 0,
	`approver3_status` int NOT NULL DEFAULT 0,
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_request_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_request_purchasing_id_unique` UNIQUE(`purchasing_id`),
	CONSTRAINT `fims_request_request_no_unique` UNIQUE(`request_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_requisition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`purchasing_id` bigint NOT NULL,
	`requisition_no` varchar(255) NOT NULL,
	`priority_level_id` bigint NOT NULL,
	`requisition_type_id` bigint NOT NULL,
	`expected_start_date` timestamp NOT NULL,
	`expected_end_date` timestamp NOT NULL,
	`final_status` int DEFAULT 0,
	`approver1_id` bigint NOT NULL,
	`approver2_id` bigint,
	`approver3_id` bigint,
	`reviewer1_id` bigint,
	`reviewer2_id` bigint,
	`approver1_status` int DEFAULT 0,
	`approver2_status` int DEFAULT 0,
	`approver3_status` int DEFAULT 0,
	`reviewer1_status` int DEFAULT 0,
	`reviewer2_status` int DEFAULT 0,
	`approver1_status_date` timestamp,
	`approver2_status_date` timestamp,
	`approver3_status_date` timestamp,
	`reviewer1_status_date` timestamp,
	`reviewer2_status_date` timestamp,
	`has_canvassing` boolean DEFAULT false,
	`next_action_user_id` bigint,
	`next_action` int NOT NULL DEFAULT 3,
	`created_by` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_requisition_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_requisition_requisition_no_unique` UNIQUE(`requisition_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_service_requisition` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`requisition_no` varchar(255) NOT NULL,
	`service_category_id` bigint NOT NULL,
	`service_description_id` bigint NOT NULL,
	`number_of_workers` int NOT NULL,
	`man_hours` int NOT NULL,
	`estimated_rate` float NOT NULL,
	`preferred_worker_id` bigint,
	`purpose_id` bigint,
	`location_id` bigint NOT NULL,
	`rejection_id` bigint,
	`comments` varchar(255),
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_service_requisition_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_service_requisition_requisition_no_unique` UNIQUE(`requisition_no`)
);
--> statement-breakpoint
CREATE TABLE `fims_service_requisition_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`service_requisition_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_service_requisition_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_service_requisition_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_subscription_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reference_no` varchar(255) NOT NULL,
	`subscription_id` bigint NOT NULL,
	`provider_id` bigint NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`soa_number` varchar(255) NOT NULL,
	`amount` float NOT NULL DEFAULT 0,
	`rejection_id` bigint,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_subscription_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_subscriptions_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`subscription_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_subscriptions_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_subscriptions_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `fims_utility_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reference_no` varchar(255) NOT NULL,
	`utility_type_id` bigint NOT NULL,
	`service_provider_id` bigint NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`soa_number` varchar(255) NOT NULL,
	`mawb_number` varchar(255),
	`amount` float NOT NULL DEFAULT 0,
	`rejection_id` bigint,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_utility_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fims_utility_attachments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`key` varchar(255) NOT NULL,
	`utility_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fims_utility_attachments_id` PRIMARY KEY(`id`),
	CONSTRAINT `fims_utility_attachments_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE INDEX `budget_source_idx` ON `fims_availment` (`budget_source_id`);--> statement-breakpoint
CREATE INDEX `sub_account_idx` ON `fims_availment` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `coa_idx` ON `fims_availment` (`coa_id`);--> statement-breakpoint
CREATE INDEX `opex_idx` ON `fims_availment` (`opex_id`);--> statement-breakpoint
CREATE INDEX `requisition_no_idx` ON `fims_availment` (`requisition_no`);--> statement-breakpoint
CREATE INDEX `name_index` ON `fims_cash_advance_type` (`name`);--> statement-breakpoint
CREATE INDEX `rfp_no_idx` ON `fims_check_voucher` (`rfp_no`);--> statement-breakpoint
CREATE INDEX `reason_for_rejection_id` ON `fims_check_voucher` (`reason_for_rejection_id`);--> statement-breakpoint
CREATE INDEX `reviewer1Idx` ON `fims_check_voucher` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Idx` ON `fims_check_voucher` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Idx` ON `fims_check_voucher` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Idx` ON `fims_check_voucher` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Idx` ON `fims_check_voucher` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `nextActionUserIdIdx` ON `fims_check_voucher` (`next_action_user_id`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `fims_check_voucher` (`created_by`);--> statement-breakpoint
CREATE INDEX `cv_no_idx` ON `fims_check_voucher_or_si_number` (`cv_no`);--> statement-breakpoint
CREATE INDEX `priority_level_idx` ON `fims_rfp` (`priority_level_id`);--> statement-breakpoint
CREATE INDEX `requestor_idx` ON `fims_rfp` (`requestor_id`);--> statement-breakpoint
CREATE INDEX `payee_idx` ON `fims_rfp` (`payee_id`);--> statement-breakpoint
CREATE INDEX `sub_payee_idx` ON `fims_rfp` (`sub_payee_id`);--> statement-breakpoint
CREATE INDEX `particular_type_idx` ON `fims_rfp` (`particular_type`);--> statement-breakpoint
CREATE INDEX `budget_source_idx` ON `fims_rfp` (`budget_source_id`);--> statement-breakpoint
CREATE INDEX `opex_category_idx` ON `fims_rfp` (`opex_category_id`);--> statement-breakpoint
CREATE INDEX `chart_of_account_idx` ON `fims_rfp` (`chart_of_account_id`);--> statement-breakpoint
CREATE INDEX `sub_account_idx` ON `fims_rfp` (`chart_of_account_id`);--> statement-breakpoint
CREATE INDEX `requested_by_idx` ON `fims_rfp` (`requested_by`);--> statement-breakpoint
CREATE INDEX `reviewer1Idx` ON `fims_rfp` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Idx` ON `fims_rfp` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Idx` ON `fims_rfp` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Idx` ON `fims_rfp` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Idx` ON `fims_rfp` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `nextActionUserIdIdx` ON `fims_rfp` (`next_action_user_id`);--> statement-breakpoint
CREATE INDEX `createdByIdx` ON `fims_rfp` (`created_by`);--> statement-breakpoint
CREATE INDEX `reason_for_rejection_id_idx` ON `fims_rfp` (`reason_for_rejection_id`);--> statement-breakpoint
CREATE INDEX `po_number_idx` ON `fims_rfp` (`po_number`);--> statement-breakpoint
CREATE INDEX `jo_number_idx` ON `fims_rfp` (`jo_number`);--> statement-breakpoint
CREATE INDEX `rfp_no_idx` ON `fims_rfp_attachments` (`rfp_no`);--> statement-breakpoint
CREATE INDEX `rfp_no_idx` ON `fims_rfp_particulars` (`rfp_no`);--> statement-breakpoint
CREATE INDEX `year_idx` ON `fims_yearly_budget` (`year`);--> statement-breakpoint
CREATE INDEX `chart_of_accounts_idx` ON `fims_yearly_budget` (`chart_of_accounts_id`);--> statement-breakpoint
CREATE INDEX `opex_idx` ON `fims_yearly_budget` (`opex_category_id`);--> statement-breakpoint
CREATE INDEX `user_id_index` ON `fims_access_rights` (`user_id`);--> statement-breakpoint
CREATE INDEX `access_id_index` ON `fims_access_rights` (`access_id`);--> statement-breakpoint
CREATE INDEX `transport_mode_idx` ON `fims_carrier` (`transport_mode_id`);--> statement-breakpoint
CREATE INDEX `opex_category_idx` ON `fims_item_category` (`opex_category_id`);--> statement-breakpoint
CREATE INDEX `budget_source_idx` ON `fims_item_category` (`budget_source_id`);--> statement-breakpoint
CREATE INDEX `chart_of_accounts_idx` ON `fims_item_category` (`chart_of_accounts_id`);--> statement-breakpoint
CREATE INDEX `sub_accounts_idx` ON `fims_item_category` (`chart_of_accounts_id`);--> statement-breakpoint
CREATE INDEX `item_category_idx` ON `fims_item_description` (`item_category_id`);--> statement-breakpoint
CREATE INDEX `sub_module_idx` ON `fims_loa_management` (`sub_module_id`);--> statement-breakpoint
CREATE INDEX `division_idx` ON `fims_loa_management` (`division_id`);--> statement-breakpoint
CREATE INDEX `reviewer1Idx` ON `fims_loa_management` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Idx` ON `fims_loa_management` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Idx` ON `fims_loa_management` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Idx` ON `fims_loa_management` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Idx` ON `fims_loa_management` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `days_max_idx` ON `fims_priority_level` (`days_max`);--> statement-breakpoint
CREATE INDEX `days_min_idx` ON `fims_priority_level` (`days_min`);--> statement-breakpoint
CREATE INDEX `name_index` ON `fims_service_category` (`name`);--> statement-breakpoint
CREATE INDEX `opex_category_idx` ON `fims_service_category` (`opex_category_id`);--> statement-breakpoint
CREATE INDEX `budget_source_idx` ON `fims_service_category` (`budget_source_id`);--> statement-breakpoint
CREATE INDEX `chart_of_accounts_idx` ON `fims_service_category` (`chart_of_accounts_id`);--> statement-breakpoint
CREATE INDEX `sub_accounts_idx` ON `fims_service_category` (`chart_of_accounts_id`);--> statement-breakpoint
CREATE INDEX `service_category_idx` ON `fims_service_description` (`service_category_id`);--> statement-breakpoint
CREATE INDEX `bank_idx` ON `fims_supplier` (`bank_id`);--> statement-breakpoint
CREATE INDEX `region_idx` ON `fims_supplier` (`region_id`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `fims_supplier` (`city_id`);--> statement-breakpoint
CREATE INDEX `barangay_idx` ON `fims_supplier` (`barangay_id`);--> statement-breakpoint
CREATE INDEX `industry_idx` ON `fims_supplier` (`industry_id`);--> statement-breakpoint
CREATE INDEX `rejection_id` ON `fims_airline_details` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `carrier_idx` ON `fims_airline_details` (`carrier_id`);--> statement-breakpoint
CREATE INDEX `reference_no` ON `fims_airline_details` (`reference_no`);--> statement-breakpoint
CREATE INDEX `transport_mode_idx` ON `fims_airline_details` (`transport_mode_id`);--> statement-breakpoint
CREATE INDEX `supplier_idx` ON `fims_canvas_purchase` (`supplier_id`);--> statement-breakpoint
CREATE INDEX `payment_option_idx` ON `fims_canvas_purchase` (`payment_option_id`);--> statement-breakpoint
CREATE INDEX `payment_mode_idx` ON `fims_canvas_purchase` (`payment_mode_id`);--> statement-breakpoint
CREATE INDEX `method_of_delivery_idx` ON `fims_canvas_purchase` (`method_of_delivery_id`);--> statement-breakpoint
CREATE INDEX `reason_idx` ON `fims_canvas_purchase` (`reason_id`);--> statement-breakpoint
CREATE INDEX `is_approved_idx` ON `fims_canvas_purchase` (`is_approved`);--> statement-breakpoint
CREATE INDEX `canvas_request_no_idx` ON `fims_canvas_purchase_attachments` (`canvas_request_no`);--> statement-breakpoint
CREATE INDEX `serv_desc_idx` ON `fims_canvas_service` (`service_description_id`);--> statement-breakpoint
CREATE INDEX `worker_idx` ON `fims_canvas_service` (`worker_id`);--> statement-breakpoint
CREATE INDEX `reason_idx` ON `fims_canvas_service` (`reason_id`);--> statement-breakpoint
CREATE INDEX `is_approved_idx` ON `fims_canvas_service` (`is_approved`);--> statement-breakpoint
CREATE INDEX `canvas_request_no_idx` ON `fims_canvas_service_attachments` (`canvas_request_no`);--> statement-breakpoint
CREATE INDEX `reviewer1Id` ON `fims_canvassing` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Id` ON `fims_canvassing` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Id` ON `fims_canvassing` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Id` ON `fims_canvassing` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Id` ON `fims_canvassing` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `nextActionUserId` ON `fims_canvassing` (`next_action_user_id`);--> statement-breakpoint
CREATE INDEX `createdBy` ON `fims_canvassing` (`created_by`);--> statement-breakpoint
CREATE INDEX `requestedBy` ON `fims_canvassing` (`requested_by`);--> statement-breakpoint
CREATE INDEX `reviewer1Id` ON `fims_order` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Id` ON `fims_order` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Id` ON `fims_order` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Id` ON `fims_order` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Id` ON `fims_order` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `nextActionUserId` ON `fims_order` (`next_action_user_id`);--> statement-breakpoint
CREATE INDEX `createdBy` ON `fims_order` (`created_by`);--> statement-breakpoint
CREATE INDEX `item_category_idx` ON `fims_purchase_requisition` (`item_category_id`);--> statement-breakpoint
CREATE INDEX `item_description_idx` ON `fims_purchase_requisition` (`item_description_id`);--> statement-breakpoint
CREATE INDEX `beneficial_branch_idx` ON `fims_purchase_requisition` (`beneficial_branch_id`);--> statement-breakpoint
CREATE INDEX `preferred_supplier_idx` ON `fims_purchase_requisition` (`preferred_supplier_id`);--> statement-breakpoint
CREATE INDEX `rejection_idx` ON `fims_purchase_requisition` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `requisition_status_idx` ON `fims_purchasing` (`requisition_final_status`);--> statement-breakpoint
CREATE INDEX `canvassing_final_status_idx` ON `fims_purchasing` (`canvassing_final_status`);--> statement-breakpoint
CREATE INDEX `request_final_status_idx` ON `fims_purchasing` (`request_final_status`);--> statement-breakpoint
CREATE INDEX `order_final_status_idx` ON `fims_purchasing` (`order_final_status`);--> statement-breakpoint
CREATE INDEX `rfp_final_status_idx` ON `fims_purchasing` (`rfp_final_status`);--> statement-breakpoint
CREATE INDEX `check_voucher_final_status_idx` ON `fims_purchasing` (`check_voucher_final_status`);--> statement-breakpoint
CREATE INDEX `service_category_id` ON `fims_recurring_requisition` (`service_category_id`);--> statement-breakpoint
CREATE INDEX `requisition_no_idx` ON `fims_recurring_requisition` (`requisition_no`);--> statement-breakpoint
CREATE INDEX `rejection_id` ON `fims_lease_or_rental_details` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `hub_id` ON `fims_lease_or_rental_details` (`hub_id`);--> statement-breakpoint
CREATE INDEX `reference_no` ON `fims_lease_or_rental_details` (`reference_no`);--> statement-breakpoint
CREATE INDEX `leasor_id` ON `fims_lease_or_rental_details` (`leasor_id`);--> statement-breakpoint
CREATE INDEX `reviewer1Id` ON `fims_request` (`reviewer1_id`);--> statement-breakpoint
CREATE INDEX `reviewer2Id` ON `fims_request` (`reviewer2_id`);--> statement-breakpoint
CREATE INDEX `approver1Id` ON `fims_request` (`approver1_id`);--> statement-breakpoint
CREATE INDEX `approver2Id` ON `fims_request` (`approver2_id`);--> statement-breakpoint
CREATE INDEX `approver3Id` ON `fims_request` (`approver3_id`);--> statement-breakpoint
CREATE INDEX `nextActionUserId` ON `fims_request` (`next_action_user_id`);--> statement-breakpoint
CREATE INDEX `createdBy` ON `fims_request` (`created_by`);--> statement-breakpoint
CREATE INDEX `created_by_idx` ON `fims_requisition` (`created_by`);--> statement-breakpoint
CREATE INDEX `priority_level_idx` ON `fims_requisition` (`priority_level_id`);--> statement-breakpoint
CREATE INDEX `requisition_type_idx` ON `fims_requisition` (`requisition_type_id`);--> statement-breakpoint
CREATE INDEX `rejection_idx` ON `fims_service_requisition` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `location_idx` ON `fims_service_requisition` (`location_id`);--> statement-breakpoint
CREATE INDEX `purpose_idx` ON `fims_service_requisition` (`purpose_id`);--> statement-breakpoint
CREATE INDEX `preferred_worker_idx` ON `fims_service_requisition` (`preferred_worker_id`);--> statement-breakpoint
CREATE INDEX `service_category_idx` ON `fims_service_requisition` (`service_category_id`);--> statement-breakpoint
CREATE INDEX `service_description_idx` ON `fims_service_requisition` (`service_description_id`);--> statement-breakpoint
CREATE INDEX `requisition_no_idx` ON `fims_service_requisition` (`requisition_no`);--> statement-breakpoint
CREATE INDEX `rejection_id` ON `fims_subscription_details` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `provider_id` ON `fims_subscription_details` (`provider_id`);--> statement-breakpoint
CREATE INDEX `subscription_id` ON `fims_subscription_details` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `reference_no` ON `fims_subscription_details` (`reference_no`);--> statement-breakpoint
CREATE INDEX `rejection_id` ON `fims_utility_details` (`rejection_id`);--> statement-breakpoint
CREATE INDEX `utility_type_id` ON `fims_utility_details` (`utility_type_id`);--> statement-breakpoint
CREATE INDEX `reference_no` ON `fims_utility_details` (`reference_no`);--> statement-breakpoint
CREATE INDEX `service_provider_id` ON `fims_utility_details` (`service_provider_id`);