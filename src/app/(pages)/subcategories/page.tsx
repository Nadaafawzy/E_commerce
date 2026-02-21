"use client"
import { useEffect, useState } from "react";
import { getAllSubcategoriesAction } from "@/actions/getAllSubcategories.action";
import { Subcategory } from "@/interfaces/cartinterfaces";
import { Loader2, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchSubcategories() {
      try {
        const data = await getAllSubcategoriesAction();
        if (data.status === "success" || data.data) {
          const list = data.data || [];
          setSubcategories(list);
          setFilteredSubcategories(list);
        }
      } catch (error) {
        toast.error("Failed to load subcategories");
      } finally {
        setLoading(false);
      }
    }
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredSubcategories(
      subcategories.filter((sub) => sub.name.toLowerCase().includes(query))
    );
  }, [searchQuery, subcategories]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-gray-500 font-medium">Loading all subcategories...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">All Subcategories</h1>
          <p className="text-gray-500 text-lg">
            Browse through our extensive list of sub-levels to find exactly what you're looking for.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <Input
            placeholder="Search subcategories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-gray-200 focus:border-primary focus:ring-primary h-12"
          />
        </div>
      </div>

      {filteredSubcategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredSubcategories.map((sub) => (
            <div 
              key={sub._id} 
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-center cursor-pointer flex flex-col items-center justify-center h-32"
            >
              <span className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                {sub.name}
              </span>
              <div className="mt-2 w-0 group-hover:w-12 h-1 bg-primary rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Filter className="size-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-xl font-medium">No subcategories match your search.</p>
          <button 
            onClick={() => setSearchQuery("")} 
            className="text-primary font-bold mt-2 hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
