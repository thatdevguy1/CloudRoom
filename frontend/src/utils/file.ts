import { JsonFile, UrlResponse } from "../types";
import { getSessionInfo } from "./auth";

export const convertFilesToBase64String = async (
  files: FileList
): Promise<JsonFile[]> => {
  const strigifiedFiles: Promise<JsonFile>[] = [];
  for (let i = 0; i < files.length; i++) {
    let promise: Promise<JsonFile> = new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Handle successful read
      reader.onload = () =>
        resolve({
          fileName: files[i].name,
          content: reader.result,
          size: files[i].size,
        });

      // Handle errors
      reader.onerror = (error) => reject(error);

      // Read the file content as a Base64 string
      reader.readAsDataURL(files[i]);
    });
    // Add the promise to the array
    strigifiedFiles.push(promise);
  }

  return Promise.all(strigifiedFiles);
};

interface FileInfo {
  FileName: string;
  size: number;
}

export const uploadFiles = async (files: JsonFile[]): Promise<Response[]> => {
  const sessionInfo = getSessionInfo();
  if (sessionInfo === null) throw new Error("Session info not found");
  const sessionInfoObj = JSON.parse(sessionInfo);
  const fileInfo: FileInfo[] = [];

  const cleanedFiles: JsonFile[] = files.map((file) => {
    let cleanContent;
    const sanatisedFileName = file.fileName.replace(/_/g, "-");
    if (typeof file.content === "string")
      cleanContent = file.content?.split(",")[1];

    // Backend lambda function expects pascal case property names
    fileInfo.push({ FileName: sanatisedFileName, size: file.size });
    return {
      fileName: sanatisedFileName,
      content: cleanContent || file.content,
      size: file.size,
    };
  });

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": sessionInfoObj.id_token,
    },
    body: JSON.stringify(fileInfo),
  });

  const urls = await response.json();
  if (urls.error) throw new Error(urls.error);
  console.log("urls::: ", urls);
  const uploadPromises = cleanedFiles.map((file: JsonFile) => {
    const { url } = urls.find(
      (url: UrlResponse) => url.fileName === file.fileName
    );
    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(file),
    });
  });

  const res = await Promise.all(uploadPromises);

  return res;
};

export const getFilesMetaData = async () => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);

    if (!sessionInfoObj) throw new Error("Session info not found");
    const userId = sessionInfoObj.profile?.sub;

    console.log(userId);

    if (!userId) throw new Error("User id not found");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/get-files`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionInfoObj.id_token,
      },
    });

    const data = await response.json();

    console.log("file meta data body data: ", data);

    if (data.error) throw new Error(data.error);

    return data;
  } catch (error) {
    console.log("Error getting files metadata", error);
  }
};

export const downloadFile = async (fileId: string) => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);

    if (!sessionInfoObj) throw new Error("Session info not found");
    const userId = sessionInfoObj.profile?.sub;

    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/download?fileId=${fileId}&userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": sessionInfoObj.id_token,
        },
      }
    );

    const data = await response.json();
    console.log("Download data: ", data);
    if (data.error) throw new Error(data.error);
    const url = data.url;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${userId}/${fileId}`;
    link.click();
    return data;
  } catch (error) {
    console.log("Error downloading file", error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);

    if (!sessionInfoObj) throw new Error("Session info not found");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/delete-file?fileId=${fileId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": sessionInfoObj.id_token,
        },
      }
    );

    const data = await response.json();
    console.log("Delete data: ", data);
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.log("Error deleting file", error);
  }
};

export const calculateFileSizeDisplay = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
