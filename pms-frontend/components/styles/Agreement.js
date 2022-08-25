import styled from 'styled-components';

const Agreement = styled.div``;

const AgreementHeader = styled.div`
	border: 2px solid #dfdfdf;
	background-color: #eeeeee;
	border-radius: 4px;
	padding: 10px;
	h5 {
		color: #333333;
		font-weight: 600;
		font-size: 20px;
		margin-bottom: 16px;
	}
	h6 {
		color: #333333;
		font-weight: bold;
	}
	p {
		color: #333333;
		font-weight: semi-bold;
		margin-bottom: 4px;
		span {
			font-weight: 600;
		}
	}
`;

const AgTab = styled.div`
	border: 1px solid #dfdfdf;
	border-radius: 4px;
	.agreement-title {
		margin: 0;
		padding: 8px 10px;
		border-bottom: 1px solid #dfdfdf;
		background-color: #eeeeee;
		font-weight: bold;
		color: #535353;
		font-size: 16px;
	}
`;

const AgreementTabInfo = styled.div`
	span {
		display: inline-block;
		margin-bottom: 10px;
		font-size: 15px;
	}
`;

const MasterGridList = styled.div`
	.ant-table-pagination.ant-pagination {
		padding: 10px;
	}
	.title_area {
		display: none;
	}
`;

const AgreementInfo = styled.div`
	margin-bottom: 10px;
	font-size: 14px;
	span {
		margin-right: 16px;
		&:last-child {
			margin-right: 0;
		}
	}
`;

export default Agreement;
export { AgreementHeader, AgTab, AgreementTabInfo, MasterGridList, AgreementInfo };
