import styled from 'styled-components';

const RepairMaintenance = styled.div``;

const DropdownButton = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border: 1px solid #dfdfdf;
	border-radius: 4px;
	label {
		position: relative;
		display: inline-flex;
		align-items: center;
		height: 32px;
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
		margin-right: 10px;
		padding: 4px 10px 4px;
	}
	button {
		width: 60px;
	}
`;

const TableData = styled.div`
	.ant-table.ant-table-bordered .ant-table-container {
		padding: 0px;
		border: 0;
	}
	.ant-table-content {
		padding: 0px !important;
	}
	.ant-table-summary {
		border: 1px solid rgba(0, 0, 0, 0.05);
		background: #fafafa;
		td {
			padding: 4px !important;
			border: 1px solid #59597759;
			border-right: 1px solid #aaaaaa !important;
		}
	}
`;

const ViewData = styled.div`
	h5 {
		color: #535353;
		font-weight: 600;
	}
	h6 {
		color: #535353;
		font-weight: bold;
	}
	p {
		color: #707070;
		font-weight: semi-bold;
	}
`;

export default RepairMaintenance;
export { DropdownButton, TableData, ViewData };
