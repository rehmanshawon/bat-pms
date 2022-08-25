import styled from "styled-components";

const WorkOrder = styled.div``;

const WoButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
  button {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;

const TermsConditionLabel = styled.div`
  margin-bottom: 10px;
  label {
    font-size: 22px;
  }
`;

const TermsConditionView = styled.div`
  padding: 10px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  div {
    max-height: 160px;
    overflow-y: auto;
  }
`;

const Wh5 = styled.h5`
  font-weight: 500;
`;

const ViewData = styled.div`
  padding: 10px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  h6 {
    color: #535353;
    font-weight: bold;
  }
  p {
    color: #707070;
    font-weight: semi-bold;
  }
`;

export default WorkOrder;
export { WoButtons, TermsConditionLabel, TermsConditionView, ViewData, Wh5 };
