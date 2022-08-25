import styled from 'styled-components';

const FixedAsset = styled.div``;

const ShowInfo = styled.div`
	h6 {
		color: #535353;
		font-weight: bold;
	}
	p {
		color: #707070;
		font-weight: semi-bold;
	}
`;

const AssetImage = styled.div`
	img {
		max-width: 200px;
		max-height: 300px;
		width: 100%;
	}
	p {
		margin-top: 4px;
		font-weight: 600;
		font-size: 14px;
		color: black;
	}
`;

const BreakLine = styled.div`
	border: 1px dashed #dfdfdf;
	margin-top: 10px;
	margin-bottom: 20px;
`;

const ActionButton = styled.div`
	position: absolute;
	z-index: 1;
	top: 8px;
	right: 10px;
`;

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

const AssignButtons = styled.div`
	position: relative;
	button {
		position: absolute;
		bottom: -48px;
		right: 10px;
		z-index: 1;
	}
`;

export default FixedAsset;
export { ShowInfo, AssetImage, BreakLine, ActionButton, ShowData, AssignButtons };
