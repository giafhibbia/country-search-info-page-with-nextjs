import CountrySearchBox from "@/components/country-search/CountrySearchBox";

/**
 * Home component serves as the landing page for the application.
 * It provides a centered layout with a title and the CountrySearchBox component,
 * enabling users to search for countries.
 *
 * Styling:
 * - Full viewport height with light gray background.
 * - Flexbox centering vertically and horizontally.
 * - Responsive max width container for content.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Country</h1>

        {/* Search Box Component */}
        <CountrySearchBox />
      </div>
    </main>
  );
}
