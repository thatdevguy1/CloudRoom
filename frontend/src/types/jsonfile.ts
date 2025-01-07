interface JsonFile {
  fileName: string;
  content: string | ArrayBuffer | null;
  size: number;
}

export default JsonFile;
