"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import compress from "browser-image-compression";
import { createApplicationIndiviual } from "@/actions/application/application";
import { v4 as uuid } from "uuid";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { getSignedURL } from "@/actions/upload/get-signed-url";
import { run } from "@/actions/upload/extract-passport";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const IMAGE_COMPRESSION_OPTIONS = {
  maxSizeMB: 0.25, // Target file size of 250KB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true,
  fileType: "image/jpeg", // Convert to JPEG for consistent compression
};

const PhotoUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [calltoast, setcalltoast] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calltoast) {
      toast.success("Application has been created");
    }
  }, [calltoast]);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const generateImageName = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `image_${timestamp}_${randomString}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreview(reader.result as string);
        setCameraError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCreateApplication = async () => {
    if (!selectedImage) {
      toast.error("No image selected");
      return;
    }

    try {
      setProgressOpen(true);
      const setpValue = 100 / 3;
      setProcessingProgress(setpValue);

      const id = uuid();

      let processedFile = selectedImage;
      if (selectedImage.type.startsWith("image/")) {
        try {
          processedFile = await compress(
            selectedImage,
            IMAGE_COMPRESSION_OPTIONS,
          );
        } catch (compressionError) {
          console.error("Image compression failed:", compressionError);
          // Fallback to original file if compression fails
        }
      }
      const fileName = `passport/${id}/${generateImageName()}.${processedFile.name
        .split(".")
        .pop()}`;

      const signedURLResult = await getSignedURL({
        fileSize: processedFile.size,
        fileType: processedFile.type,
        checksum: await computeSHA256(processedFile),
        key: fileName,
      });

      if (!signedURLResult.success) {
        throw new Error(`Failed to get signed URL for ${processedFile.name}`);
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
        const result = await createApplicationIndiviual(
          id,
          1,
          response,
          fileName,
        );

        router.push(`/application/visa/${result}`);
      }
      setProcessingProgress((prevProgress) => prevProgress + setpValue);
    } catch (error) {
      console.error("Application creation error:", error);
      toast.error("Failed to create application");
      setProgressOpen(false);
    } finally {
      setcalltoast(true);
      setProcessingProgress(100);
      setProgressOpen(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { exact: "environment" }, // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError(
        "Unable to access camera. Please check permissions and try again.",
      );
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        }, "image/jpeg");
      });

      const file = new File([blob], "captured-image.jpg", {
        type: "image/jpeg",
      });

      setSelectedImage(file);
      setImagePreview(canvas.toDataURL("image/jpeg"));

      // Stop camera tracks
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());

      setOpen(false);
    }
  };

  const resetCamera = () => {
    setCameraError(null);
    setOpen(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const resetImage = () => {
    setOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreview(reader.result as string);
        setCameraError(null);
      };
      reader.readAsDataURL(file);
    } else {
      setCameraError("Please upload an image file");
    }
  };

  return (
    <Card className="w-full  max-w-md mx-auto">
      <CardHeader className="bg-primary rounded-t-lg ">
        <CardTitle className="text-primary-foreground">Scan Passport</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Preview Area */}

        <div
          ref={dropZoneRef}
          className={`aspect-video bg-primary-foreground flex items-center justify-center mx-auto w-full max-w-sm relative transition-colors ${
            isDragging ? "border-2 border-dashed border-primary" : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <AspectRatio ratio={16 / 9}>
              <Image
                src={imagePreview}
                alt="Uploaded"
                fill
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Camera className="w-12 h-12 text-primary opacity-50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Drag and drop an image here or use the buttons below
              </p>
            </div>
          )}
        </div>

        {cameraError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{cameraError}</AlertDescription>
          </Alert>
        )}
        {!imagePreview && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              className="w-full py-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2" /> Upload Image
            </Button>
          </>
        )}

        {/* Camera Dialog */}
        {!imagePreview && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full py-6" onClick={startCamera}>
                <Camera className="mr-2" /> Scan Passport
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Take Passport Photo</DialogTitle>
                <DialogClose
                  onClick={() => {
                    resetCamera();
                    setOpen(false);
                  }}
                />
              </DialogHeader>

              <video
                ref={videoRef}
                className="w-full rounded-lg"
                style={{ display: cameraError ? "none" : "block" }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {!cameraError && (
                <div className="flex space-x-4 mt-4 ">
                  <Button onClick={capturePhoto}>Capture</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* File Upload */}

        {/* Action Buttons */}
        {imagePreview && (
          <div className="flex space-x-4">
            <Button variant="outline" onClick={resetImage} className="w-1/2">
              Retake
            </Button>
            <Button onClick={onCreateApplication} className="w-1/2">
              Create Application
            </Button>
          </div>
        )}

        {/* Progress Dialog */}

        <Dialog open={progressOpen}>
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
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
