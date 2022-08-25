import { PartialType } from '@nestjs/swagger';
import { delegationSubmission } from './delegation_Submission.dto';

export class UpdateDelegationDto extends PartialType(delegationSubmission) {}
