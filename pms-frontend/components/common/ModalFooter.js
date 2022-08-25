import { Button, Form } from 'antd';

export function ModalFooter({
	handleSubmit,
	submitText,
	handleCancel,
	handleSendForApproval,
	printHandler,
	submitButton,
}) {
	return (
		<div className="modalFooter">
			<Button
				style={{ backgroundColor: '#cf1322', color: '#fff', border: '1px solid #cf1322' }}
				onClick={handleCancel}
			>
				Close
			</Button>
			<Form.Item className="mb-0">
				{handleSendForApproval && (
					<Button
						style={{
							backgroundColor: '#157347',
							color: '#fff',
							border: '1px solid #157347',
						}}
						className="ml-2"
						onClick={handleSendForApproval}
					>
						Send For Approval
					</Button>
				)}
				{submitButton != false && !handleSubmit && (
					<Button type="primary" htmlType="submit" className="ml-2">
						{submitText ?? 'Submit'}
					</Button>
				)}

				{submitButton != false && handleSubmit && (
					<Button type="primary" onClick={handleSubmit} className="ml-2">
						{submitText ?? 'Submit'}
					</Button>
				)}

				{printHandler && (
					<Button onClick={printHandler} type="primary" className="ml-2">
						Print
					</Button>
				)}
			</Form.Item>
		</div>
	);
}

export default ModalFooter;
