import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

export class FileUploadingUtils {
  static singleImageUploader(name: string, entityType: string = '', dest: string= './uploads/images') {
    return FileInterceptor(name, {
      storage: diskStorage({
        destination: entityType ? `${dest}/${entityType}` : dest,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    });
  }

  static multipleImageUploader(name: string, entityType: string = '', dest: string= './uploads/images', maxFileNumber: number = 20) {
    return FilesInterceptor(name, maxFileNumber, {
      storage: diskStorage({
        destination: entityType ? `${dest}/${entityType}` : dest,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    });
  }
}
