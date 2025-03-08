"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormRenderer from "@/components/form/Renderer";
import { useParams } from "next/navigation";

export default function FormPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className='min-h-screen bg-gray-50 py-12 dark:bg-gray-900'>
      <ToastContainer position='top-right' autoClose={5000} />
      <FormRenderer formToken={id} />
    </div>
  );
}
