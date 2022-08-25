import Signup from "../components/Signup";
import { Form } from "antd";
const SignupPage = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setLoading(true);
    const data = {
      user: values.email,
      password: values.password,
    };
  };
  return <Signup ref={form} onFinish={onFinish} />;
};

export default SignupPage;
