import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/app-sidebar/AppSideBar";
import { DataTable } from "@/components/data-table/DataTable";
import { buildColumns } from "@/components/data-table/columns";
import UploadFile from "@/components/file-upload/FileUpload";
import { useState, useEffect } from "react";
import { JsonFile, FileMetaData } from "@/types";
import {
  convertFilesToBase64String,
  deleteFile,
  getFilesMetaData,
  uploadFiles,
} from "@/utils/file";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [jsonFiles, setJsonFiles] = useState<JsonFile[] | null>(null);
  const [fileData, setFileData] = useState<FileMetaData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (files) {
      (async () => {
        const jsonFiles = await convertFilesToBase64String(files);
        setJsonFiles(jsonFiles);
      })();
    }
  }, [files]);

  useEffect(() => {
    if (!auth.user) navigate("/");

    (async () => {
      const files = await getFilesMetaData();
      if (files) setFileData(files);
      console.log("jsonFiles", files);
    })();
  }, []);

  const handleFileSubmit = async (): Promise<void> => {
    setLoading(true);
    const fileMetaData: FileMetaData[] = await uploadFiles(jsonFiles!);
    setLoading(false);
    if (fileMetaData)
      setFileData((prevFileData) => [...prevFileData, ...fileMetaData]);
  };

  const handleDeleteFile = async (fileId: string): Promise<void> => {
    setLoading(true);
    const response = await deleteFile(fileId);
    setLoading(false);
    if (response) {
      setFileData((prevFileData) =>
        prevFileData.filter((file) => file.FileId !== fileId)
      );
    }
  };

  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="w-[100%]">
        <SidebarTrigger />
        <UploadFile
          setFiles={setFiles}
          handleFileSubmit={handleFileSubmit}
          loading={loading}
        />
        <div className="p-6">
          <DataTable columns={buildColumns(handleDeleteFile)} data={fileData} />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
