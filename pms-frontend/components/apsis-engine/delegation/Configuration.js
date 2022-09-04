import { Component, Link } from "react";
import React from "react";
import MasterGrid from "@/apsisEngine/common/mastergrid";
import router from "next/router";

class DelegationConf extends Component {
  handleClick = (e, ids) => {
    console.log(e.target.name);
    console.log(e.target.value);
    console.log(ids);
    if (e.target.name == "adddlConf" && ids.length == 1) {
      router.push(`/apsis-engine/delegation/${ids[0]}/approval`);
    } else if (e.target.name == "viewdlConf" && ids.length == 1) {
      router.push(`/apsis-engine/delegation/${ids[0]}/view`);
    } else if (e.target.name == "editdlConf" && ids.length == 1) {
      router.push(`/apsis-engine/delegation/${ids[0]}/edit`);
    }
  };
  render() {
    return (
      <MasterGrid
        handleClick={this.handleClick}
        title="Delegation Configuration"
        slug="delegation_conf"
      />
    );
  }
}

export default DelegationConf;
