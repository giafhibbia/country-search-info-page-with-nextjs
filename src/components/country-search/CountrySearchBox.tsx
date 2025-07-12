"use client";
import React, { useState, useRef } from "react";
import SuggestionList from "./SuggestionList";
import InvalidState from "./InvalidState";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * Type definition for Country object received from API.
 */
export type Country = {
  name: { common: string };
  cca2: string;
};

/**
 * CountrySearchBox component implements a controlled input search box
 * with autocomplete suggestions based on exact country name matching.
 *
 * Features:
 * - Tracks input state and fetches suggestions from REST Countries API.
 * - Handles debouncing race conditions by tracking latest input with useRef.
 * - Supports keyboard navigation through suggestions (ArrowUp, ArrowDown, Enter).
 * - Provides a clickable search icon to select first suggestion or fallback input.
 * - Shows an error state when no country matches the search query.
 * - Navigates to a dynamic country detail page on selection.
 */
export default function CountrySearchBox() {
  // Search input state controlled by user input
  const [query, setQuery] = useState("");

  // List of country suggestions based on current input query
  const [suggestions, setSuggestions] = useState<Country[]>([]);

  // Boolean flag to indicate no matching results found
  const [notFound, setNotFound] = useState(false);

  // Tracks the currently active suggestion index for keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);

  // Next.js router instance for navigation
  const router = useRouter();

  // Ref to store the latest query string to prevent race conditions
  const latestQuery = useRef("");

  /**
   * Utility function to convert string to Title Case.
   * Used as a fallback for manual input on search icon click.
   */
  function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  /**
   * Handles input change events on the search field.
   * Fetches country suggestions from REST Countries API using fullText=true for exact matches.
   * Updates suggestions only if response corresponds to the latest input query.
   * Handles error state if no results found.
   *
   * @param e React.ChangeEvent<HTMLInputElement>
   */
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);
    latestQuery.current = value;

    if (value.trim().length < 1) {
      setSuggestions([]);
      setNotFound(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/name/${encodeURIComponent(value)}?fullText=true`
      );
      // fullText=true expects exact matches, API returns 404 if none found
      if (!res.ok) throw new Error();
      const data = await res.json();

      // Update suggestions only if response matches the latest query to avoid race conditions
      if (latestQuery.current === value) {
        setSuggestions(data.slice(0, 5)); // Limit suggestions to top 5
        setNotFound(data.length === 0);
      }
    } catch {
      // Show error only if this corresponds to latest input
      if (latestQuery.current === value) {
        setSuggestions([]);
        setNotFound(true);
      }
    }
  };

  /**
   * Handles selection of a suggestion by name.
   * Updates query input, clears suggestions, and navigates to the country detail page.
   *
   * @param name string - country name selected
   */
  const handleSelect = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    router.push(`/country/${encodeURIComponent(name)}`);
  };

  /**
   * Handles keyboard navigation within suggestions.
   * ArrowDown/ArrowUp changes activeIndex cyclically.
   * Enter triggers selection of active suggestion.
   *
   * @param e React.KeyboardEvent<HTMLInputElement>
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex].name.common);
      e.preventDefault();
    }
  };

  /**
   * Handles click on the search icon.
   * If suggestions exist, selects the first suggestion.
   * Otherwise, uses the input query with title casing as fallback.
   */
  const handleIconClick = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].name.common);
    } else if (query.trim().length > 0) {
      handleSelect(toTitleCase(query.trim()));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-[696px]">
        <input
          className="peer w-full h-[56px] border border-[#C8C8C8] rounded-[8px] px-4 pr-10 text-[18px] font-medium bg-white focus:outline-none focus:border-[#8362F2] placeholder:text-[#B9B9B9] shadow-none transition"
          type="text"
          placeholder="Type any country name"
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button
          type="button"
          aria-label="Search"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#C8C8C8] peer-focus:text-[#8362F2] hover:text-[#8362F2] transition-colors"
          tabIndex={-1}
          onClick={handleIconClick}
        >
          <Search size={20} />
        </button>

        {/* Render suggestion list if available */}
        {suggestions.length > 0 && (
          <SuggestionList
            suggestions={suggestions}
            onSelect={handleSelect}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}
        {/* Render error state if no matching country found */}
        {notFound && <InvalidState />}
      </div>
    </div>
  );
}
