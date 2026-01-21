"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateGallery from "@/components/templates/TemplateGallery";
import { Loader2 } from "lucide-react";

type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  isDefault: boolean;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    console.log('Selected template:', template);
    // Navigate to resume builder with template parameter
    router.push(`/resume-builder?template=${encodeURIComponent(template.name)}`);
  };

  const handleBackToHome = () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    router.push("/");
    
    // Reset loading state after navigation
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Choose a Resume Template</h1>
      <p className="text-gray-600 mb-6">
        Select a template to get started with your professional resume. You can
        customize it later.
      </p>

      {/* Template list */}
      <TemplateGallery onSelect={handleTemplateSelect} />

      {/* Extra navigation or actions */}
      <div className="mt-6">
        <button
          onClick={handleBackToHome}
          disabled={isNavigating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
        >
          {isNavigating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Back to Home'
          )}
        </button>
      </div>
    </div>
  );
}
