import React from 'react';
import { Button } from 'antd';
import router from 'next/router';
//import $ from 'jquery';

export function FormFooter({
	backLink,
	submitText,
	backText,
	submitHandler,
	sendForApprovalText,
	sendForApprovalHandler,
}) {
	const handleClick = () => {
		router.push(backLink);
	};

	return (
		<div className="w-100 card-footer pull-right text-right">
			{backLink && (
				<Button onClick={handleClick} style={{ backgroundColor: '#cf1322', color: '#fff' }}>
					{backText ?? 'Back To List'}
				</Button>
			)}
			<Button type="primary" htmlType="submit" onClick={submitHandler} className="ml-2">
				{submitText ?? 'Submit'}
			</Button>
			{sendForApprovalHandler && (
				<Button
					style={{ backgroundColor: '#157347', color: '#fff' }}
					onClick={sendForApprovalHandler}
					className="ml-2"
				>
					{sendForApprovalText ?? 'Send For Approval'}
				</Button>
			)}
		</div>
	);
}

export default FormFooter;
