import UserEntryForm from "components/apsis-engine/users/UserEntryForm";
import React, { useEffect, useState } from "react";
import { apsisEncrypt, apsisDecrypt } from "apsisEngine/helpers/apsisEncryption";

const CreateUser = (props) => {
    const id = props.query.id?apsisDecrypt(props.query.id):'';
    const editMode = props.query.editMode?true:false;

  return (
    <>
      <UserEntryForm editMode={editMode} id={id} />
    </>
  );
};

export default CreateUser;
