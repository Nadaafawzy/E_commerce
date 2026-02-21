"use client"
import { useEffect, useState, useCallback } from "react";
import { getCategoriesAction } from "@/actions/getCategories.action";
import { getSubcategoriesAction } from "@/actions/getSubcategories.action";
import { Category, Subcategory } from "@/interfaces/cartinterfaces";
import Image from "next/image";
import { Loader2, Layers, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategoriesAction();
        if (data.status === "success" || data.data) {
          setCategories(data.data || []);
        }
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = useCallback(async (category: Category) => {
    setSelectedCategory(category);
    setSubLoading(true);
    setSubcategories([]); // Clear previous subcategories
    try {
      const data = await getSubcategoriesAction(category._id);
      if (data.status === "success" || data.data) {
        setSubcategories(data.data || []);
        // Scroll to subcategories section
        setTimeout(() => {
          document.getElementById('subcategories-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      toast.error("Failed to load subcategories");
    } finally {
      setSubLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-gray-500 font-medium">Curating categories for you...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Shop by Category</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Explore our wide range of products organized into curated categories for a better shopping experience.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${
              selectedCategory?._id === category._id 
              ? "border-primary ring-4 ring-primary/10" 
              : "border-gray-100 hover:border-primary/50 hover:shadow-xl"
            }`}
          >
            <div className="relative h-64 w-full overflow-hidden bg-gray-50">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
            </div>
            <div className="p-6 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Explore Subcategories</p>
              </div>
              <div className={`p-2 rounded-full transition-colors ${
                selectedCategory?._id === category._id ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"
              }`}>
                <ChevronRight className="size-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subcategories Section */}
      {selectedCategory && (
        <div id="subcategories-section" className="pt-16 border-t animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Layers className="size-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{selectedCategory.name} Subcategories</h2>
              <p className="text-gray-500">Fine-tune your choice within the {selectedCategory.name} category.</p>
            </div>
          </div>

          {subLoading ? (
            <div className="flex flex-col items-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Loader2 className="size-10 animate-spin text-primary mb-4" />
              <p className="text-gray-400">Loading subcategories...</p>
            </div>
          ) : subcategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {subcategories.map((sub) => (
                <div 
                  key={sub._id} 
                  className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-center group cursor-pointer"
                >
                  <span className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{sub.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg font-medium">No subcategories found for {selectedCategory.name}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
