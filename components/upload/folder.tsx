"use client";
import { useEffect } from "react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText, X, AlertCircle, FolderPlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { toast } from "sonner";
import { imageFileSchema } from "@/app/schemas";
import compress from "browser-image-compression";
import { useRouter } from "next/navigation";
import {
  createApplication,
  createApplicationIndiviual,
  updateApplication,
} from "@/actions/application/application";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { v4 as uuid } from "uuid";
import { getSignedURL } from "@/actions/upload/s3";
import { run } from "@/actions/upload/gemini";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
interface FolderUploadProps {
  isGroup: boolean;
  onFolderSelected?: (files: File[]) => void;
  maxTotalFiles?: number;
  maxTotalSize?: number; // in MB
}

function generateImageName() {
  const timestamp = Date.now(); // Get current timestamp
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
  return `image_${timestamp}_${randomString}`; // Combine timestamp and random string
}

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

const FolderUpload: React.FC<FolderUploadProps> = ({
  onFolderSelected,
  isGroup,
  maxTotalFiles = 100,
  maxTotalSize = 20 * 1024 * 1024 * 1024,
  // 20GB default
}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [folderName, setFolderName] = useState<string>("");
  const [calltoast, setcalltoast] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    if (calltoast && isGroup) {
      router.push(`/application/visa/${id}`);
    }
  }, [calltoast, isGroup, id, router]);

  useEffect(() => {
    if (calltoast) {
      toast.success("Application has been created", {
        description: `${
          isGroup ? "Group" : `Individual`
        } application has been created successfully`,
      });
      setcalltoast(false);
    }
  }, [calltoast, isGroup]);
  const validateAndFilterFiles = (files: FileList) => {
    const validationErrors: string[] = [];
    const validFiles: File[] = [];
    let totalSize = 0;
    const systemFilePatterns = [
      /^\./, // Hidden files starting with dot
      /^__MACOSX/, // Mac OS metadata
      /^desktop\.ini$/, // Windows desktop settings
      /^Thumbs\.db$/, // Windows thumbnail cache
      /^\.DS_Store$/, // Mac OS folder settings
      /^\.git/, // Git related files
    ];

    Array.from(files).forEach((file) => {
      const isSystemFile = systemFilePatterns.some(
        (pattern) =>
          pattern.test(file.name) || pattern.test(file.webkitRelativePath)
      );

      if (isSystemFile) {
        return;
      }
      try {
        imageFileSchema.parse({ name: file.name, type: file.type });
        totalSize += file.size;

        if (totalSize > maxTotalSize) {
          validationErrors.push(`Total folder size exceeds 20 GB limit`);
        } else if (validFiles.length < maxTotalFiles) {
          validFiles.push(file);
        } else {
          validationErrors.push(
            `Exceeded maximum file count of ${maxTotalFiles}`
          );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.push(`${file.name}: ${error.errors[0].message}`);
        }
      }
    });

    return { validFiles, validationErrors };
  };
  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const { validFiles, validationErrors } = validateAndFilterFiles(files);

    setSelectedFiles(validFiles);
    setErrors(validationErrors);

    if (onFolderSelected) {
      onFolderSelected(validFiles);
    }
  };

  interface FileUploadResult {
    fileName: string;
    success: boolean;
    error?: string;
  }
  const IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 0.25, // Target file size of 250KB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true,
    fileType: "image/jpeg", // Convert to JPEG for consistent compression
  };

  const uploadFiles = async (): Promise<{
    success: boolean;
    results?: FileUploadResult[];
    error?: string;
  }> => {
    if (!selectedFiles.length) {
      setErrors((prev) => [...prev, "Please select files to upload"]);
      return { success: false, error: "No files selected" };
    }

    try {
      const totalFiles = selectedFiles.length;
      const setpValue = 100 / (totalFiles * 3);
      setProcessingProgress(setpValue);
      setOpen(true);
      const groupId = uuid();
      const uploadResults: FileUploadResult[] = [];

      if (isGroup) {
        const id = await createApplication(groupId, totalFiles);
        setId(id ?? "");
      }

      // Limit concurrent uploads to prevent overwhelming the system
      const MAX_CONCURRENT_UPLOADS = 3;

      const uploadFile = async (file: File): Promise<FileUploadResult> => {
        try {
          let processedFile = file;
          if (file.type.startsWith("image/")) {
            try {
              processedFile = await compress(file, IMAGE_COMPRESSION_OPTIONS);
            } catch (compressionError) {
              console.error("Image compression failed:", compressionError);
              // Fallback to original file if compression fails
            }
          }
          if (!isGroup) {
            const id = uuid();
            const fileName = `passport/${id}/${generateImageName()}.${file.name
              .split(".")
              .pop()}`;

            const signedURLResult = await getSignedURL({
              fileSize: processedFile.size,
              fileType: processedFile.type,
              checksum: await computeSHA256(processedFile),
              key: fileName,
            });

            if (!signedURLResult.success) {
              throw new Error(
                `Failed to get signed URL for ${processedFile.name}`
              );
            }

            const { url } = signedURLResult.success;

            await fetch(url, {
              method: "PUT",
              headers: { "Content-Type": processedFile.type },
              body: processedFile,
            });

            setProcessingProgress((prevProgress) => prevProgress + setpValue);

            const formData = new FormData();
            formData.append("file", processedFile);

            const response = await run(formData);

            if (response) {
              setProcessingProgress((prevProgress) => prevProgress + setpValue);
              await createApplicationIndiviual(id, 1, response, fileName);
            }

            setProcessingProgress((prevProgress) => prevProgress + setpValue);

            return {
              fileName: processedFile.name,
              success: true,
            };
          } else {
            const fileName = `passport/${groupId}/${generateImageName()}.${processedFile.name
              .split(".")
              .pop()}`;

            const signedURLResult = await getSignedURL({
              fileSize: processedFile.size,
              fileType: processedFile.type,
              checksum: await computeSHA256(processedFile),
              key: fileName,
            });

            if (!signedURLResult.success) {
              throw new Error(
                `Failed to get signed URL for ${processedFile.name}`
              );
            }

            const { url } = signedURLResult.success;

            await fetch(url, {
              method: "PUT",
              headers: { "Content-Type": processedFile.type },
              body: processedFile,
            });
            setProcessingProgress((prevProgress) => prevProgress + setpValue);

            const formData = new FormData();
            formData.append("file", processedFile);

            const response = await run(formData);

            setProcessingProgress((prevProgress) => prevProgress + setpValue);

            if (response) {
              await updateApplication(groupId, response, fileName);
              setProcessingProgress((prevProgress) => prevProgress + setpValue);
            }

            return {
              fileName: processedFile.name,
              success: true,
            };
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          return {
            fileName: file.name,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        } finally {
        }
      };

      // Prepare group application if needed

      // Upload files in batches
      for (let i = 0; i < totalFiles; i += MAX_CONCURRENT_UPLOADS) {
        const batch = selectedFiles.slice(i, i + MAX_CONCURRENT_UPLOADS);
        const batchResults = await Promise.all(
          batch.map((file) => uploadFile(file))
        );
        uploadResults.push(...batchResults);
      }

      // Final state updates

      setcalltoast(true);
      if (!isGroup) {
        router.push("/application/10");
      }
      setcalltoast(true);
      clearAllFiles();
      setProcessingProgress(100);
      // Check if all uploads were successful
      const allSuccessful = uploadResults.every((result) => result.success);

      setTimeout(() => setProcessingProgress(0), 500);

      return {
        success: allSuccessful,
        results: uploadResults,
      };
    } catch (error) {
      console.error("Upload process failed:", error);

      setProcessingProgress(0);
      setErrors((prev) => [
        ...prev,
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ]);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
  const removeFile = (fileToRemove: File) => {
    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(updatedFiles);

    if (onFolderSelected) {
      onFolderSelected(updatedFiles);
    }

    // Reset folder name if no files left
    if (updatedFiles.length === 0) {
      setFolderName("");
    }
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setErrors([]);
    setFolderName("");
    setOpen(false);
    setProcessingProgress(0);
    if (onFolderSelected) {
      onFolderSelected([]);
    }
  };

  return (
    <div>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Folder className="mr-2" />
            Upload Folder {isGroup}
          </CardTitle>
          {selectedFiles.length > 0 && (
            <Button variant="destructive" size="sm" onClick={clearAllFiles}>
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedFiles.length === 0 && (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="folder-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2  border-dashed rounded-lg cursor-pointer  "
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FolderPlus className="w-10 h-10 mb-3 " />
                    <p className="mb-2 text-sm ">
                      {folderName
                        ? `Selected Folder: ${folderName}`
                        : "Click to select a folder"}
                    </p>
                    <p className="text-xs ">
                      (Maximum {maxTotalFiles} files, 20 GB)
                    </p>
                  </div>
                  <input
                    id="folder-upload"
                    type="file"
                    ref={(input) => {
                      if (input) {
                        input.setAttribute("webkitdirectory", "true");
                        input.setAttribute("directory", "true");
                      }
                    }}
                    multiple
                    onChange={handleFolderChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm">{errors[0]}</p>
                </AlertDescription>
              </Alert>
            )}

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">
                    Selected Files: {selectedFiles.length}
                  </h4>
                </div>
                <ScrollArea className="h-64 w-full rounded-md border p-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between hover:bg-primary-foreground p-2 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm truncate max-w-[200px]">
                          {file.webkitRelativePath}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(file)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Dialog open={open}>
          <DialogTrigger asChild>
            <Button type="submit" onClick={uploadFiles} className="w-full">
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing Files...
              </DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Progress value={processingProgress} className="w-full" />
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <motion.div
                  key={processingProgress}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {processingProgress.toFixed(0)}% Complete
                </motion.div>
                <p className="mt-2 text-xs opacity-70">
                  {processingProgress < 30
                    ? "Preparing files..."
                    : processingProgress < 60
                    ? "Uploading..."
                    : processingProgress < 90
                    ? "Almost there..."
                    : "Finalizing..."}
                </p>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FolderUpload;
