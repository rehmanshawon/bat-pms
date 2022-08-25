import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadInterface } from 'src/apsisengine/auth/interfaces';
import MessageHelper from 'src/apsisengine/common/helpers/messageHelper';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
//import { SupplyChainService } from 'src/modules/supplychain/supplychain.service';
//import { ProductDataDto } from 'src/modules/common-feature/product/product-data/dto';

@Injectable()
export class ProductDataService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private readonly knexErrorService: KnexErrorService,
    private readonly messageHelper: MessageHelper,
    //private readonly supplyChainService: SupplyChainService,
  ) {}

  // async product(
  //   productDataDto: ProductDataDto,
  //   userPayload: JwtPayloadInterface,
  // ) {
  //   const productTableData = await this.knex('config_products')
  //     .whereIn('config_products.product_id', productDataDto.product_id)
  //     .where('config_products.company_id', userPayload.company_id)
  //     .where('config_products.status', 1)
  //     .select(
  //       'config_products.product_id',
  //       'config_products.product_name',
  //       'config_products.product_code',
  //       'config_products.cas_number',
  //       'config_products.hs_code',
  //       'config_products.product_category_id',
  //       'config_products.product_category',
  //       'config_products.product_brand_id',
  //       'config_product_brands.brand_name',
  //       'config_product_brands.brand_short_code',
  //       'config_products.product_types',
  //       'config_products.operational_type',
  //       'config_products.operational_group',
  //       'config_products.reorder_qty',
  //       'config_products.minimum_order_qty',
  //       'config_products.stock_out_type',
  //       'config_products.last_purchase_price',
  //       'config_products.default_uom',
  //       'config_products.uoms_measurement',
  //       'config_products.product_description',
  //       'config_products.product_status',
  //     )
  //     .leftJoin('config_product_brands', function () {
  //       this.on(
  //         'config_products.product_brand_id',
  //         'config_product_brands.brand_id',
  //       ).on('config_products.company_id', 'config_product_brands.company_id');
  //     })
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));
  //   const productSpecificationTableData = await this.knex(
  //     'config_product_specifications',
  //   )
  //     .where('config_product_specifications.spec_ref', 'config_products')
  //     .whereIn(
  //       'config_product_specifications.spec_ref_id',
  //       productDataDto.product_id,
  //     )
  //     .where('config_product_specifications.company_id', userPayload.company_id)
  //     .where('config_product_specifications.status', 1)
  //     .select(
  //       'config_product_specifications.product_specification_id AS key',
  //       'config_product_specifications.product_specification_id',
  //       'config_product_specifications.spec_ref',
  //       'config_product_specifications.spec_ref_id',
  //       'config_product_specifications.spec_name',
  //       'config_product_specifications.spec_unit',
  //       'config_product_specifications.spec_standard',
  //       'config_product_specifications.spec_value',
  //       'config_product_specifications.spec_input_type',
  //       'config_product_specifications.dropdown_options',
  //       'config_product_specifications.editable',
  //     )
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   const productSpecificationOtherTableData = await this.knex(
  //     'config_product_spec_others',
  //   )
  //     .where('config_product_spec_others.spec_ref', 'config_products')
  //     .whereIn(
  //       'config_product_spec_others.spec_ref_id',
  //       productDataDto.product_id,
  //     )
  //     .where('config_product_spec_others.company_id', userPayload.company_id)
  //     .where('config_product_spec_others.status', 1)
  //     .select(
  //       'config_product_spec_others.product_spec_other_id AS key',
  //       'config_product_spec_others.product_spec_other_id',
  //       'config_product_spec_others.spec_ref',
  //       'config_product_spec_others.spec_ref_id',
  //       'config_product_spec_others.spec_name',
  //       'config_product_spec_others.spec_value',
  //       'config_product_spec_others.editable',
  //     )
  //     .catch((error) => this.knexErrorService.errorMessage(error.message));

  //   // product Data manipulations
  //   productTableData.map((product: any, index: number) => {
  //     product.uoms_measurement = product.uoms_measurement
  //       ? JSON.parse(product.uoms_measurement)
  //       : [];
  //     productTableData[index].specifications =
  //       productSpecificationTableData.filter(
  //         (filter) => product.product_id === filter.spec_ref_id,
  //       );
  //     productTableData[index].specificationsOthers =
  //       productSpecificationOtherTableData.filter(
  //         (filter) => product.product_id === filter.spec_ref_id,
  //       );
  //   });
  //   if (productTableData.length > 0) {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'common',
  //       'table_data_found',
  //       'Product',
  //       productTableData,
  //     );
  //   } else {
  //     return await this.supplyChainService.returnMessageWithData(
  //       'common',
  //       'table_data_not_found',
  //       'Product',
  //       [],
  //     );
  //   }
  // }

  async getProductWithActualStock(id: number) {
    const payload = [];
    const data = await this.knex
      .select('*')
      .from('sc_product_in_stocks')
      .leftJoin(
        'config_products',
        'config_products.product_id',
        'sc_product_in_stocks.product_id',
      )
      .where('sc_product_in_stocks.warehouse_id', id)
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    data.map((item) => {
      const obj = {
        product_id: item.product_id,
        product_name: item.product_name,
        product_code: item.product_code,
        product_category: item.product_category,
        product_types: item.product_types,
        uoms_measurement: item.uoms_measurement,
        actual_qty:
          item.stockin_qty -
          (item.transfer_qty +
            item.sold_qty +
            item.used_qty +
            item.damaged_qty),
      };
      payload.push(obj);
    });
    return payload;
  }
}
