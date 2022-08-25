import styled from 'styled-components';

const Accounts = styled.div``;

const AccountsHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 10px;
	border-bottom: 1px solid #dfdfdf;
	margin-bottom: 10px;
	.account-setting__header {
		margin: 0;
		padding: 0;
	}
	.account-setting__actions {
		button {
			i {
				margin-right: 4px;
			}
			&:not(:nth-child(1)) {
				margin-left: 6px;
			}
		}
	}
`;

const AccountSwitch = styled.span`
	display: flex;
	align-items: center;
	justify-content: space-between;
	.switch-label {
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
	}
	button {
		margin-left: 10px;
		height: 30px;
		min-width: 60px;
		border-radius: 4px;
		.ant-switch-handle {
			height: 26px;
			width: 8px;
			::before {
				border-radius: 4px;
			}
		}
	}
	.ant-switch {
		background-color: red;
	}
	.ant-switch-checked {
		background-color: #1a7bb9;
	}
	.ant-switch-checked .ant-switch-handle {
		left: calc(100% - 8px - 2px);
	}
`;

const TreeMenuDesign = styled.div`
	.site-tree-search-value {
		color: #fff;
		background-color: #535353;
		border-radius: 2px;
	}
	.search-tree-menu {
		.ant-input-search {
			margin-bottom: 10px;
		}
	}
	.ant-tree-title {
		color: black;
		font-weight: 500;
	}
	.ant-tree {
		padding: 10px;
		background: #d5ffd8;
	}
	.ant-tree-show-line .ant-tree-switcher {
		background: #ffffff00;
	}
	.anticon {
		vertical-align: middle;
	}
	.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
		background-color: #535353;
		.ant-tree-title {
			color: #ffffff;
		}
	}
	.treeLoading {
		padding: 30px;
		color: black;
		font-weight: 500;
		background: #d5ffd8;
		text-align: center;
	}
`;

const AccountTags = styled.div`
	h5 {
		border-bottom: 1px solid #dfdfdf;
		padding-bottom: 8px;
		margin-bottom: 20px;
	}
	.acc-tags {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		.switch-label {
			color: rgba(0, 0, 0, 0.85);
			font-size: 14px;
		}
		button {
			margin-left: 10px;
			height: 30px;
			min-width: 60px;
			border-radius: 4px;
			.ant-switch-handle {
				height: 26px;
				width: 8px;
				::before {
					border-radius: 4px;
				}
			}
		}
		.ant-switch {
			background-color: red;
		}
		.ant-switch-checked {
			background-color: #1a7bb9;
		}
		.ant-switch-checked .ant-switch-handle {
			left: calc(100% - 8px - 2px);
		}
	}
`;

const StatementHeader = styled.div`
	/* padding-bottom: 10px; */
	border-bottom: 1px solid #dfdfdf;
	margin-bottom: 10px;
`;

const StatementForm = styled.div`
	.ant-picker-range,
	.ant-space-vertical {
		width: 100% !important;
	}
`;

const ReportsButton = styled.div`
	margin: 10px 0;
	margin-bottom: 26px;
	button {
		color: #ffffff;
		padding-left: 10px;
		padding-right: 10px;
		&:not(:last-child) {
			margin-right: 6px;
		}
		i {
			margin-right: 4px;
		}
		:hover,
		:active,
		:focus {
			color: #ffffff;
		}
	}
`;

const ReportsData = styled.div`
	padding-top: 14px;
	border-top: 1px solid #dfdfdf;
`;

const ReportFilterBy = styled.div`
	margin-bottom: 12px;
	border-bottom: 1px solid #dfdfdf;
	position: relative;
	.filter-by {
		position: relative;
		right: auto;
		left: 0;
		display: block;
		align-items: center;
		width: 100%;
		.multi-select {
			.dropdown-container {
				border: none;
				:focus-within {
					border: none !important;
					box-shadow: none !important;
				}
			}
			.dropdown-heading {
				padding-left: 120px;
				width: 100%;
				height: 30px;
			}
		}
		.filter-label {
			position: absolute;
			top: 50%;
			left: 0;
			z-index: 1;
			transform: translate(10px, -50%);
			pointer-events: none;
		}
	}
`;

const SpanLabel = styled.label`
	position: relative;
    display: inline-flex;
    align-items: center;
    height: 32px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
`;

export default Accounts;
export {
	AccountsHeader,
	TreeMenuDesign,
	AccountSwitch,
	AccountTags,
	StatementHeader,
	StatementForm,
	ReportsButton,
	ReportsData,
	ReportFilterBy,
	SpanLabel,
};
