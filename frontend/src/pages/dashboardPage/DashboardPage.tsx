import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/app-sidebar/AppSideBar";
import { DataTable } from "@/components/data-table/DataTable";
import { columns } from "@/components/table-columns/columns";
import UploadFile from "@/components/file-upload/FileUpload";
import { useState, useEffect } from "react";
import { JsonFile } from "@/types";
import { convertFilesToBase64String, uploadFiles } from "@/utils/file";

const Dashboard = () => {
  const fileData = [
    {
      id: "1",
      email: "d@d.ca",
      name: "File 1",
      size: "1 MB",
      date: "2024-01-01",
    },
    {
      id: "2",
      email: "d@d.ca",
      name: "File 2",
      size: "2 MB",
      date: "2024-01-02",
    },
    {
      id: "3",
      email: "d@d.ca",
      name: "File 3",
      size: "3 MB",
      date: "2024-01-03",
    },
    {
      id: "15",
      email: "d@d.ca",
      name: "File 12",
      size: "1 MB",
      date: "2024-01-01",
    },
  ];

  const [files, setFiles] = useState<FileList | null>(null);
  const [jsonFiles, setJsonFiles] = useState<JsonFile[] | null>(null);

  useEffect(() => {
    if (files) {
      convertFilesToBase64String(files).then((jsonFiles) => {
        setJsonFiles(jsonFiles);
      });
    }
  }, [files]);

  const handleFileSubmit = async () => {
    // handle files submit
    const data = await uploadFiles(jsonFiles!);
    console.log(data);
  };

  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="w-[100%]">
        <SidebarTrigger />
        <UploadFile setFiles={setFiles} handleFileSubmit={handleFileSubmit} />
        <div className="p-6">
          <DataTable columns={columns} data={fileData} />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
