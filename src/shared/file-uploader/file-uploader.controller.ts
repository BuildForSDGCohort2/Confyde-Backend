import { Controller, Req, Body, UploadedFile, UseInterceptors, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/fileupload.dto';
// import { ApiImplicitFormData } from '../helpers';
import { FileUploadingUtils } from '../file_utils';
import moveFile from 'move-file';

const uploadPath = './uploads/media';

@ApiTags('Media Uploads')
@Controller()
export class FileUploaderController {

  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(FileUploadingUtils.singleImageUploader('file', null, './uploads/tmp'))
  @ApiConsumes('multipart/form-data')
  @Post('system/media-upload')
  createOne(
    @Body() dto: FileUploadDto,
    @UploadedFile() file: any,
  ) {
    const newPath = `${uploadPath}/${dto.entityType.toLowerCase()}/${dto.fileType.toLowerCase()}/${file.filename}`;

    // tslint:disable-next-line: no-console
    // console.log(dto, file);

    if (file.path) {
      moveFile(file.path, newPath);
    }

    return {
      message: 'File Uploaded Successfully',
      path: newPath.replace('./', ''),
    };
  }
}
