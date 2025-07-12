"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton component renders a styled button with a left arrow icon.
 * On click, it navigates back to the previous page using Next.js router.back(),
 * but if history stack is empty (cannot go back), it redirects to homepage ("/").
 * 
 * Usage: Typically used for navigation to return to the homepage or previous view.
 */
export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-4 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 cursor-pointer"
      aria-label="Back to previous page"
    >
      <ArrowLeft size={16} />
      Back to Homepage
    </button>
  );
}
