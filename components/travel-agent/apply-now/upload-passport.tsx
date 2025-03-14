"use client";
import { useEffect } from "react";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, X, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { z } from "zod";
import { toast } from "sonner";
import { imageFileSchema } from "@/app/schemas";
import compress from "browser-image-compression";
import { useRouter } from "next/navigation";
import { updateApplication } from "@/actions/application/application";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuid } from "uuid";
import { getSignedURL } from "@/actions/upload/s3";
import { run } from "@/actions/upload/gemini";
import {
  createApplicationIndiviualTravelAgent,
  createApplicationTravelAgent,
} from "@/actions/agent-platform/apply-visa-letter";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
interface FileUploadProps {
  duration: string;
  speed: string;
  isGroup: boolean;
  cost: number;
  currency: string;
  groupSize?: number;
  onFileSelected?: (files: File[]) => void;
  maxTotalSize?: number;
  entryType: string;
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

const FileUpload: React.FC<FileUploadProps> = ({
  speed,
  isGroup,
  entryType,
  cost,
  currency,
  groupSize = 1,
  onFileSelected,
  maxTotalSize = 20 * 1024 * 1024 * 1024,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [calltoast, setcalltoast] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => {
    if (calltoast && isGroup) {
      router.push(`/travel-agent/application/visa/${id}`);
    }
  }, [calltoast, isGroup, id, router]);

  useEffect(() => {
    if (calltoast) {
      toast.success("Application has been created", {
        description: `${
          isGroup ? "Group" : "Individual"
        } application has been created successfully`,
      });
      setcalltoast(false);
    }
  }, [calltoast, isGroup]);
  const generatePreviews = (files: File[]) => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const { validFiles, validationErrors } = validateAndFilterFiles(files);

      if (validationErrors.length === 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        generatePreviews(validFiles);
        if (onFileSelected) {
          onFileSelected([...selectedFiles, ...validFiles]);
        }
      }
      setErrors(validationErrors);
    },
    [selectedFiles, onFileSelected]
  );

  const validateAndFilterFiles = (files: FileList) => {
    const validationErrors: string[] = [];
    const validFiles: File[] = [];
    let totalSize = 0;

    // Check if we're trying to add more files than allowed
    if (isGroup) {
      if (selectedFiles.length + files.length > groupSize) {
        validationErrors.push(
          `Maximum ${groupSize} passports allowed for group application`
        );
        return { validFiles, validationErrors };
      }
    } else {
      if (selectedFiles.length + files.length > 1) {
        validationErrors.push(
          "Only one passport allowed for individual application"
        );
        return { validFiles, validationErrors };
      }
    }

    Array.from(files).forEach((file) => {
      try {
        imageFileSchema.parse({ name: file.name, type: file.type });
        totalSize += file.size;

        if (totalSize > maxTotalSize) {
          validationErrors.push(`Total file size exceeds 20 GB limit`);
        } else {
          validFiles.push(file);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          validationErrors.push(`${file.name}: ${error.errors[0].message}`);
        }
      }
    });

    return { validFiles, validationErrors };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const { validFiles, validationErrors } = validateAndFilterFiles(files);

    if (validationErrors.length === 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      generatePreviews(validFiles);
      if (onFileSelected) {
        onFileSelected([...selectedFiles, ...validFiles]);
      }
    }

    setErrors(validationErrors);
  };

  interface FileUploadResult {
    fileName: string;
    success: boolean;
    error?: string;
  }
  const IMAGE_COMPRESSION_OPTIONS = {
    maxSizeMB: 0.25, // Target file size of 1MB
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
        const id = await createApplicationTravelAgent(
          groupId,
          totalFiles,
          cost,
          currency,
          speed,
          entryType
        );
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
              const _id = await createApplicationIndiviualTravelAgent(
                id,
                1,
                response,
                fileName,
                cost,
                currency,
                speed,
                entryType
              );
              setcalltoast(true);
              setProcessingProgress(100);
              setOpen(false);
              router.push(`/travel-agent/application/visa/${_id}`);
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
      setOpen(false);

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

  // [Previous functions remain the same: generateImageName, computeSHA256, IMAGE_COMPRESSION_OPTIONS, uploadFiles]

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    if (onFileSelected) {
      onFileSelected(selectedFiles.filter((_, i) => i !== index));
    }
  };
  const removeAllFiles = () => {
    // Revoke all object URLs to prevent memory leaks
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    // Clear all states
    setSelectedFiles([]);
    setPreviews([]);

    // Notify parent component
    if (onFileSelected) {
      onFileSelected([]);
    }
  };

  return (
    <div className="mx-auto px-4">
      <Card className="max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between bg-primary rounded-t-lg text-secondary">
          <CardTitle className="flex items-center text-2xl">
            <FileText className="mr-3 h-6 w-6" />
            {isGroup
              ? "Group Visa Letter Application"
              : "Individual Visa Letter Application"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <div>
            {(!isGroup && selectedFiles.length === 0) ||
            (isGroup && selectedFiles.length < groupSize) ? (
              <div
                className="flex items-center justify-center w-full"
                onDragEnter={handleDrag}
              >
                <label
                  className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
                    ${
                      dragActive
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50"
                    } transition-all duration-200`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center px-4 py-6">
                    <FileText className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="mb-2 text-lg font-medium text-gray-700">
                      {dragActive
                        ? "Drop your files here"
                        : isGroup
                        ? `Upload ${groupSize} passport${
                            groupSize > 1 ? "s" : ""
                          } (${selectedFiles.length}/${groupSize} uploaded)`
                        : "Upload your passport"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {dragActive
                        ? "Release to upload"
                        : "Drag & drop or click to select"}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Supported formats: JPG, PNG
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple={isGroup}
                  />
                </label>
              </div>
            ) : null}

            {errors.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm">
                      {error}
                    </p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {selectedFiles.length > 0 && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">
                    Selected Files: {selectedFiles.length}
                    {isGroup ? `/${groupSize}` : ""}
                  </h4>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border p-4">
                  <div className="gap-4">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group w-full mb-4 bg-muted rounded-lg overflow-hidden"
                      >
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={370}
                          height={100}
                          className="object-cover transition-transform group-hover:scale-105"
                          priority={index === 0}
                        />

                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length > 0 &&
        (isGroup ? selectedFiles.length === groupSize : true) && (
          <div className="mt-4">
            <Dialog open={open}>
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
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant={"secondary"}
                onClick={removeAllFiles}
                className="w-full"
              >
                Change Passport
              </Button>
              <Button type="submit" onClick={uploadFiles} className="w-full">
                Upload {isGroup ? "Passports" : "Passport"}
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default FileUpload;
