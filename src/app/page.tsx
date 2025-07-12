import CountrySearchBox from "@/components/country-search/CountrySearchBox";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA]">
      <h1 className="country-title">Country</h1>
      <CountrySearchBox />
    </main>
  );
}
