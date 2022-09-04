import React, { useEffect, useState, useRef } from "react";
import MasterGrid from "apsisEngine/common/mastergrid";
import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { Table, Card, Form, Modal, Row, Button, Col } from "antd";
import {
  FormItem,
  swalError,
  swalSuccess,
} from "apsisEngine/common/formValidations";
import { useRouter } from "next/router";
import { apsisEncrypt, apsisDecrypt } from "apsisEngine/helpers/apsisEncryption";

const Users =()=> {
  const userRef = useRef();
  const router = useRouter();
  
  const handleClick = (e,ids,rows)=>{
    if (e.target.name == "createUser") {
      router.push({
				pathname: `/system-admin/users/create`,
			});
    } 
    else if (e.target.name == "editUser"){
      let id = ids[0];
      let editMode = true;
      router.push({
				pathname: `/system-admin/users/create`,
        query : {editMode:true, id:apsisEncrypt(id)}
			});
    }
  }


  return(
    <>

    <div>
      <MasterGrid 
      ref={userRef} 
      handleClick={handleClick} 
      title="User List" 
      slug="user_lists"
      primaryKey="hidden_user_id"
       />
    </div>

    </>


    
  ); 
}


export default Users;