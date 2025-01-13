interface JsonFile {
  fileName: string;
  content: string | ArrayBuffer | null;
  size: number;
  contentType?: string;
}

export default JsonFile;
