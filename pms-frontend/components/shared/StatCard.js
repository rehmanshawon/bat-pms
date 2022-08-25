import { Button, Card, Col, Row } from "antd";

import PropTypes from "prop-types";
import { useAppState } from "./AppProvider";

const StatCard = ({ type, title, value, icon, color, clickHandler }) => {
  const [state] = useAppState();
  let before = null,
    after = null;
    console.log('supply',icon);

  const cardIcon = (
    <Col>
      <Button
        shape="circle"
        size="large"
        type="primary"
        style={{ backgroundColor: color, borderColor: color }}
        className={
          type !== "fill"
            ? `${state.direction === "rtl" ? "ml-4" : "mr-4"}`
            : null
        }
        onClick={clickHandler}
      >
        {icon}
      </Button>
    </Col>
  );

  if (icon) {
    type === "fill" ? (after = cardIcon) : (before = cardIcon);
  }

  return (
    <Card
      className="h-100"
      style={type === "fill" ? { backgroundColor: color } : null}
    >
      <Row type="flex" align="middle" justify="start">
        {before}
        <Col>
          <h1 className={`mb-0 ${type === "fill" ? "text-white" : null}`}>
            {value}
          </h1>
          {title}
        </Col>
        <span className="mr-auto" />
        {after}
      </Row>
    </Card>
  );
};

StatCard.propTypes = {
  type: PropTypes.oneOf(["fill"]),
  title: PropTypes.element,
  value: PropTypes.string,
  icon: PropTypes.element,
  color: PropTypes.string,
};

export default StatCard;
