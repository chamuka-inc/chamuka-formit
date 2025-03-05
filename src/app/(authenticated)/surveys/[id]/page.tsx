"use client";

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SurveyRenderer from '@/components/survey/SurveyRenderer';
import { useParams } from 'next/navigation';

export default function SurveyPage() {
  const params = useParams();
  const id = params?.id as string;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <ToastContainer position="top-right" autoClose={5000} />
      <SurveyRenderer surveyToken={id} />
    </div>
  );
} 