import { mkdir, unlink, writeFile } from 'fs/promises';
import * as mime from 'mime-types';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const baseUploadDir = join(__dirname, '..', '..', 'static', 'images');

const uploadBase64File = async (
  base64String: string,
  category: string = '',
  file_name: string = '',
): Promise<string> => {
  const categoryDir = join(baseUploadDir, category);
  await mkdir(categoryDir, { recursive: true });

  const matches = base64String.match(/^data:(.+);base64,(.+)$/);

  const mimeType = matches[1];
  const extension = mime.extension(mimeType) || 'png';
  const fileData = matches[2];

  const fileName = `${file_name !== '' ? file_name : uuidv4()}.${extension}`;
  const filePath = join(categoryDir, fileName);

  await writeFile(filePath, fileData, 'base64');

  return fileName;
};

const deleteFile = async (fileName: string, category: string = '') => {
  const categoryDir = join(baseUploadDir, category);
  const filePath = join(categoryDir, fileName);

  try {
    await unlink(filePath);
  } catch (error) {
    throw new Error(`Error deleting file: ${error.message}`);
  }
};

export const FileUitils = {
  upload: uploadBase64File,
  delete: deleteFile,
};
