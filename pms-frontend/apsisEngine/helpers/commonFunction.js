import fetchWrapper from '@/apsisEngine/helpers/fetchWrapper';
import { swalConfirm, swalError, swalSuccess } from './helperService';

//Handle SendFor Approval
export const sendForApproval = (slug, codes, delegationVersion = null, noWarning = false) => {
	const sendForApprovalAPI = async () => {
		let approvalData = {};

		if (delegationVersion) {
			approvalData = {
				slug: slug,
				code: codes,
				delegation_type: 'send_for_approval',
				delegation_version: delegationVersion,
				additional_data: '',
				comments: '',
			};
		} else {
			approvalData = {
				slug: slug,
				code: codes,
				delegation_type: 'send_for_approval',
				additional_data: '',
				comments: '',
			};
		}

		return fetchWrapper
			.post('/delegation/delegation-process', approvalData)
			.then((response) => {
				if (!response.error) {
					swalSuccess('', '', response.data);
				} else {
					swalError(response.data);
				}
			})
			.catch((error) => console.log(error));
	};

	if (noWarning) {
		return sendForApprovalAPI();
	} else {
		return swalConfirm('Do You Want to Send For Approval?', 'Are You Sure?', 'Yes, Send it!')
			.then((result) => {
				if (result.isConfirmed) {
					sendForApprovalAPI();
					return true;
				} else {
					return false;
				}
			})
			.catch((error) => console.log(error));
	}
};

//Handle Approve or Decline
export const approveOrDecline = async (
	slug,
	codes,
	mode,
	comment = '',
	delegationVersion = null
) => {
	const text = mode == 'decline' ? 'Decline' : 'Approve';
	return swalConfirm(`You Want to ${text}`, 'Are you sure  ?', `Yes, ${text}`).then((result) => {
		if (result.isConfirmed) {
			let data = {};
			let checkResult = checkDelegationVersion(delegationVersion);
			if (delegationVersion && checkResult) {
				data = {
					slug: slug,
					code: codes,
					delegation_type: mode,
					delegation_version: delegationVersion,
					comments: comment,
					additional_data: '',
				};
			} else {
				data = {
					slug: slug,
					code: codes,
					delegation_type: mode,
					comments: comment,
					additional_data: '',
				};
			}

			fetchWrapper
				.post('delegation/delegation-process', data)
				.then((response) => {
					if (!response.error) {
						swalSuccess('', '', response.data);
					} else {
						swalError(response.data);
					}
				})
				.catch((error) => swalError(error));
			return true;
		} else {
			return false;
		}
	});
};

export const checkDelegationVersion = (version) =>{
	if(version == null){
		return false;
	}
	else{
		return !version.includes(undefined)
	}
	
};

//Return true if can be edited or send to approval, false otherwise
export const checkApprovalStatus = async (code, slug) => {
	return fetchWrapper
		.post('common-api/approved-check', {
			code: code,
			slug: slug,
		})
		.then((response) => response.data)
		.catch((error) => false);
};

export const apsisUpload = async (files, slug, reference_id) => {
	const params = new FormData();
	params.append('attach_config_slug', slug);
	params.append('reference_id', reference_id);

	if (files.length > 0) {
		files.map((file, index) => {
			params.append('file', file);
		});
	}

	return await fetchWrapper
		.post('attachment/upload', params, {
			'Content-Type': 'multipart/form-data',
		})
		.then(function (response) {
			return response;
		})
		.catch(function (error) {
			return error;
		});
};

export const getI18Labels = async (module_name, message_code) => {
	try {
		const postObject = {
			module_name: module_name,
			message_code: message_code,
		};
		const response = await fetchWrapper.post('alertmessage', postObject);
		if (response.data) {
			return response.data;
		} else {
			return null;
		}
	} catch {
		return null;
	}
};
