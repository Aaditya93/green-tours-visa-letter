<div align="center">

<img src="./public/tours.png" alt="Green Tours Logo" width="120" />

# 🛡️ Green Tours Visa Letter

Efficiently manage and automate visa letter applications with AI-powered data extraction and streamlined workflows.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables)

</div>

---

## 🌟 Overview

**Green Tours Visa Letter** is a comprehensive platform designed for Green Tours Vietnam to streamline the visa application process. It automates passport data extraction using Google Gemini AI, manages multi-tenant travel agent accounts, and generates professional visa letters in PDF and XLSX formats.

Built with **Next.js 15**, it provides a modern, localized experience (English & Chinese) with a focus on speed, reliability, and accuracy.

## ✨ Features

- 🌍 **Internationalization (i18n)**: Full support for English and Chinese locales using `next-intl`.
- 🤖 **AI-Powered OCR**: Automatic extraction of passport details using Google Gemini 1.5 Flash.
- 🔐 **Secure Authentication**: Robust auth system via Auth.js (v5) supporting Credentials, Google, and GitHub providers.
- 🏢 **Multi-Tenant Management**: Support for different roles (Admin, Travel Agents) with company-specific pricing and dashboards.
- 📄 **Document Generation**: Instant generation of visa forms and letters in PDF and high-quality XLSX formats.
- ☁️ **Cloud Native**: Integrated with AWS S3 for secure file storage and AWS SQS for reliable background job processing.
- 🎨 **Modern UI**: Polished, responsive interface built with Shadcn UI, Tailwind CSS, and Framer Motion.

## 🏗️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) with Turbopack
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Auth.js v5](https://authjs.dev/)
- **AI/ML**: [Google Gemini AI](https://ai.google.dev/) (Generative AI SDK)
- **Cloud Services**: [AWS S3](https://aws.amazon.com/s3/) & [AWS SQS](https://aws.amazon.com/sqs/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Mailing**: [Resend](https://resend.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- A running MongoDB instance (or MongoDB Atlas)
- Google AI API Key (for OCR features)
- AWS Account with S3 Bucket and SQS Queue access

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aadityashewale/green-tours-visa-letter.git
   cd green-tours-visa-letter
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and populate it with the required values (see below).

4. **Start the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🛠️ Environment Variables

The following environment variables are required for full functionality:

| Variable                            | Description                                          |
| :---------------------------------- | :--------------------------------------------------- |
| `NEXT_PUBLIC_MONGODB_URI`           | MongoDB connection string                            |
| `NEXTAUTH_SECRET`                   | Secret used to sign Auth.js tokens                   |
| `GOOGLE_GENERATIVE_AI_API_KEY`      | API Key for Google Gemini 1.5 Flash                  |
| `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`     | AWS Access Key ID                                    |
| `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key                                |
| `NEXT_PUBLIC_AWS_REGION`            | AWS Region (e.g., `ap-southeast-1`)                  |
| `NEXT_PUBLIC_AWS_BUCKET_NAME`       | S3 Bucket name for file uploads                      |
| `NEXT_PUBLIC_AWS_SQS_URL`           | AWS SQS Queue URL for job processing                 |
| `RESEND_API_KEY`                    | API Key for Resend email service                     |
| `DOMAIN`                            | Base application URL (e.g., `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID`                  | Google OAuth Client ID                               |
| `GOOGLE_CLIENT_SECRET`              | Google OAuth Client Secret                           |

> [!IMPORTANT]
> Ensure `NEXT_PUBLIC_MONGODB_URI` is correctly set, as the application requires a database connection even for initial navigation.

---

<div align="center">
Built for <b>Green Tours Vietnam</b>
</div>
