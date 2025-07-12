"use client"; // Required directive to mark this as a Client Component in Next.js

import React, { useState } from "react";

interface InteractiveLinkProps {
  countries: string[];       // Array of country names to be displayed inside the tooltip
  children: React.ReactNode; // Content to be rendered as the clickable trigger (usually text or elements)
}

/**
 * InteractiveLink component renders a clickable text element that shows a tooltip
 * containing a list of countries on mouse hover.
 * 
 * Features:
 * - Tooltip appears when the user hovers over the text and disappears when mouse leaves.
 * - Tooltip content is dynamically generated based on the passed 'countries' array.
 * - Prevents default link behavior on click to avoid unwanted navigation.
 * - Styled with Tailwind CSS for appearance and positioning.
 * 
 * @param {string[]} countries - List of countries shown in tooltip.
 * @param {React.ReactNode} children - The clickable trigger content.
 * @returns JSX.Element
 */
export default function InteractiveLink({ countries, children }: InteractiveLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
        onClick={e => e.preventDefault()}  // Prevent default navigation on click
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={showTooltip}
      >
        {children}
      </span>

      {showTooltip && (
        <div
          className="absolute left-0 top-full mt-1 w-48 bg-[#525252] text-white text-sm rounded shadow-lg p-3 z-10"
          role="tooltip"
        >
          {countries.length > 0 ? (
            countries.map((country, idx) => (
              <p key={idx} className="leading-snug">
                {country}
              </p>
            ))
          ) : (
            <p>No countries found</p>
          )}
        </div>
      )}
    </div>
  );
}
