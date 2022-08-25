import styled from 'styled-components';

const Untracked = styled.div``;

const UntrackedButtons = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-bottom: 10px;
	button {
		margin-left: 6px;
	}
`;

const AllUntrackedBox = styled.div`
	h6 {
		border-bottom: 1px solid black;
		margin-bottom: 16px;
        width:max-content;
        font-weight:bold;
	}
`;

export default Untracked;
export { UntrackedButtons, AllUntrackedBox };
