import { Component, Link } from "react";
import React from "react";
import MasterGrid from "@/apsisEngine/common/mastergrid";
import router, { useRouter } from "next/router";

class ProductVendorList extends Component {
  handleClick = (e, ids) => {
    this.props.handleClick(e, ids);
  };
  extra = {
    extra_condition: "product_id = " + this.props.productId,
  };

  render() {
    return (
      <MasterGrid
        ref={this.props.prodVendorRef}
        handleClick={this.handleClick}
        title="Product Wise Vendor Mapping"
        slug="product_vendor_mapping"
        extra={this.extra}
      />
    );
  }
}

export default ProductVendorList;
