"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BsPassport } from "react-icons/bs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FolderUpload from "@/components/upload/folder";

const UploadCard = () => {
  const [isGroup, setIsGroup] = useState(false);

  const handleTabChange = (value: string) => {
    const newIsGroup = value === "Group";
    setIsGroup(newIsGroup);
  };

  return (
    <Tabs
      defaultValue="Individual"
      className="w-[400px]"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          className="bg-green-100"
          value="Individual"
          onClick={() => setIsGroup(false)}
        >
          Individual
        </TabsTrigger>
        <TabsTrigger
          className="bg-green-100"
          value="Group"
          onClick={() => setIsGroup(true)}
        >
          Group
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Individual">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BsPassport size={24} />
              <span>
                {isGroup ? "Group Application" : "Individual Application"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please upload the front page of your passport to get started!</p>
            <div className="mt-6">
              <Label
                htmlFor="passport-upload"
                className="block mb-2 text-sm font-medium"
              >
                Passport
              </Label>
              <FolderUpload isGroup={isGroup} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="Group">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BsPassport size={24} />
              <span>
                {isGroup ? "Group Application" : "Individual Application"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please upload the front page of your passport to get started!</p>
            <div className="mt-6">
              <Label
                htmlFor="passport-upload"
                className="block mb-2 text-sm font-medium"
              >
                Passport
              </Label>
              <FolderUpload isGroup={isGroup} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UploadCard;
