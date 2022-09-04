import { apsisDateTime } from '@/apsisEngine/helpers/helpers';
import { Timeline } from 'antd';

const ViewTimeLine = ({data}) => {
  return (
		<>
			{data?.length > 0 ? (
				<div className="p-3">
					<Timeline>
						{data.map((timeline, index) => (
							<Timeline.Item color="green" key={index}>
								{apsisDateTime(timeline.track_time)}
								{` - `}
								{timeline.current_location}
							</Timeline.Item>
						))}
					</Timeline>
				</div>
			) : (
				<div className="p-3">No Timeline Found</div>
			)}
		</>
	);
}

export default ViewTimeLine;