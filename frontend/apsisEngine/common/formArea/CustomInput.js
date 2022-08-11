import { InputSpan } from '@/components/styles/Shared';

const CustomInput = ({ children, suffix }) => {
	return (
		<InputSpan className="ant-input-group-wrapper">
			<span className="ant-input-wrapper ant-input-group">
				{children}
				{/* <span className="ant-input-group-addon">{suffix}</span> */}
			</span>
		</InputSpan>
	);
};

export default CustomInput;
