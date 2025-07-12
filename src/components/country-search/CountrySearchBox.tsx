"use client";
import React, { useState } from "react";
import SuggestionList from "./SuggestionList";
import InvalidState from "./InvalidState";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export type Country = {
  name: { common: string };
  cca2: string;
};

export default function CountrySearchBox() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.trim().length < 1) {
      setSuggestions([]);
      setNotFound(false);
      return;
    }

    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${value}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
      setNotFound(false);
    } catch {
      setSuggestions([]);
      setNotFound(true);
    }
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setSuggestions([]);
    router.push(`/country/${encodeURIComponent(name)}`);
  };

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
  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#C8C8C8] peer-focus:text-[#8362F2] pointer-events-none">
    <Search size={20} />
  </span>

        {/* Suggestion dan Error */}
        {suggestions.length > 0 && (
          <SuggestionList
            suggestions={suggestions}
            onSelect={handleSelect}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        )}
        {notFound && <InvalidState />}
      </div>
    </div>
  );
}
