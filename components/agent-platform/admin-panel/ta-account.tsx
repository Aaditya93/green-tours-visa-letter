"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { approveTravelAgent } from "@/actions/agent-platform/admin-panel/approve-travel-agent";
import { rejectTravelAgent } from "@/actions/agent-platform/admin-panel/reject-travel-agent";
import { toast } from "sonner";
import { useState } from "react";
import { ITravelAgentUser } from "@/db/models/travelAgentUser";

export const UserApprovalCards = (UserApprovalCardsProps: {
  data: ITravelAgentUser[];
}) => {
  const t = useTranslations("adminPanel.card");
  const { data } = UserApprovalCardsProps;
  const [selectedStaff, setSelectedStaff] = useState("");
  const salesStaff = [
    "Solia",
    "Hanna",
    "Mochi",
    "Jimmy Chan",
    "Connie",
    "Sophie",
    "Nora",
    "Celine",
    "Vivi",
    "Anne",
    "Adora",
    "Nina",
    "Keats",
    "Olivia",
    "Aaditya",
  ];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id: string) => {
    if (!selectedStaff) return toast.error("Please select a staff member");
    try {
      const result = await approveTravelAgent(id, selectedStaff);
      if (result.success == false)
        return toast.error("No response from server");

      toast.success(result.data);
    } catch (error) {
      console.error(error);
      toast.error("Internal server error");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await rejectTravelAgent(id);
      if (result.success == false)
        return toast.error("No response from server");

      toast.success(result.data);
    } catch (error) {
      console.error(error);
      toast.error("Internal server error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4  max-w-7xl mx-auto">
      {data.map((user) => (
        <Card key={user._id} className="w-full p-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("email")}</p>
              <p className="text-base font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("company")}</p>
              <p className="text-base font-medium">{user.company}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("country")}</p>
              <p className="text-base font-medium">{user.country}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("createdAt")}</p>
              <p className="text-base font-medium">
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">{t("address")}</p>
              <p className="text-base font-medium">{user.address}</p>
            </div>
            <div className="space-y-1">
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="mt-4">
                  <SelectValue placeholder={t("select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("sales")}</SelectLabel>
                    {salesStaff.map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              onClick={() => handleApprove(user._id)}
              className="flex-1 bg-green-500 "
            >
              {t("approve")}
            </Button>
            <Button
              onClick={() => handleReject(user._id)}
              variant="destructive"
              className="flex-1"
            >
              {t("reject")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default UserApprovalCards;
