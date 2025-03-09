"use client";

import { useFormContext } from "@/lib/context/Context";
import FormRenderer from "./Renderer";

export const PagePreview = () => {
  const {
    state: { pages, previewPageIndex },
  } = useFormContext();

  return (
    <FormRenderer
      isPreview={true}
      previewData={{
        pages,
        pageIndex: previewPageIndex,
      }}
    />
  );
};
