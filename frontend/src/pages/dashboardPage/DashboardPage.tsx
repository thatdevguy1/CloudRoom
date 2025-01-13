import { SidebarProvider } from "@/components/ui/sidebar";
// import AppSideBar from "@/components/app-sidebar/AppSideBar";
import { DataTable } from "@/components/data-table/DataTable";
import { buildColumns } from "@/components/data-table/columns";
import UploadFile from "@/components/file-upload/FileUpload";
import { useState, useEffect } from "react";
import { JsonFile, FileMetaData } from "@/types";
import {
  calculateFileSizeDisplay,
  convertFilesToBase64String,
  deleteFile,
  getFilesMetaData,
  uploadFiles,
} from "@/utils/file";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [jsonFiles, setJsonFiles] = useState<JsonFile[] | null>(null);
  const [fileData, setFileData] = useState<FileMetaData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (files) {
      console.log("original files from dashboard", files);
      (async () => {
        const jsonFiles = await convertFilesToBase64String(files);
        setJsonFiles(jsonFiles);
      })();
    }
  }, [files]);

  useEffect(() => {
    if (!auth.user) navigate("/");
    (async () => {
      setFileLoading(true);
      const files: FileMetaData[] = await getFilesMetaData();
      if (files) {
        const processedFileData = processFileData(files);
        setFileData(processedFileData);
      }
      setFileLoading(false);
      console.log("jsonFiles", files);
    })();
  }, []);

  const handleFileSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      const response: Response[] = await uploadFiles(files!);
      setLoading(false);
      if (response) {
        setFileLoading(true);
        //- Added a timeout to simulate the delay in the server response
        // Websockets would be a better solution to this
        setTimeout(async () => {
          const fileMetaData: FileMetaData[] = await getFilesMetaData();
          if (fileMetaData) {
            const processedFileData = processFileData(fileMetaData);
            setFileData(processedFileData);
          }
          setFileLoading(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      const message =
        //@ts-ignore
        error!.message ||
        "Looks like we have an issue with the server. Please try again later";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
        duration: 5000,
      });
    }
  };

  const processFileData = (files: FileMetaData[]): FileMetaData[] => {
    return files.map((file) => {
      return {
        ...file,
        UploadDate: new Date(file.UploadDate).toLocaleString(),
        FileSize: calculateFileSizeDisplay(Number(file.FileSize)),
      };
    });
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
      {/* <AppSideBar /> */}
      <main className="w-[100%]">
        {/* <SidebarTrigger /> */}
        <UploadFile
          setFiles={setFiles}
          handleFileSubmit={handleFileSubmit}
          loading={loading}
        />
        <div className="p-6">
          <DataTable
            columns={buildColumns(handleDeleteFile)}
            data={fileData}
            fileLoading={fileLoading}
          />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
