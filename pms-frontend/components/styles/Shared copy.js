import styled from 'styled-components';

const LinkButton = styled.div`
	color: blue;
	border-bottom: 1px solid blue;
	width: max-content;
	cursor: pointer;
`;

const Center = styled.div`
	display: grid;
	place-items: center;
	height: 100%;
`;
const AgreementButton = styled.div`
	padding: 10px;
	background-color: #f7f7f7;
	border: 1px solid #dfdfdf;
	border-top: none;
	text-align: right;
	button {
		margin-left: 10px;
	}
`;

const PaymentHeader = styled.h6`
	font-weight: bold;
	width: 100%;
	border-bottom: 1px solid;
	margin-bottom: 20px;
`;

const NestedTableData = styled.div`
	.ant-table.ant-table-bordered .ant-table-container {
		padding: 0px;
		border: 0;
	}
	.ant-table-content {
		padding: 0px !important;
	}
	.ant-table-thead {
		th {
			border-color: white !important;
			padding: 8px !important;
			&:last-child {
				border-right: none !important;
			}
		}
	}
	.ant-table-row {
		td {
			padding: 8px !important;
		}
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

const SharedViewData = styled.div`
	color: black;
	h5 {
		font-weight: 600;
	}
	h6 {
		font-weight: bold;
	}
	p {
		font-weight: semi-bold;
		span {
			font-weight: 500;
		}
		margin: 0;
		margin-bottom: 8px;
	}
	.special-view {
		background-color: #f7f7f7;
		border: 1px solid #dfdfdf;
		border-radius: 4px;
		h5 {
			margin: 0;
			padding: 8px 10px;
			border-bottom: 1px solid #dfdfdf;
			background-color: #eeeeee;
			font-weight: bold;
			color: #535353;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.special-edit {
				height: 24px;
			}
		}
		.special-area {
			padding: 10px;
		}
	}
`;

const InputSpan = styled.span`
	input[type='number'],
	.ant-input-number-input {
		border-radius: 4px !important;
		padding-right: 0px !important;
	}
`;

const FlexAccHeader = styled.div`
	display: flex;
	/* align-items: center; */
	justify-content: space-between;
	.site_info {
		margin: 0;
		span {
			margin: 0 10px;
			&:first-child {
				margin-left: 0;
			}
			&:last-child {
				margin-right: 0px;
			}
		}
	}
	.ant-btn-sm {
		height: auto;
	}
	.ant-checkbox {
		border: 2px solid rgba(0, 0, 0, 0.85);
		border-radius: 6px;
	}
`;

const SingleSiteDiv = styled.div`
	box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	p {
		margin: 0;
		margin-bottom: 6px;
		span {
			font-weight: bold;
		}
	}
	overflow: hidden;
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #dfdfdf;
		padding: 10px 20px;
		h5 {
			margin: 0;
			font-size: 16px;
			font-weight: bold;
		}
	}

	.site-area {
		padding: 10px 20px;
	}
	.site-button {
		button {
			padding: 0;
			height: 24px;
			width: 24px;
		}
	}
	.ant-radio {
		position: absolute;
		top: 13px;
		left: 10px;
	}
	span.ant-radio + * {
		padding: 0;
	}
	.site-radio-hide {
		.ant-radio {
			display: none;
		}
	}
	.site-radio-show {
		.site-approved {
			h5 {
				margin-left: 10px;
			}
		}
	}
`;

const MasterGridApi = styled.div`
	.master_grid {
		border: none;
	}
	.title_area {
		display: none;
	}
	.search-filter {
		display: none;
	}
	.field-handler {
		display: none !important;
	}
	.ant-table-filter-trigger {
		display: none !important;
	}
	.ant-table-column-sorter-full {
		display: none !important;
	}
	th .ant-table-selection {
		visibility: hidden !important;
	}
	.grid-table .ant-table .ant-table-container {
		padding: 0 !important;
	}
	.action-wraps {
		padding: 10px 0 !important;
	}
`;

const SoftCopy = styled.div`
	width: max-content;
	background: black;
	border: 1px solid green;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	cursor: pointer;
	user-select: none;
	transition: all 0.2s;
	padding: 10px;
	font-weight: bold;
	width: 85px;
	height: 85px;
	font-size: 10px;
	color: white;
	span {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	i {
		margin-right: 6px;
	}
	strong {
		width: max-content;
		padding: 0 5px;
		background: #ffffff;
		border-radius: 50%;
		font-size: 12px;
		margin-bottom: 2px;
		color: #000000;
	}
	:hover {
		background: green;
	}
	:active {
		transform: scale(0.95);
	}
`;

const DangerousHtml = styled.div`
	table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		border: 1px solid;
		td {
			border: 1px solid;
			padding: 5px;
		}
	}
`;

const ManualGrid = styled.div`
	.ant-table-tbody > tr.ant-table-row:hover > .ant-table-cell-fix-left {
		background: #ffffff !important;
	}
`;

const TabScroll = styled.div`
	white-space: nowrap;
	overflow-x: auto;
	::-webkit-scrollbar {
		height: 2px;
	}
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}
	::-webkit-scrollbar-thumb {
		background: #888;
	}
	::-webkit-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
`;

const SharedTab = styled.div`
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

const SharedManualTable = styled.table`
	width: 100%;
	color: #000 !important;
	thead {
		background-color: #1e1e2d;
		border: 1px solid #1e1e2d;
		color: #fff;
	}
	tr:nth-child(odd) {
		background: #fff;
	}
	tr:nth-child(even) {
		background: #e7e7e7;
	}
	th {
		background-color: #1e1e2d;
		border-right: 1px solid #595977;
		color: #fff;
		border-radius: 0;
		padding: 5px;
		font-weight: 500;
		text-align: left;
		font-size: 13px !important;
	}
	td {
		border: 1px solid rgba(89, 89, 119, 0.34901960784313724);
		padding: 2px 5px;
		font-size: 12px !important;
	}
	.ant-form-item {
		margin: 0;
	}
`;

const SmallerTab = styled.div`
	.react-tabs__tab-list {
		margin-bottom: 10px;
	}
	.react-tabs__tab {
		padding: 4px 8px;
		font-size: 12px;
	}
	.react-tabs__tab--selected:before {
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 8px solid #007e3a;
	}
`;

const SharedTable = styled.div`
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

const SharedFileLink = styled.a`
	color: blue;
	border-bottom: 1px solid blue;
`;

export {
	SharedFileLink,
	DangerousHtml,
	LinkButton,
	Center,
	AgreementButton,
	PaymentHeader,
	NestedTableData,
	SharedViewData,
	InputSpan,
	FlexAccHeader,
	SingleSiteDiv,
	MasterGridApi,
	SoftCopy,
	ManualGrid,
	TabScroll,
	SharedTab,
	SharedManualTable,
	SmallerTab,
	SharedTable,
};
