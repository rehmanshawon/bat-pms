// import {
//   BadRequestException,
//   forwardRef,
//   Inject,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { DelegationService } from './delegation.oracle.service';
// import Common_function from 'src/global/common_function.service';
// import { KNEX_CONNECTION } from 'src/knexmodule';
// //import { StockReconciliationService } from 'src/modules/supplychain/stock-reconciliation/stock_reconciliation.service';
// //import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';
// import { KnexErrorService } from '../common/knexerrors';
// import { IdlogicService } from '../idlogic';
// import { RentalScheduleService } from 'src/modules/rental/agreements/rental-schedule.service';
// //import { StockRequisitionService } from 'src/modules/supplychain/stock-requisition/stock-requisition.service';
// import AutoVoucher from 'src/global/autovoucher.service';

// @Injectable()
// export class AfterDelegationService {
//   constructor(
//     @Inject(KNEX_CONNECTION) private readonly knex,
//     private readonly knexErrorService: KnexErrorService,
//    // private readonly stockReconciliationService: StockReconciliationService,
//     private readonly idlogic: IdlogicService,
//    // private readonly supplyChainService: SupplyChainService,
//     //private readonly stockRequisitionService: StockRequisitionService,
//     private readonly helpers: Common_function,
//     private readonly rentalScheduleService: RentalScheduleService,
//     private readonly autovoucher: AutoVoucher,
//     @Inject(forwardRef(() => DelegationService))
//     private readonly delegationService: DelegationService,
//   ) {}
//   async afterInitialFunction(code, data) {
//     return 'return test data wow node js';
//   }
//   async productServiceUpdate(code) {
//     // const code = 'VPC-22-06-000008';
//     const result = await this.knex('vt_vat_vs_products')
//       .select('product_id', 'vat_service_code')
//       .first()
//       .where('vat_vs_product_code', code)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     await this.knex('config_products')
//       .update({
//         vat_service_code: result.vat_service_code,
//       })
//       .where('product_id', result.product_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     return {
//       message: 'update successfully',
//       data: code,
//     };
//   }
//   async deferRequistionDatechange(code, data) {
//     const currentDate = new Date();
//     const nextDay = new Date();
//     nextDay.setDate(currentDate.getDate() + 1);
//     const tomorrow = nextDay.toJSON().slice(0, 10).replace(/-/g, '/');
//     try {
//       const req = await this.knex('cit_defers')
//         .select('requisition_id')
//         .first()
//         .where('defer_code', code);
//       const nextDay = this.helpers.cmnDatetime(tomorrow);

//       const result = await this.knex('cit_requisitions')
//         .update({
//           request_for_date: nextDay,
//         })
//         .where('requisition_id', req.requisition_id)
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     } catch (error) {
//       throw new BadRequestException(error);
//     }
//   }

//   async activeProduct(code, data) {
//     await this.knex('config_products')
//       .update({
//         status: 1,
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//       })
//       .where('product_id', code)
//       .where('company_id', data.user_data?.company_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   // async parentApproved(code, data) {
//   //   if (code) {
//   //     const result = await this.stockRequisitionService.requisitionInformation(
//   //       code,
//   //       data.user_data.company_id,
//   //     );
//   //     const { requsitionData, parent_requisition_id } = result;
//   //     let isApproved = true;
//   //     requsitionData.map((item) => {
//   //       if (item.requisition_status !== 63) {
//   //         isApproved = false;
//   //       }
//   //     });
//   //     if (isApproved) {
//   //       await this.knex('sc_requisitions')
//   //         .update({
//   //           requisition_status: 63,
//   //         })
//   //         .where('requisition_id', parent_requisition_id)
//   //         .where('company_id', data.user_data?.company_id)
//   //         .where('status', 1)
//   //         .catch((error) => this.knexErrorService.errorMessage(error.message));
//   //     }
//   //   }
//   // }

//   async approvedFileIssued(code, data) {
//     const requisitions = await this.knex('csa_file_requisitions as req')
//       .select(
//         'req.file_requisition_id',
//         'req.file_doc_id as doc_id',
//         'file.box_id as box_id',
//         'doc.file_id as file_id',
//       )
//       .where({
//         'req.file_issued_code': code,
//         'req.status': '1',
//       })
//       .leftJoin('csa_file_docs as doc', 'doc.file_doc_id', 'req.file_doc_id')
//       .leftJoin('csa_files as file', 'file.file_id', 'doc.file_id')
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex.transaction((trx: any) => {
//       const queries = [];
//       requisitions.map((requisition: any) => {
//         const payload = {
//           updated_by: data.user_data?.user_id,
//           updated_at: this.helpers.cmnDatetime(),
//         };
//         const doc = this.knex('csa_file_docs')
//           .update({ unbox_ref_id: requisition.file_requisition_id })
//           .where('file_doc_id', requisition.doc_id)
//           .transacting(trx)
//           .catch((error) => this.knexErrorService.errorMessage(error.message));
//         queries.push(doc);

//         const file = this.knex('csa_files')
//           .update({ ...payload, file_status: 'Unbox' })
//           .where('file_id', requisition.file_id)
//           .transacting(trx)
//           .catch((error) => this.knexErrorService.errorMessage(error.message));
//         queries.push(file);
//       });
//       Promise.all(queries).then(trx.commit).catch(trx.rollback);
//     });
//   }

//   async afterAssetAssigned(code, data) {
//     const asset = await this.knex('fam_asset_assigns')
//       .select('asset_id')
//       .where({ status: 1, asset_assign_id: parseInt(code) })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex('fam_assets')
//       .update({
//         asset_status: 133,
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//       })
//       .where('asset_id', asset.asset_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   async afterApporveBookValue(code, data) {
//     const book_value = await this.knex('fam_asset_book_values as book_value')
//       .select(
//         'book_value.*',
//         'fam_assets.current_life_time',
//         'fam_assets.current_book_value',
//       )
//       .where({
//         'book_value.status': 1,
//         'book_value.asset_book_value_id': parseInt(code),
//       })
//       .leftJoin('fam_assets', 'fam_assets.asset_id', 'book_value.asset_id')
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex('fam_assets')
//       .update({
//         current_life_time:
//           book_value.life_time_type == 'increase'
//             ? book_value.current_life_time + book_value.life_time
//             : book_value.current_life_time - book_value.life_time,
//         current_book_value:
//           book_value.book_value_type == 'increase'
//             ? book_value.current_book_value + book_value.book_value
//             : book_value.current_book_value - book_value.book_value,
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//       })
//       .where('asset_id', book_value.asset_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   async afterApporveFamWorkOrder(code, data) {
//     const workOrder = await this.knex('fam_work_orders')
//       .select('work_order_id')
//       .where({
//         status: 1,
//         work_order_code: code,
//       })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex('fam_maint_requests')
//       .update({
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//         current_branch: data.user_data?.branch_id,
//         maint_request_status: 203,
//       })
//       .where('work_order_id', workOrder.work_order_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   // async afterapprovedReconciliationCreateChallan(code, data) {
//   //   const stockReconciliationDataWithMessage =
//   //     await this.stockReconciliationService.findOne(code, data.user_data);
//   //   const stockReconciliationData = stockReconciliationDataWithMessage.data;
//   //   const idlogicData = {
//   //     slug: 'sc_auto_challan',
//   //     companyId: data.user_data.company_id,
//   //     date: null,
//   //     data: {
//   //       // BR: 20,
//   //     },
//   //   };
//   //   const challan_code = await this.idlogic.generateId(idlogicData);
//   //   const insertChallanData = [];
//   //   stockReconciliationData.items.map((item) => {
//   //     const challanObj = {
//   //       company_id: data.user_data.company_id,
//   //       challan_code: challan_code,
//   //       challan_date: stockReconciliationData.reconciliation_date,
//   //       challan_warehouse_id: stockReconciliationData.reconciliation_wh_id,
//   //       branch_id: stockReconciliationData.reconciliation_branch_id,
//   //       delivery_address: stockReconciliationData.branch_address,
//   //       challan_type: 'Auto',
//   //       challan_ref: 'sc_reconciliation_items',
//   //       challan_ref_id: item.reconciliation_item_id,
//   //       product_id: item.product_id,
//   //       challan_qty: item.used_qty,
//   //       challan_status: 108,
//   //       created_by: stockReconciliationData.created_by,
//   //       created_at: this.helpers.cmnDatetime(),
//   //     };
//   //     insertChallanData.push(challanObj);
//   //   });
//   //   const result = await this.supplyChainService.insert(
//   //     'sc_challans',
//   //     insertChallanData,
//   //   );
//   //   if (!result) {
//   //     return await this.supplyChainService.returnMessageWithData(
//   //       'supply_chain',
//   //       'sc_challans_create_error',
//   //       'sc_challans',
//   //       [],
//   //     );
//   //   }
//   // }

//   // async updateApprovedQtyForStockRequisition(code, data) {
//   //   if (code) {
//   //     await this.knex
//   //       .raw(
//   //         `UPDATE "sc_requisition_items" 
//   //     SET "approved_qty" = "request_qty" 
//   //     WHERE
//   //       "requisition_item_id" IN (
//   //       SELECT
//   //         "sc_requisition_items"."requisition_item_id" 
//   //       FROM
//   //         "sc_requisitions"
//   //         INNER JOIN "sc_requisition_items" ON "sc_requisitions"."requisition_id" = "sc_requisition_items"."parent_requisition_id" 
//   //         AND "sc_requisitions"."company_id" = "sc_requisition_items"."company_id" 
//   //         AND "sc_requisition_items"."status" = 1 
//   //         AND "sc_requisition_items"."approved_qty" = 0.00000 
//   //         OR "sc_requisition_items"."approved_qty" IS NULL
//   //       WHERE
//   //         "sc_requisitions"."requisition_code" = '${code}' 
//   //         AND "sc_requisitions"."company_id" = ${data.user_data.company_id} 
//   //       AND "sc_requisitions"."status" = 1 
//   //       )`,
//   //       )
//   //       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   //     const user_data = data.user_data;

//   //     await this.stockRequisitionService.splitRequisition(code, user_data);
//   //     const parent_requisition_data = await this.knex('sc_requisitions')
//   //       .select('requisition_id', 'requisition_condition')
//   //       .where({ status: 1, requisition_code: code })
//   //       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   //     const child_requisition_code = [];
//   //     const delegationVersion = [];
//   //     let dbData = [];

//   //     if (parent_requisition_data[0].requisition_condition === 'Office Use') {
//   //       if (parent_requisition_data.length > 0) {
//   //         dbData = await this.knex('sc_requisitions')
//   //           .select('requisition_id', 'requisition_code', 'requisition_type_id')
//   //           .where({
//   //             status: 1,
//   //             parent_requisition_id: parent_requisition_data[0].requisition_id,
//   //           })
//   //           .catch((error) =>
//   //             this.knexErrorService.errorMessage(error.message),
//   //           );
//   //       }
//   //       if (dbData.length > 0) {
//   //         dbData.map((item) => {
//   //           child_requisition_code.push(item.requisition_code);
//   //           delegationVersion.push(item.requisition_type_id);
//   //         });
//   //         const payload = {
//   //           slug: 'stock_requisition_child',
//   //           code: child_requisition_code,
//   //           delegation_type: 'send_for_approval',
//   //           delegation_version: delegationVersion,
//   //           additional_data: '',
//   //           comments: '',
//   //         };
//   //         console.log('payload', payload);
//   //         const result = await this.delegationService.sendForApproval(
//   //           payload,
//   //           data.user_data,
//   //         );
//   //         if (result.length === null || result === undefined) {
//   //           throw new InternalServerErrorException(
//   //             'Department wise requisition configure failed!',
//   //           );
//   //         }
//   //       }
//   //     }
//   //   }
//   // }

//   // updateApprovedQtyForPurchaseRequisition
//   async updateApprovedQtyForPurchaseRequisition(code, data) {
//     await this.knex
//       .raw(
//         `UPDATE "sc_purchase_requisition_items" 
//         SET "approved_qty" = "request_qty" 
//         WHERE
//           "purchase_requisition_item_id" IN (
//           SELECT
//             "sc_purchase_requisition_items"."purchase_requisition_item_id" 
//           FROM
//             "sc_purchase_requisitions"
//             INNER JOIN "sc_purchase_requisition_items" ON "sc_purchase_requisitions"."purchase_requisition_id" = "sc_purchase_requisition_items"."purchase_requisition_id" 
//             AND "sc_purchase_requisitions"."company_id" = "sc_purchase_requisition_items"."company_id" 
//             AND "sc_purchase_requisition_items"."status" = 1 
//             AND "sc_purchase_requisition_items"."approved_qty" = 0.00000 
//             OR "sc_purchase_requisition_items"."approved_qty" IS NULL 
//           WHERE
//             "sc_purchase_requisitions"."purchase_requisition_code" = '${code}' 
//             AND "sc_purchase_requisitions"."company_id" = ${data.user_data.company_id} 
//           AND "sc_purchase_requisitions"."status" = 1 
//           )`,
//       )
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   /*HELPER   FUNCTION    CHALLAN    POSTING*/
//   async getChallan(challan_code: string, company_id: number) {
//     const challanData = await this.knex
//       .raw(
//         `SELECT
//               "sc_challans"."challan_id",
//               "sc_challans"."challan_code",
//               "sc_challans"."challan_warehouse_id",
//               "sc_challans"."product_id",
//               "sc_challans"."challan_qty",
//               "sc_challans"."challan_ref",
//               "sc_challans"."challan_ref_id",
//               "sc_challans"."challan_date",
//               "config_products"."stock_out_type",
//               "sc_requisitions"."requisition_id",
//               "sc_reconciliations"."reconciliation_id",
//               "sc_requisition_types"."requisition_type_name" 
//             FROM
//               "sc_challans"
//               INNER JOIN "config_products" ON "sc_challans"."product_id" = "config_products"."product_id" 
//               AND "sc_challans"."company_id" = "config_products"."company_id"
//               LEFT JOIN "sc_reconciliation_items" ON "sc_challans"."company_id" = "sc_reconciliation_items"."company_id" 
//               AND "sc_challans"."product_id" = "sc_reconciliation_items"."product_id" 
//               AND "sc_challans"."challan_ref" = 'sc_reconciliation_items' 
//               AND "sc_challans"."challan_ref_id" = "sc_reconciliation_items"."reconciliation_item_id"
//               LEFT JOIN "sc_reconciliations" ON "sc_reconciliation_items"."company_id" = "sc_reconciliations"."company_id" 
//               AND "sc_reconciliation_items"."reconciliation_id" = "sc_reconciliations"."reconciliation_id"
//               LEFT JOIN "sc_requisition_items" ON "sc_challans"."company_id" = "sc_requisition_items"."company_id" 
//               AND "sc_challans"."product_id" = "sc_requisition_items"."product_id" 
//               AND "sc_challans"."challan_ref" = 'sc_requisition_items' 
//               AND "sc_challans"."challan_ref_id" = "sc_requisition_items"."requisition_item_id"
//               LEFT JOIN "sc_requisitions" ON "sc_requisition_items"."company_id" = "sc_requisitions"."company_id" 
//               AND "sc_requisition_items"."requisition_id" = "sc_requisitions"."requisition_id"
//               LEFT JOIN "sc_requisition_types" ON "sc_requisitions"."requisition_type_id" = "sc_requisition_types"."requisition_type_id" 
//               AND "sc_requisitions"."company_id" = "sc_requisition_types"."company_id" 
//             WHERE
//               "sc_challans"."challan_code" = '${challan_code}'
//               AND "sc_challans"."company_id" = ${company_id}
//               AND "sc_challans"."status" = 1`,
//       )
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     return challanData;
//   }

//   async getNextUnpackedProductReceiveId(
//     warehouseId: number,
//     productId: number,
//     company_id: number,
//     orderType: string,
//   ) {
//     // const product_receive_id_data = await this.knex.raw(`SELECT
//     //         "sc_product_receives"."product_receive_id"
//     //       FROM
//     //         "sc_product_receives"
//     //       WHERE
//     //         "sc_product_receives"."warehouse_id" = ${warehouseId}
//     //         AND "sc_product_receives"."product_id" = ${productId}
//     //         AND "sc_product_receives"."stock_out_status" = 'Packed'
//     //         AND "sc_product_receives"."company_id" = ${company_id}
//     //         AND "sc_product_receives"."status" = 1
//     //         AND "sc_product_receives"."product_receive_status" = 103
//     //       ORDER BY
//     //         "stock_in_date" ${orderType}
//     //         FETCH FIRST 1 ROWS ONLY `);
//     const product_receive_id_data = await this.knex('sc_product_receives')
//       .pluck('sc_product_receives.product_receive_id')
//       .where('sc_product_receives.warehouse_id', warehouseId)
//       .where('sc_product_receives.product_id', productId)
//       .where('sc_product_receives.stock_out_status', 'Packed')
//       .where('sc_product_receives.company_id', company_id)
//       .where('sc_product_receives.status', 1)
//       .where('sc_product_receives.product_receive_status', 103)
//       .orderBy('stock_in_date', orderType);
//     const product_receive_id = product_receive_id_data[0];
//     return product_receive_id;
//   }

//   async updateStockOutStatusForPacked(
//     UpdateData: any,
//     ProductReceiveIds: any,
//     company_id: number,
//   ) {
//     return await this.knex('sc_product_receives')
//       .update(UpdateData)
//       .whereIn('sc_product_receives.product_receive_id', ProductReceiveIds)
//       .where('sc_product_receives.company_id', company_id)
//       .where('sc_product_receives.status', 1)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   async getProductReceivesDependOnStockOutStatus(
//     company_id: number,
//     warehouseId: number,
//     productIds: any,
//     stock_out_status: string,
//     product_receive_status: number,
//   ) {
//     const unpacked_records_with_rows = await this.knex
//       .raw(
//         `SELECT
//               "sc_product_receives"."product_receive_id",
//               "sc_product_receives"."warehouse_id",
//               "sc_product_receives"."product_id",
//               CASE WHEN "sc_product_receives"."stock_out_qty" IS NULL THEN 0 ELSE "sc_product_receives"."stock_out_qty" END AS "stock_out_qty",
//               CASE WHEN "sc_product_receives"."stock_out_qty" IS NULL THEN "sc_product_receives"."receive_qty" ELSE ("sc_product_receives"."receive_qty" - "sc_product_receives"."stock_out_qty") END AS "remaining_qty",
//               CASE WHEN "sc_product_receives"."unit_purchase_price" IS NULL THEN 0 ELSE "sc_product_receives"."unit_purchase_price" END AS "unit_purchase_price",
//               "config_products"."stock_out_type"  
//         FROM
//           "sc_product_receives"
//           LEFT JOIN "config_products" ON "sc_product_receives"."product_id" = "config_products"."product_id" 
//           AND "sc_product_receives"."company_id" = "config_products"."company_id" 
//         WHERE
//           "sc_product_receives"."company_id" = ${company_id} 
//           AND "sc_product_receives"."warehouse_id" = ${warehouseId} 
//           AND "sc_product_receives"."product_id" IN (${productIds}) 
//           AND "sc_product_receives"."stock_out_status" = '${stock_out_status}'
//           AND "sc_product_receives"."status" = 1 
//           AND "sc_product_receives"."product_receive_status" = ${product_receive_status}`,
//       )
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     return unpacked_records_with_rows;
//   }

//   // async UnpackedProductReceivesData(
//   //   challanData: any,
//   //   productIds: any,
//   //   warehouseId: number,
//   //   user_data: any,
//   // ) {
//   //   const updatedProductReceiveIds = [];
//   //   const unpacked_records =
//   //     await this.getProductReceivesDependOnStockOutStatus(
//   //       user_data.company_id,
//   //       warehouseId,
//   //       productIds,
//   //       'Unpacked',
//   //       103, // product_receive_status approved
//   //     );
//   //   /*check pack or unpack*/
//   //   if (unpacked_records.length === 0 || unpacked_records === undefined) {
//   //     /*update stock_out_type*/
//   //     for (const i in challanData) {
//   //       const productData = challanData[i];
//   //       const order = productData.stock_out_type === 'FIFO' ? 'ASC' : 'DESC';
//   //       const productReceiveId = await this.getNextUnpackedProductReceiveId(
//   //         warehouseId,
//   //         productData.product_id,
//   //         user_data.company_id,
//   //         order,
//   //       );
//   //       updatedProductReceiveIds.push(productReceiveId);
//   //     }
//   //     if (updatedProductReceiveIds.length > 0) {
//   //       await this.updateStockOutStatusForPacked(
//   //         {
//   //           stock_out_status: 'Unpacked',
//   //           stock_out_qty: 0,
//   //         },
//   //         updatedProductReceiveIds,
//   //         user_data.company_id,
//   //       );
//   //       await this.UnpackedProductReceivesData(
//   //         challanData,
//   //         productIds,
//   //         warehouseId,
//   //         user_data,
//   //       );
//   //     }
//   //   } else {
//   //     const notFoundProductId = [];
//   //     const insertProductTransactions = [];
//   //     for (const i in unpacked_records) {
//   //       let outQty = 0;
//   //       const unpackedRecord = unpacked_records[i];
//   //       const challanProductData = challanData.find(
//   //         (element) => element.product_id === unpackedRecord.product_id,
//   //       );
//   //       if (unpackedRecord.remaining_qty > 0) {
//   //         //product distribute
//   //         if (unpackedRecord.remaining_qty === challanProductData.challan_qty) {
//   //           outQty = challanProductData.challan_qty;
//   //           await this.knex('sc_product_receives')
//   //             .update({
//   //               stock_out_qty:
//   //                 unpackedRecord.stock_out_qty + challanProductData.challan_qty,
//   //               stock_out_status: 'Stock Out',
//   //             })
//   //             .where(
//   //               'sc_product_receives.product_receive_id',
//   //               unpackedRecord.product_receive_id,
//   //             )
//   //             .where('sc_product_receives.company_id', user_data.company_id)
//   //             .where('sc_product_receives.status', 1)
//   //             .catch((error) =>
//   //               this.knexErrorService.errorMessage(error.message),
//   //             );
//   //         } else if (
//   //           unpackedRecord.remaining_qty > challanProductData.challan_qty
//   //         ) {
//   //           outQty = challanProductData.challan_qty;
//   //           await this.knex('sc_product_receives')
//   //             .increment('stock_out_qty', challanProductData.challan_qty)
//   //             .where(
//   //               'sc_product_receives.product_receive_id',
//   //               unpackedRecord.product_receive_id,
//   //             )
//   //             .where('sc_product_receives.company_id', user_data.company_id)
//   //             .where('sc_product_receives.status', 1)
//   //             .catch((error) =>
//   //               this.knexErrorService.errorMessage(error.message),
//   //             );
//   //         } else {
//   //           outQty = unpackedRecord.remaining_qty;
//   //           await this.knex('sc_product_receives')
//   //             .update({
//   //               stock_out_qty:
//   //                 unpackedRecord.stock_out_qty + unpackedRecord.remaining_qty,
//   //               stock_out_status: 'Stock Out',
//   //             })
//   //             .where(
//   //               'sc_product_receives.product_receive_id',
//   //               unpackedRecord.product_receive_id,
//   //             )
//   //             .where('sc_product_receives.company_id', user_data.company_id)
//   //             .where('sc_product_receives.status', 1)
//   //             .catch((error) =>
//   //               this.knexErrorService.errorMessage(error.message),
//   //             );
//   //         }
//   //         let trans_ref: string;
//   //         let trans_ref_id = 0;
//   //         let usedQty = 0;
//   //         let transferQty = 0;
//   //         const stockinQty = 0;
//   //         const soldQty = 0;
//   //         const damagedQty = 0;
//   //         const productionQty = 0;
//   //         // text, 'sc_reconciliations'::text
//   //         if (challanProductData.challan_ref === 'sc_reconciliation_items') {
//   //           trans_ref = 'sc_reconciliations';
//   //           trans_ref_id = challanProductData.reconciliation_id;
//   //           usedQty = outQty;
//   //         } else {
//   //           switch (challanProductData.requisition_type_name) {
//   //             case 'Office use':
//   //               trans_ref = 'sc_requisitions';
//   //               trans_ref_id = challanProductData.requisition_id;
//   //               usedQty = outQty;
//   //               break;
//   //             default:
//   //               trans_ref = 'sc_requisitions';
//   //               trans_ref_id = challanProductData.requisition_id;
//   //               transferQty = outQty;
//   //           }
//   //         }
//   //         const insertTransactionsObj = {
//   //           company_id: user_data.company_id,
//   //           challan_id: challanProductData.challan_id,
//   //           product_receive_id: unpackedRecord.product_receive_id,
//   //           trans_ref: trans_ref,
//   //           trans_ref_id: trans_ref_id,
//   //           trans_date: this.helpers.cmnDatetime(
//   //             challanProductData.challan_date,
//   //           ),
//   //           unit_purchase_price: unpackedRecord.unit_purchase_price,
//   //           warehouse_id: warehouseId,
//   //           product_id: unpackedRecord.product_id,
//   //           stockin_qty: stockinQty,
//   //           transfer_qty: transferQty,
//   //           sold_qty: soldQty,
//   //           used_qty: usedQty,
//   //           damaged_qty: damagedQty,
//   //           production_qty: productionQty,
//   //           created_by: user_data.user_id,
//   //           created_at: this.helpers.cmnDatetime(),
//   //         };
//   //         insertProductTransactions.push(insertTransactionsObj);
//   //         challanData.map((item) => {
//   //           const remaining = item.challan_qty - outQty;
//   //           if (
//   //             unpackedRecord.product_id === item.product_id &&
//   //             remaining > 0
//   //           ) {
//   //             item.challan_qty = item.challan_qty - outQty;
//   //             notFoundProductId.push(item.product_id);
//   //           }
//   //         });
//   //       } else {
//   //         // unpack next product by stock_out_type
//   //         const order =
//   //           unpackedRecord.stock_out_type === 'FIFO' ? 'ASC' : 'DESC';
//   //         const productReceiveId = await this.getNextUnpackedProductReceiveId(
//   //           warehouseId,
//   //           unpackedRecord.product_id,
//   //           user_data.company_id,
//   //           order,
//   //         );
//   //         updatedProductReceiveIds.push(productReceiveId);
//   //         notFoundProductId.push(unpackedRecord.product_id);
//   //       }
//   //     }
//   //     if (updatedProductReceiveIds.length > 0) {
//   //       await this.updateStockOutStatusForPacked(
//   //         {
//   //           stock_out_status: 'Unpacked',
//   //           stock_out_qty: 0,
//   //         },
//   //         updatedProductReceiveIds,
//   //         user_data.company_id,
//   //       );
//   //     }
//   //     if (notFoundProductId.length > 0) {
//   //       await this.UnpackedProductReceivesData(
//   //         challanData,
//   //         notFoundProductId,
//   //         warehouseId,
//   //         user_data,
//   //       );
//   //     }
//   //     if (insertProductTransactions.length > 0) {
//   //       await this.supplyChainService.insert(
//   //         'sc_product_transactions',
//   //         insertProductTransactions,
//   //       );
//   //     }
//   //   }
//   // }

//   async challanPosting(code, data) {
//     const challanData = await this.getChallan(code, data.user_data.company_id);
//     // get product and warehouse id
//     const productIds = [];
//     let warehouseId: number;
//     challanData.forEach((product: any) => {
//       (warehouseId = product.challan_warehouse_id),
//         productIds.push(product.product_id);
//     });

//     // product distribution
//     await this.UnpackedProductReceivesData(
//       challanData,
//       productIds,
//       warehouseId,
//       data.user_data,
//     );
//     return 'challan posting done!!';
//   }

//   // Rental module after approval functions Start
//   async agreementApproved(code, data) {
//     const agreement = await this.knex('rms_agreements')
//       .select('rms_agreements.*')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     if (agreement.parent_agreement_id) {
//       await this.knex('rms_agreements')
//         .update({
//           status_flow_id: 28,
//           updated_by: data.user_data?.user_id,
//           updated_at: this.helpers.cmnDatetime(),
//         })
//         .where('agreement_id', agreement.parent_agreement_id)
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     }
//     // check enhancementRules empty. if empty insert default one
//     await this.checkEnhancementRulesIsEmpty(agreement, data);
//   }

//   async checkEnhancementRulesIsEmpty(agreement, data) {
//     const enhancementRules = await this.knex('rms_enhancement_rules')
//       .select('agreement_id')
//       .where('agreement_id', agreement.agreement_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     if (enhancementRules.length === 0) {
//       const insert_data = {
//         company_id: data.user_data.company_id,
//         enhancement_rule: 'Manual',
//         premises_id: agreement.premises_id,
//         agreement_id: agreement.agreement_id,
//         effictive_month: this.helpers.toFormat(agreement.start_date, 'yy-mm'),
//         previous_rent: 0,
//         increase_type: 'Fixed',
//         base_rent: null,
//         ratio_value: null,
//         amount: 0,
//         current_rent: (agreement.per_unit_rent * agreement.total_area).toFixed(
//           2,
//         ),
//         comments: null,
//         created_by: data.user_data.user_id,
//         created_at: this.helpers.cmnDatetime(),
//       };
//       await this.knex('rms_enhancement_rules')
//         .insert(insert_data)
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     }
//   }

//   async additionalAdvanceApproved(code, data) {
//     await this.regenerateRentalSchedule(code, data);

//     const agg_info = await this.knex('rms_agreements')
//       .select('agreement_id')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     // generate auto voucher
//     const post_data = {
//       event: 'additional_advance_approved',
//       product: 'advance',
//       refid: agg_info.agreement_id,
//       amount: 0,
//       voucherno: '',
//       voucherdate: this.helpers.cmnDatetime(),
//       ref: 'Additional Advance Approved',
//       narration: 'Additional Advance Approved',
//       user_data: data.user_data,
//     };
//     await this.autovoucher.GenerateAutoVoucher(post_data);
//   }

//   async agreementExtenedStatusUpdate(agreement_id, data, status_flow_id) {
//     await this.knex('rms_agreement_extend_records')
//       .update({
//         status_flow_id: status_flow_id,
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//       })
//       .where({ agreement_id: agreement_id })
//       .whereIn('status_flow_id', [26, 27])
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }

//   async agreementExtenedInitialize(code, data) {
//     const ag_info = await this.knex('rms_agreements')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     await this.agreementExtenedStatusUpdate(ag_info.agreement_id, data, 27);
//   }

//   async agreementExtenedDeclined(code, data) {
//     const ag_info = await this.knex('rms_agreements')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.agreementExtenedStatusUpdate(ag_info.agreement_id, data, 26);
//   }

//   async agreementExtendApproved(code, data) {
//     const extend_record = await this.knex('rms_agreements')
//       .select('rms_agreement_extend_records.expiry_date')
//       .where({ agreement_code: code, 'rms_agreement_extend_records.status': 1 })
//       .leftJoin('rms_agreement_extend_records', function () {
//         this.on(
//           'rms_agreement_extend_records.agreement_id',
//           '=',
//           'rms_agreements.agreement_id',
//         ).on(
//           'rms_agreement_extend_records.premises_id',
//           '=',
//           'rms_agreements.premises_id',
//         );
//       })
//       .orderBy(
//         'rms_agreement_extend_records.agreement_extend_record_id',
//         'desc',
//       )
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex('rms_agreements')
//       .update({ expiry_date: extend_record.expiry_date })
//       .where({ agreement_code: code })
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.regenerateRentalSchedule(code, data);
//   }

//   async enhancementRulesChangeApproved(code, data) {
//     const ifrs_config_id = await this.regenerateRentalSchedule(code, data);

//     const agg_info = await this.knex('rms_agreements')
//       .select('agreement_id')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const current = await this.knex('rms_ifrs_reports')
//       .sum('present_value as present_value')
//       .where({ agreement_id: agg_info.agreement_id })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const prev = await this.knex('rms_ifrs_reports_archive')
//       .sum('present_value as present_value')
//       .where({ agreement_id: agg_info.agreement_id, ifrs_config_id })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     const voucher_amount =
//       parseInt(current.present_value) - parseInt(prev.present_value);

//     // generate auto voucher
//     const post_data = {
//       event: 'enhancement_change',
//       product: 'enhancement',
//       refid: agg_info.agreement_id,
//       amount: voucher_amount,
//       voucherno: '',
//       voucherdate: this.helpers.cmnDatetime(),
//       ref: 'Enhancement Rules Change approved',
//       narration: 'Enhancement Rules Change approved',
//       user_data: data.user_data,
//     };
//     await this.autovoucher.GenerateAutoVoucher(post_data);
//   }

//   async regenerateRentalSchedule(code, data) {
//     const ag_info = await this.knex('rms_agreements')
//       .where({ agreement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//     await this.agreementExtenedStatusUpdate(ag_info.agreement_id, data, 18); //extends status update

//     const ifrs_configs = await this.knex('rms_ifrs_configs')
//       .select('rms_ifrs_configs.*')
//       .where({
//         agreement_id: ag_info.agreement_id,
//         premises_id: ag_info.premises_id,
//       })
//       .orderBy('ifrs_config_id', 'desc')
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const payload = {
//       premises_id: ag_info.premises_id,
//       agreement_id: ag_info.agreement_id,
//       start_date: ag_info.start_date,
//       expiry_date: ag_info.expiry_date,
//       unadjustment_amount: ifrs_configs.unadjustment_amount,
//       discount_rate: ifrs_configs.discount_rate,
//       interest_rate: ifrs_configs.interest_rate,
//       total_area: ag_info.total_area,
//       cut_of_date: ifrs_configs.cut_of_date,
//     };
//     await this.rentalScheduleService.generateRentalSchedule(
//       payload,
//       data.user_data,
//     );
//     return ifrs_configs.ifrs_config_id;
//   }

//   async sattlementApproved(code, data) {
//     const ag_info = await this.knex('rms_agreement_sattlements')
//       .select('rms_agreement_sattlements.agreement_id')
//       .where({ agreement_sattlement_code: code })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const delete_rental_schedule = await this.knex(
//       'rms_agreement_rental_schedules',
//     )
//       .where({ agreement_id: ag_info.agreement_id, is_invoice: '0' })
//       .del()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const agreement_status_update = await this.knex('rms_agreements')
//       .update({ status_flow_id: 28 })
//       .where('agreement_id', ag_info.agreement_id)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     // generate auto voucher
//     const post_data = {
//       event: 'settlement_approved',
//       product: 'settlement',
//       refid: ag_info.agreement_id,
//       amount: 0,
//       voucherno: '',
//       voucherdate: this.helpers.cmnDatetime(),
//       ref: 'Sattlement Approved',
//       narration: 'Sattlement Approved',
//       user_data: data.user_data,
//     };
//     await this.autovoucher.GenerateAutoVoucher(post_data);
//   }

//   async rentalWishListApproved(code, data) {
//     // this function actually represent three purpose
//     // First, When wishlist Sub-Branch Approved then premises will be create
//     // Second, When wishlist Branch First Approved then premises will not be create & but requistion summery data add
//     // Third, When wishlist Branch Approved then premises will be created
//     // wishlist branch first approval time, this query no data found

//     // this query describe, only requistion premises/details selected site data
//     const requisition_info = await this.knex('rms_requisitions')
//       .select(
//         'rms_requisitions.requisition_id',
//         'rms_requisitions.premises_type_id',
//         'rms_requisitions.status_flow_id',
//         'rms_requisitions.company_id',
//         'rms_requisition_sites.area',
//         'rms_requisition_sites.geo_location_id',
//         'rms_requisition_sites.area_unit',
//         'rms_requisition_details.zone_id',
//         // 'rms_requisition_sites.khotian',
//         // 'rms_requisition_sites.porcha',
//         // 'rms_requisition_sites.advance',
//         'rms_requisition_details.location_details',
//         'rms_requisition_details.geo_type',
//         'rms_requisition_details.requisition_detail_id',
//       )
//       .leftJoin(
//         'rms_requisition_details',
//         'rms_requisitions.requisition_id',
//         'rms_requisition_details.requisition_id',
//       )
//       .leftJoin('rms_requisition_sites', function () {
//         this.on(
//           'rms_requisition_sites.requisition_detail_id',
//           '=',
//           'rms_requisition_details.requisition_detail_id',
//         ).on(
//           'rms_requisition_sites.requisition_site_id',
//           '=',
//           'rms_requisition_details.requisition_site_id',
//         );
//       })
//       .where({
//         requisition_code: code,
//         'rms_requisition_details.status': 1,
//         'rms_requisition_sites.status': 1,
//       })
//       .whereNotNull('rms_requisition_details.requisition_site_id')
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const idlogicData = {
//       slug: 'premises_code',
//       companyId: data.user_data.company_id,
//       date: null,
//       data: {
//         // BR: 20,
//       },
//     };

//     // those premisess create only when requistion site data found
//     for (const item of requisition_info) {
//       if (item.status_flow_id === 222 && item.premises_type_id === 4) {
//         // wishlist sub-branch approval time, requisition status will be updated
//         await this.knex('rms_requisitions')
//           .update({ status_flow_id: 229 })
//           .where('requisition_id', item.requisition_id)
//           .catch((error) => this.knexErrorService.errorMessage(error.message));
//       }
//       const premises_code = await this.idlogic.generateId(idlogicData);

//       const payload = {
//         zone_id: item.zone_id,
//         // khotian: item.khotian,
//         // porcha: item.porcha,
//         // advance: item.advance,
//         company_id: item.company_id,
//         premises_type_id: item.premises_type_id,
//         premises_code,
//         premises_name: item.area,
//         geo_location_id: item.geo_location_id,
//         opening_date: new Date(),
//         approval_date: new Date(),
//         status_flow_id: 4,
//         address: item.location_details,
//         area_unit: item.area_unit,
//         geo_type: item.geo_type,
//         requisition_detail_id: item.requisition_detail_id,
//         created_by: data.user_data?.user_id,
//         created_at: this.helpers.cmnDatetime(),
//       };

//       const result = await this.knex('rms_premisess')
//         .insert(payload, 'premises_id')
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     }
//     // requisition_info lenth 0 only when wishlist branch first time approved
//     if (requisition_info.length === 0) {
//       // wishlist branch first approval time, summery add all premises/details count
//       const requisition_data = await this.knex('rms_requisitions')
//         .select(
//           'rms_requisitions.requisition_id',
//           'rms_requisitions.premises_type_id',
//           'rms_requisition_details.geo_type',
//           'rms_requisition_details.requisition_detail_id',
//         )
//         .leftJoin(
//           'rms_requisition_details',
//           'rms_requisitions.requisition_id',
//           'rms_requisition_details.requisition_id',
//         )
//         .where({
//           requisition_code: code,
//           'rms_requisition_details.status': 1,
//         })
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//       await this.wishlistSummerDataInsert(requisition_data, data);
//     }
//   }

//   async wishlistSummerDataInsert(requisition_info, data) {
//     // those code for rms_requisition_summarys add
//     function groupByKey(array, key) {
//       return array.reduce((hash, obj) => {
//         if (obj[key] === undefined) return hash;
//         return Object.assign(hash, {
//           [obj[key]]: (hash[obj[key]] || []).concat(obj),
//         });
//       }, {});
//     }
//     const obj = groupByKey(requisition_info, 'geo_type');
//     Object.keys(obj).forEach(async (geo_type) => {
//       const item = obj[geo_type];
//       const payload = {
//         requisition_id: item[0].requisition_id,
//         premises_type_id: item[0].premises_type_id,
//         geo_type,
//         no_of_premises: item.length,
//         approve_by_bb: null,
//         created_by: data.user_data?.user_id,
//         created_at: this.helpers.cmnDatetime(),
//       };
//       await this.knex('rms_requisition_summarys')
//         .insert(payload, 'requisition_summary_id')
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     });
//     // those code for rms_requisition_summarys add
//   }

//   async afterApporvePaymentSchedule(code, data) {
//     const agreement = await this.knex('rms_payment_schedules')
//       .distinct('rms_payment_schedule_details.agreement_id as agreement_id')
//       .leftJoin(
//         'rms_payment_schedule_details',
//         'rms_payment_schedules.payment_schedule_id',
//         'rms_payment_schedule_details.payment_schedule_id',
//       )
//       .where({
//         'rms_payment_schedules.status': 1,
//         'rms_payment_schedules.payment_schedule_code': code,
//       })
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const agreement_ids = agreement.map((agg) => agg.agreement_id);

//     // update rms_agreements
//     await this.knex('rms_agreements')
//       .update({
//         updated_by: data.user_data?.user_id,
//         updated_at: this.helpers.cmnDatetime(),
//         status_flow_id: 18,
//       })
//       .whereIn('agreement_id', agreement_ids)
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     const paymentScheduleData = await this.knex('rms_payment_schedules')
//       .select('payment_schedule_id', 'rental_month')
//       .where({
//         payment_schedule_code: code,
//       })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     // update hold agrement data
//     const holdData = await this.knex('rms_hold_cost_components')
//       .where({
//         payment_schedule_id: paymentScheduleData.payment_schedule_id,
//       })
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     if (holdData.length > 0) {
//       const ag_ids = [];

//       for (const item of holdData) {
//         ag_ids.push(item.agreement_id);
//         await this.knex('rms_agreement_additional_costs')
//           .update({ is_hold: 1, hold_from: paymentScheduleData.rental_month })
//           .where({
//             agreement_id: item.agreement_id,
//             cost_component_id: item.cost_component_id,
//           })
//           .catch((error) => this.knexErrorService.errorMessage(error.message));

//         await this.knex('rms_hold_cost_components')
//           .update({ hold_status: 255 })
//           .where({ hold_cost_component_id: item.hold_cost_component_id })
//           .catch((error) => this.knexErrorService.errorMessage(error.message));
//       }

//       await this.knex('rms_agreement_rental_schedules')
//         .update({ is_hold: 1, hold_from: paymentScheduleData.rental_month })
//         .where(function () {
//           this.where(
//             'payment_month',
//             '>',
//             paymentScheduleData.rental_month,
//           ).orWhere('payment_month', '=', paymentScheduleData.rental_month);
//         })
//         .whereIn('agreement_id', ag_ids)
//         .catch((error) => this.knexErrorService.errorMessage(error.message));
//     }

//     // generate auto voucher
//     const post_data = {
//       event: 'payment_schedule_approved',
//       product: 'payment_schedule',
//       refid: paymentScheduleData.payment_schedule_id,
//       amount: 0,
//       voucherno: '',
//       voucherdate: this.helpers.cmnDatetime(),
//       ref: 'Payment Schedule approved',
//       narration: 'Payment Schedule approved',
//       user_data: data.user_data,
//     };
//     await this.autovoucher.GenerateAutoVoucher(post_data);
//   }

//   async afterApporveVatChange(code, data) {
//     const vatData = await this.knex('rms_vat_changes')
//       .select('current_vat_rate', 'applied_vat_rate')
//       .where({
//         status: 1,
//         vat_change_code: code,
//       })
//       .first()
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     await this.knex('rms_agreement_rental_schedules')
//       .update({
//         vat_service_code: vatData.current_vat_rate,
//         vat_rate: vatData.applied_vat_rate,
//       })
//       .where({ is_invoice: 0 })
//       .catch((error) => this.knexErrorService.errorMessage(error.message));

//     //rms_vat_changes previous data status update
//     await this.knex('rms_vat_changes')
//       .update({
//         vat_change_status: 266,
//       })
//       .whereNot({ vat_change_code: code })
//       .where({
//         vat_change_status: 265,
//       })
//       .catch((error) => this.knexErrorService.errorMessage(error.message));
//   }
//   // Rental module after approval functions End
// }
