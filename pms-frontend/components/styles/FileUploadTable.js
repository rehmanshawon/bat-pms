import styled from 'styled-components';

const FileUploadTable = styled.table`
	width: 100%;
	border: 1px solid #dfdfdf;
	overflow-x: auto;
	thead {
		background: #0f1222;
	}
	tbody {
		border-top: 1px solid #dfdfdf;
	}
	tr {
		border: 1px solid #dfdfdf;
	}
	th {
		border: 1px solid #0f1222;
		background: #0f1222;
		color: white;
		padding: 4px;
		font-weight: 500;
		font-size: 12px !important;
	}
	td {
		border: 1px solid #dfdfdf;
		padding: 4px;
	}
	input {
		border: 1px solid #dfdfdf;
		padding: 2px 10px;
	}
	input[type='file'] {
		width: 200px;
		border: none;
		&:hover {
			box-shadow: none !important;
			border: none !important;
		}
	}
	a {
		color: blue;
		border-bottom: 1px solid blue;
		margin-left: 10px;
	}
`;

const FileLink = styled.a`
	color: blue;
	/* border-bottom: 1px solid blue; */
	/* margin-left: 10px; */
`;

const FUButton = styled.button`
	background-color: #0f1222;
	color: white;
	border: none;
	padding: 4px 10px;
	border-radius: 2px;
	margin-bottom: 4px;
	font-size: 12px;
`;

const NoFile = styled.div`
	background-color: #eeeeee;
	height: 100px;
	display: grid;
	place-items: center;
`;

const CardHeader = styled.div`
	background-color: #dfdfdf;
	border-radius: 4px 4px 0 0;
`;

export default FileUploadTable;
export { FUButton, NoFile, FileLink, CardHeader };
