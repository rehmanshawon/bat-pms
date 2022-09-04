import FormArea from "apsisEngine/common/formArea";
import SetTeamTargetForm from "components/common-feature/masterdata/SetTeamTargetForm";
//import { VatForm } from "components/vat-tax/vat/VatForm";
import { useState } from "react";

const Create = () => {
  const [formTitle, setFormTitle] = useState("Set Team Targets");
  return (
    <FormArea mainTitle={formTitle}>
      
      <SetTeamTargetForm/>
    </FormArea>
  );
};

export default Create;
