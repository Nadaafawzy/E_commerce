import Hero from "@/components/Home/Hero";
import CategorySection from "@/components/Home/CategorySection";
import ProductSection from "@/components/Home/ProductSection";

export default function Home() {
  return (
    <main className="flex flex-col gap-8">
      <Hero />
      <CategorySection />
      <ProductSection />
    </main>
  );
}
