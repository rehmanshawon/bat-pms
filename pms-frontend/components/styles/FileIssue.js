import styled from 'styled-components';

const FileIssue = styled.div``;

const ShowData = styled.div`
	h6 {
		color: #535353;
		font-weight: bold;
	}
	p {
		color: #707070;
		font-weight: semi-bold;
	}
`;
const ModalFileView = styled.div`
	padding: 20px;
	h4 {
		margin: 0;
		padding: 0;
		margin-left: -2px;
		margin-bottom: 10px;
		font-weight: bold;
	}
`;

const TableView = styled.table`
	width: 100%;
	overflow-x: auto;
	border-collapse: collapse;
    margin-top: 20px;
	table,
	td,
	th {
		border: 1px solid #dfdfdf;
	}
	th {
		color: black;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 6px;
		border: 2px solid #dfdfdf;
	}
	td {
		color: black;
		padding-left: 4px;
	}
	a {
		color: blue;
		border-bottom: 1px solid blue;
		margin-left: 10px;
	}
`;

export default FileIssue;
export { ShowData, ModalFileView, TableView };

