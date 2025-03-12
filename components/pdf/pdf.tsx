"use client";
import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Trash2, Images, Download } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

const PDFUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [images, setImages] = useState<Array<{ url: string; pageNum: number }>>(
    []
  );
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    // This code will only run on the client side after initial render
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://passport-2.s3.ap-southeast-1.amazonaws.com/pdf.worker.mjs";
  }, []);

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & {
      files: FileList;
    };
  }

  const handleFileChange = (event: FileChangeEvent): void => {
    const file = event.target.files[0];

    // Validate file type
    if (file && file.type !== "application/pdf") {
      setError("Please upload only PDF files");
      return;
    }

    // Validate file size (max 10MB)
    if (file && file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setError("");
    setImages([]);

    // Create preview URL
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onloadend = (): void => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    setImages([]);

    // Reset file input
    const fileInput = document.getElementById("pdfUpload");
    if (fileInput) {
      (fileInput as HTMLInputElement).value = "";
    }
  };

  const convertPdfToImages = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setImages([]);

    try {
      // Read the PDF file
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Convert pages to images
      const imagePromises = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);

        // Create canvas for rendering
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Failed to get canvas context");
        }

        // Calculate scale to maintain aspect ratio
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to image
        imagePromises.push(
          new Promise<{ url: string; pageNum: number }>((resolve) => {
            canvas.toBlob((blob) => {
              if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                resolve({
                  url: imageUrl,
                  pageNum: pageNum,
                });
              }
            }, "image/png");
          })
        );
      }

      // Wait for all pages to be converted
      const convertedImages = await Promise.all(imagePromises);
      setImages(convertedImages);
    } catch (error) {
      console.error("PDF conversion error:", error);
      setError("Failed to convert PDF to images");
    } finally {
      setIsConverting(false);
    }
  };

  interface ImageDownloadParams {
    imageUrl: string;
    pageNum: number;
  }
  const generateId = (): string => {
    try {
      const timestamp = Date.now();
      const random = Math.random() * 1000000; // Add randomness
      return `${timestamp}-${Math.floor(random).toString(36)}`;
    } catch (error) {
      console.error('Error generating ID:', error);
      return Date.now().toString(36); // Fallback
    }
  };

  const downloadImage = ({ imageUrl, pageNum }: ImageDownloadParams): void => {
    const link = document.createElement("a");
    link.href = imageUrl;
    const randomId = generateId();
    link.download = `pdf-page-${pageNum}-${randomId}.png`;
    link.click();
  };

  const downloadAllImages = () => {
    images.forEach((image) =>
      downloadImage({ imageUrl: image.url, pageNum: image.pageNum })
    );
  };

  interface FormSubmitEvent extends React.FormEvent<HTMLFormElement> {
    preventDefault: () => void;
  }

  const handleSubmit = (event: FormSubmitEvent): void => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF file");
      return;
    }

    // Here you would typically upload the file to a server

  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-primary rounded-t-lg mb-4">
        <CardTitle className="text-primary-foreground ">PDF Upload </CardTitle>
      </CardHeader>
      <CardDescription  className="text-sm justify-start ml-6 mb-4">
          Upload, preview, and convert PDF to images
        </CardDescription>
     
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pdfUpload">Upload PDF</Label>
            <Input
              id="pdfUpload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mt-2"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}

          {previewUrl && images.length === 0 && (
            <div className="mt-4">
              <Label>PDF Preview</Label>
              <iframe
                src={previewUrl}
                className="w-full h-64 border rounded-md mt-2"
                title="PDF Preview"
              />
            </div>
          )}
          {images.length === 0 && (
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={convertPdfToImages}
              
                className="flex-grow"
              >
                <Images className="mr-2 h-4 w-4" />
                {isConverting ? "Converting..." : "Convert to Images"}
              </Button>
              </div>
            )}

              {images.length > 0 && (
                <div   className="flex items-end justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={downloadAllImages}
                 
                >
                  <Download className="mr-2 h-4 w-4" /> Download All
                </Button>
                </div>
              )}

         

          {isConverting && (
            <p className="text-center text-gray-500 mt-2">
              Converting PDF pages to images...
            </p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((image) => (
                <div key={image.pageNum} className="relative">
                  <Image
                    src={image.url}
                    width={200}
                    height={200}
                    alt={`PDF Page ${image.pageNum}`}
                    className="w-full h-auto border rounded-md"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        downloadImage({
                          imageUrl: image.url,
                          pageNum: image.pageNum,
                        })
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-center mt-2 text-sm">
                    Page {image.pageNum}
                  </p>
                </div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PDFUploader;
