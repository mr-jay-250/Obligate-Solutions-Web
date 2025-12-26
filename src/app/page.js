import EpicHero from "../components/EpicHero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <EpicHero />

      {/* Placeholder for other sections */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            More sections coming soon...
          </h2>
        </div>
      </section>
    </div>
  );
}
