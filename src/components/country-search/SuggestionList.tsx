import React from "react";
import SuggestionItem from "./SuggestionItem";
import { Country } from "./CountrySearchBox";

type Props = {
  suggestions: Country[];
  onSelect: (name: string) => void;
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
};

export default function SuggestionList({ suggestions, onSelect, activeIndex, setActiveIndex }: Props) {
  return (
    <ul className="absolute z-10 bg-white border border-[#8362F280] mt-2 w-full shadow rounded-[8px]">
      {suggestions.map((country, idx) => (
        <SuggestionItem
          key={country.cca2}
          name={country.name.common}
          onSelect={onSelect}
          isActive={activeIndex === idx}
          onMouseEnter={() => setActiveIndex(idx)}
        />
      ))}
    </ul>
  );
}
