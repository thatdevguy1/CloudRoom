import { JsonFile, FileMetaData } from "../types";

const getSessionInfo = () => {
  return sessionStorage.getItem(
    "oidc.user:https://cognito-idp.us-east-1.amazonaws.com/us-east-1_883WzBpGQ:2qc9uch823amu97rhd8r1tcvpa"
  );
};
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

export const uploadFiles = async (
  files: JsonFile[]
): Promise<FileMetaData[]> => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);

    const cleanedFiles: JsonFile[] = files.map((file) => {
      let cleanContent;
      if (typeof file.content === "string")
        cleanContent = file.content?.split(",")[1];
      return {
        fileName: file.fileName,
        content: cleanContent || file.content,
      };
    });

    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionInfoObj.id_token,
      },
      body: JSON.stringify(cleanedFiles),
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error uploading files", error);
  }
  return [];
};

export const getFilesMetaData = async () => {
  try {
    const sessionInfo = getSessionInfo();
    if (sessionInfo === null) throw new Error("Session info not found");
    const sessionInfoObj = JSON.parse(sessionInfo);

    if (!sessionInfoObj) throw new Error("Session info not found");
    const userId = sessionInfoObj.profile?.sub;

    if (!userId) throw new Error("User id not found");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/get-files?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": sessionInfoObj.id_token,
        },
      }
    );

    const data = await response.json();

    console.log("file meta data body data: ", JSON.parse(data.body));

    if (data.error) throw new Error(data.error);

    return JSON.parse(data.body);
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
