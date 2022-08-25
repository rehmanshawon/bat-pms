import { Col, Row } from "react-bootstrap";
import styled from "styled-components";
import ChangePassword from "./ChangePassword";

export const UserProfileUnit = ({data ,passLogicData}) => {
  return (
    <Row>
      <Col md={8}>
        <ProfileCard
          style={{ width: "100%" }}
        >
          <Row>
          <h6 className="mb-4">Personal Information</h6>
            <Col md={6}>
              <p>
                <span>
                  <Label>Full Name: </Label>
                </span>
                <Value className="value">{data?.full_name}</Value>
              </p>
              <p>
                <span>
                  <Label>Email: </Label>
                </span>
                <Value className="value">{data?.email}</Value>
              </p>
              <p>
                <span>
                  <Label>Mobile: </Label>
                </span>
                <Value className="value">{data?.mobile}</Value>
              </p>
              
            </Col>
            <Col md={6}>
              <p>
                <span>
                  <Label>Birthday: </Label>
                </span>
                <Value className="value">{data?.date_of_birth}</Value>
              </p>
              <p>
                <span>
                  <Label>Gender: </Label>
                </span>
                <Value className="value">{data?.gender}</Value>
              </p>
              <p>
                <span>
                  <Label>User Code: </Label>
                </span>
                <Value className="value">{data?.user_code}</Value>
              </p>
            </Col>
          </Row>

          <Row>
          <h6 className="my-4">Company Information</h6>
            <Col md={6}>
            <p>
                <span>
                  <Label>Company Name: </Label>
                </span>
                <Value className="value">{data?.company_name } ({data?.company_short_code}-{data?.company_code})</Value>
              </p>
              <p>
                <span>
                  <Label>Department Code: </Label>
                </span>
                <Value className="value">{data?.department_code}</Value>
              </p>
              <p>
                <span>
                  <Label>Company Code: </Label>
                </span>
                <Value className="value">{data?.user_code}</Value>
              </p>
            </Col>
          </Row>
        </ProfileCard>
      </Col>
      <Col md={4}>
        <ChangePassword data={data} passLogicData={passLogicData} />
      </Col>
    </Row>
  );
};
const ProfileCard = styled.div`
    background-color: #ffffff;
    padding: 1.5rem;
`;


const Label = styled.label`
  font-weight: 400;
`;

const Value = styled.span`
  font-size: 0.725rem;
  margin-left: 12px;
`;


