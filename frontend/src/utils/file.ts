import { JsonFile } from "../types";

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

export const uploadFiles = async (files: JsonFile[]): Promise<void> => {
  try {
    const sessionInfo = sessionStorage.getItem(
      "oidc.user:https://cognito-idp.us-east-1.amazonaws.com/us-east-1_883WzBpGQ:2qc9uch823amu97rhd8r1tcvpa"
    );
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

    console.log(response);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error uploading files", error);
  }
};
