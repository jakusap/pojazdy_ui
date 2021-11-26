import { saveAs } from 'file-saver';

export const saveFile = (blob, fileName) => {
  saveAs(blob, fileName);
};
