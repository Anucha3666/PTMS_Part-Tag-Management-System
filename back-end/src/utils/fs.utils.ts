import * as fs from 'fs';

export const writeFileSync = (base64_image: string, file_name: string) => {
  const dataBase64 = base64_image.replace(/^data:image\/\w+;base64,/, '');
  const filePath = `${process.env.BASE_FILE_PATH}/${file_name}.png`;
  fs.writeFileSync(filePath, Buffer.from(dataBase64, 'base64'), 'base64');
};

export const FsUtils = {
  writeFileSync,
};
