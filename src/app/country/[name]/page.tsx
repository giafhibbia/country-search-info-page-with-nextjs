import React from "react";
import BackButton from "@/components/BackButton";
import globeVector from "../../../../public/globe-vector.png";
import InteractiveLink from "@/components/InteractiveLink";
import Image from "next/image";

/**
 * Type definition representing detailed country data fetched from REST Countries API v3.1
 */
type CountryDetail = {
  name: { common: string };
  flags: { png: string; svg: string };
  capital?: string[];
  region: string;
  subregion?: string;
  latlng: [number, number];
  idd: { root: string; suffixes?: string[] };
  currencies: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  altSpellings?: string[];  // Alternative country names or spellings
};

/**
 * Simplified type representing basic country info used in auxiliary API calls
 */
type SimpleCountry = {
  name: string;
  alpha2Code: string;
};

/**
 * Props interface describing expected parameters passed from Next.js dynamic route
 */
interface Props {
  params: Promise<{ name: string }>;
}

/**
 * Fetch detailed country data based on exact name match (fullText=true)
 * Uses Next.js ISR with revalidation set to 60 seconds for caching
 *
 * @param name - Exact country name to query
 * @returns A Promise resolving to country details or null if not found or fetch fails
 */
async function fetchCountryDetail(name: string): Promise<CountryDetail | null> {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data[0];
  } catch {
    return null;
  }
}

/**
 * Fetch countries sharing the same calling code
 *
 * @param callingCode - Telephone calling code without the '+' prefix
 * @returns A Promise resolving to an array of simplified country data
 */
async function fetchCountriesByCallingCode(
  callingCode: string
): Promise<SimpleCountry[]> {
  try {
    const res = await fetch(`https://restcountries.com/v2/callingcode/${callingCode}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch countries sharing the same currency
 *
 * @param currencyCode - ISO currency code (e.g., 'USD')
 * @returns A Promise resolving to an array of simplified country data
 */
async function fetchCountriesByCurrency(currencyCode: string): Promise<SimpleCountry[]> {
  try {
    const res = await fetch(`https://restcountries.com/v2/currency/${currencyCode}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Main async React Server Component rendering detailed country information.
 * Fetches country details based on the dynamic route parameter and displays:
 * - Country name and flag
 * - Alternative spellings
 * - Latitude and longitude with an illustrative globe icon
 * - Capital, region, and subregion information
 * - Calling code with interactive link listing countries sharing the same code
 * - Currency information with interactive link listing countries sharing the same currency
 *
 * @param params - Route parameters object containing the country name
 * @returns JSX Element rendering the detailed country page or a not found message
 */
export default async function CountryDetailPageAsync({ params }: Props) {
  const { name } = await params;  // Await params because this is an async server component

  // Fetch detailed country data
  const country = await fetchCountryDetail(name);

  if (!country) {
    // Render error message if country not found or fetch failed
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Country not found: {name}
      </div>
    );
  }

  // Compose calling code string from root and suffix
  const callingCode = country.idd.root + (country.idd.suffixes?.[0] ?? "");
  // Extract the first currency key (e.g., 'USD')
  const currencyKey = Object.keys(country.currencies)[0];

  // Fetch related countries with the same calling code and currency
  const countriesWithSameCallingCode = await fetchCountriesByCallingCode(
    callingCode.replace("+", "")
  );
  const countriesWithSameCurrency = await fetchCountriesByCurrency(currencyKey);

  // Extract country names for tooltip display in InteractiveLink
  const countryNamesCallingCode = countriesWithSameCallingCode.map(c => c.name);

  return (
    <main className="max-w-6xl mx-auto p-8 mt-8 bg-white">
      <BackButton />

      <h1 className="text-5xl font-extrabold mb-6 flex items-center gap-6">
        {country.name.common}
        <div className="relative w-14 h-9 rounded-sm overflow-hidden">
          <Image
            src={country.flags.svg}
            alt={`${country.name.common} flag`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </h1>

      {/* Alternative spellings / country name variants */}
      <div className="flex flex-wrap gap-3 mb-8">
        {country.altSpellings?.map((alt, idx) => (
          <span
            key={idx}
            className="bg-teal-200 text-teal-900 rounded-full px-3 py-1 text-sm font-bold"
          >
            {alt}
          </span>
        ))}
      </div>

      {/* Grid layout for LatLng and capital/region info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 mx-auto">
        {/* Latitude and Longitude with globe illustration */}
        <div className="relative bg-white rounded-lg shadow p-6 min-h-[150px] flex items-center justify-between w-full">
          <div>
            <p className="text-black font-bold text-xl mb-2">LatLong</p>
            <p className="text-3xl font-bold text-[#8362F2]">
              {country.latlng[0]}, {country.latlng[1]}
            </p>
          </div>
          <div className="absolute right-0 bottom-0">
            <Image src={globeVector} alt="Globe vector" width={204} height={120} />
          </div>
        </div>

        {/* Capital, Region, and Subregion information */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-center min-h-[150px] w-full">
          <p className="mb-3">
            <span>Capital:</span>{" "}
            <span className="font-bold">{country.capital?.join(", ") || "N/A"}</span>
          </p>
          <p className="mb-3">
            <span>Region:</span> <span className="font-bold">{country.region}</span>
          </p>
          <p>
            <span>Subregion:</span>{" "}
            <span className="font-bold">{country.subregion || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Grid layout for Calling Code and Currency info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calling Code box with interactive tooltip link */}
        <div className="bg-white rounded-lg p-6 min-h-[110px]">
          <p className="text-black font-bold text-xl mb-2">Calling Code</p>
          <p className="text-4xl font-extrabold text-[#8362F2] mb-3">{callingCode}</p>
          <InteractiveLink countries={countryNamesCallingCode}>
            {countriesWithSameCallingCode.length} country
            {countriesWithSameCallingCode.length > 1 ? "ies" : ""}
          </InteractiveLink>
          &nbsp;With this calling code
        </div>

        {/* Currency box with interactive tooltip link */}
        <div className="bg-white rounded-lg p-6 min-h-[110px]">
          <p className="text-black font-bold text-xl mb-2">Currency</p>
          <p className="text-4xl font-extrabold text-[#8362F2] mb-3">{currencyKey}</p>
          <InteractiveLink countries={countriesWithSameCurrency.map(c => c.name)}>
            {countriesWithSameCurrency.length} country
            {countriesWithSameCurrency.length > 1 ? "ies" : ""}
          </InteractiveLink>
          &nbsp;With this currency
        </div>
      </div>
    </main>
  );
}