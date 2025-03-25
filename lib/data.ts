import { Application } from "@/app/schemas/types";
import { IApplication } from "@/db/models/application";

const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    // Handle invalid date scenario
    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }

    // Extract UTC day, month, and year
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getUTCFullYear();

    // Return date in DD-MM-YYYY format
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};
const formatVietnamDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid Date");
    }

    const vietnamFormatter = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
    });

    return vietnamFormatter.format(date);
  } catch (error) {
    console.error("Error formatting Vietnam date:", error);
    return "";
  }
};

export function convertToApplications(input: IApplication[]): Application[] {
  return input.flatMap((entry) =>
    entry.passportDetails.map((passport) => {
      const applicationObject = {
        id: entry._id,
        passportId: passport._id || "",
        fullName: passport.fullName || "",
        stage: passport.stage,
        iref: passport.iref,
        birthday: formatDate(passport.birthday.toString()) || "",
        sex: passport.sex || "",
        passportType: passport.passportType || "",
        originalNationality: passport.originalNationality || "",
        nationalityCurrent: passport.nationalityCurrent || "",
        passportNumber: passport.passportNumber || "",
        bill: passport.bill,
        payment: passport.payment,
        immigrationPrice: passport.immigrationFee?.amount || 0,
        immigrationCurrency: passport.immigrationFee?.currency || "USD",
        immigration: passport.immigrationFee?.name || "",
        code:
          input.length > 1
            ? (entry.code + entry.passportDetails.indexOf(passport)).toString()
            : entry.code.toString(),
        job: entry.job,
        workPlace: entry.workPlace,
        purpose: entry.purpose,
        placeOfIssue: entry.placeOfIssue,
        duration: entry.duration,
        fromDate: formatDate(entry.entryDetails.fromDate.toString()),
        toDate: formatDate(entry.entryDetails.toDate.toString()),
        speed: entry.processingInfo.speed,
        notes: entry.processingInfo.notes,
        creator: entry.creator.creator,
        createdDate: formatVietnamDate(entry.creator.createdDate.toString()),
        createdTime: entry.creator.createdTime,
        handleBy: entry.creator.handleBy,
        result: formatDate(entry.result.toString()),
        cost: entry.cost / entry.passportDetails.length,
        currency: entry.currency,
        role: entry.creator.role,
        companyId: entry.creator.companyId,
        travelDuration: entry.travelDuration,
      };
      return applicationObject;
    })
  );
}

const placeOfIssue = [
  {
    value: "Tổng lãnh sự quán Việt Nam tại Côn Minh - Trung Quốc",
    label: "China - Kunming",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Houston - Hoa Kỳ",
    label: "USA -  Houston",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Thượng Hải - Trung Quốc",
    label: "China - Nanning",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Quảng Châu - Trung Quốc",
    label: "China - Guangzhou",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Sihanouk Ville - Campuchia",
    label: "Cambodia - Sihanouk Ville",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Sydney - Australia",
    label: "Australia - Sydney",
  },
  {
    value: "Tổng lãnh sự quán Việt Nam tại Thượng Hải - Trung Quốc",
    label: "China - Shanghai",
  },
  {
    value: "Văn phòng Kinh tế-Văn hoá Việt Nam tại Đài Bắc",
    label: "Taiwan - Taipei",
  },
  {
    value: "Đại sứ quán Việt Nam tại Bangladesh",
    label: "Bangladesh",
  },
  {
    value: "Đại sứ quán Việt Nam tại Canberra - Australia",
    label: "Australia - Canberra",
  },
  {
    value: "Đại sứ quán Việt Nam tại Nhật Bản",
    label: "Japan",
  },
  { value: "SBQT Nội Bài", label: "Noi Bai Airport" },
  { value: "SBQT Phú Bài", label: "Phu Bai Airport" },
  { value: "SBQT Phú Quốc", label: "Phu Quoc Airport" },
  { value: "SBQT Tân Sơn Nhất", label: "Tan Son Nhat Airport" },
  { value: "SBQT Cam Ranh", label: "Cam Ranh Airport" },
  { value: "SBQT Đà Nẵng", label: "Da Nang Airport" },
  { value: "SBQT Liên Khương", label: "Lien Khuong Airport" },
  { value: "SBQT Cát Bi", label: "Cat Bi Airport" },
  { value: "Cửa khẩu Cầu Treo", label: "Cau Treo Frontier" },
  { value: "Cửa khẩu Cha Lo", label: "Cha Lo Frontier" },
  { value: "Cửa khẩu Hà Tiên", label: "Ha Tien Frontier" },
  { value: "Cửa khẩu Hữu Nghị", label: "Huu Nghi Frontier" },
  { value: "Cửa khẩu Lao Bảo", label: "Lao Bao Frontier" },
  { value: "Cửa khẩu Lào Cai", label: "Lao Cai Frontier" },
  { value: "Cửa khẩu Mộc Bài", label: "Moc Bai Frontier" },
  { value: "Cửa khẩu Móng Cái", label: "Mong Cai Frontier" },
  { value: "Cửa khẩu Na Mèo", label: "Na Meo Frontier" },
  { value: "Cửa khẩu Tây Trang", label: "Tay Trang Frontier" },
  { value: "Cửa khẩu Thanh Thủy", label: "Thanh Thuy Frontier" },
  { value: "Cửa khẩu Xa Mát", label: "Xa Mat Frontier" },
];

interface Option {
  value: string;
  label: string;
}
export const getValueByLabel = (label: string, options: Option[]): string => {
  const found = options.find((option) => option.label === label);
  return found?.value || label;
};
export const downloadFileData = (data: Application[]) => {
  // If data is not an array, try to convert it to an array
  const dataArray = Array.isArray(data) ? data : [data];

  const formattedData = dataArray.map((entry) => ({
    STT: entry.code,
    "Họ và tên (*)": entry.fullName,
    "Ngày, tháng, năm sinh (*)": entry.birthday,
    "Giới tính (*)": entry.sex === "Male" ? "Nam" : "Nữ",
    "Quốc tịch hiện nay (*)": entry.nationalityCurrent,
    "Quốc tịch gốc": entry.originalNationality,
    "Nghề nghiệp (*)": "Tự do",
    "Nơi làm việc": entry.workPlace,
    "Số hộ chiếu (*)": entry.passportNumber,
    "Loại hộ chiếu (*)": "Hộ chiếu phổ thông",
    "Mục đích nhập cảnh (*)": "du lịch",
    "Đề nghị từ ngày (*)": entry.fromDate,
    "Đến ngày (*)": entry.toDate,
    "Giá trị thị thực (*)":
      entry.duration === "Single Entry" ? "Một lần" : "Nhiều lần",
    "Nơi nhận thị thực (*)": getValueByLabel(entry.placeOfIssue, placeOfIssue),
  }));

  return formattedData;
};
