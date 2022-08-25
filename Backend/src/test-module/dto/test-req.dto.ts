import { IntersectionType } from '@nestjs/swagger';
import { UploadAttacmenthDto } from 'src/apsisengine/attachment/dto';
import { reqDto } from './req.dto';

export class testReqDto extends IntersectionType(reqDto, UploadAttacmenthDto) {}
