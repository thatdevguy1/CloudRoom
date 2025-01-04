import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, DragEventHandler } from "react";
import { Skeleton } from "../ui/skeleton";

interface FileUploadProps {
  setFiles: (files: FileList | null) => void;
  handleFileSubmit: () => void;
  loading: boolean;
}
export default function FileUpload({
  setFiles,
  handleFileSubmit,
  loading,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(e.dataTransfer.files);
      const dataTransfer = new DataTransfer();

      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        dataTransfer.items.add(e.dataTransfer.files[i]);
      }

      fileInputRef.current!.files = dataTransfer.files;
    }
  };

  return (
    <Card className="ml-6 mr-6">
      <CardContent className="p-6 space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center"
        >
          <FileIcon className="w-12 h-12" />
          <span className="text-sm font-medium text-gray-500">
            Drag and drop a file or click to browse
          </span>
          <span className="text-xs text-gray-500">
            PDF, image, video, or audio
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <Label htmlFor="file" className="text-sm font-medium">
            File
          </Label>
          <Input
            id="file"
            ref={fileInputRef}
            type="file"
            name="files"
            placeholder="Files"
            multiple
            accept="*"
            onChange={(e) => setFiles(e?.target?.files)}
          />
        </div>
      </CardContent>
      <CardFooter>
        {loading ? (
          <Skeleton className="w-24 h-8" />
        ) : (
          <Button onClick={handleFileSubmit} size="lg">
            Upload
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface FileIconProps extends React.SVGProps<SVGSVGElement> {
  className: string;
}
function FileIcon(props: FileIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
