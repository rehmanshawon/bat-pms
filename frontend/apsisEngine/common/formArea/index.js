const FormArea = ({ children, mainTitle, codeTitle, code }) => {
	return (
		<div className="main-wrap">
			<div className="card card-xl-stretch" style={{ border: 0 }}>
				<div
					className="master_grid"
					style={{ border: '2px solid #e0dee0', borderRadius: '2px' }}
				>
					<div className="title_area">
						<div className="gridTitle">
							<h6>
								<span className="fa fa-file-text mr-2"></span> {mainTitle}
							</h6>
						</div>
						{codeTitle && code && (
							<div className="gridTitle">
								<h6>
									{codeTitle} : {code}
								</h6>
							</div>
						)}
					</div>
					{children}
				</div>
			</div>
		</div>
	);
};

export default FormArea;
