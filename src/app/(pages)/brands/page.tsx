"use client"
import { useEffect, useState, useCallback } from "react";
import { getBrandsAction } from "@/actions/getBrands.action";
import { getSpecificBrandAction } from "@/actions/getSpecificBrand.action";
import { Brand } from "@/interfaces/cartinterfaces";
import Image from "next/image";
import { Loader2, X, Globe, Award } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const data = await getBrandsAction();
        if (data.status === "success" || data.data) {
          setBrands(data.data || []);
        }
      } catch (error) {
        toast.error("Failed to load brands");
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const handleBrandClick = useCallback(async (brandId: string) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const data = await getSpecificBrandAction(brandId);
      if (data.status === "success" || data.data) {
        setSelectedBrand(data.data);
      }
    } catch (error) {
      toast.error("Failed to load brand details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 animate-spin text-primary" />
        <p className="text-gray-500 font-medium tracking-wide">Loading our partner brands...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Our Premium Brands</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          We partner with the world&apos;s leading brands to bring you the highest quality products.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <div
            key={brand._id}
            onClick={() => handleBrandClick(brand._id)}
            className="group bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1"
          >
            <div className="relative h-24 w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-700 group-hover:text-primary transition-colors">{brand.name}</h3>
          </div>
        ))}
      </div>

      {/* Brand Details Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-40 bg-linear-to-r from-primary/10 to-primary/5 p-6 flex items-center justify-center">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white transition-colors shadow-sm"
              >
                <X className="size-5" />
              </button>
              
              {modalLoading ? (
                 <Loader2 className="size-10 animate-spin text-primary" />
              ) : (
                <div className="relative h-24 w-48">
                  <Image
                    src={selectedBrand?.image || ""}
                    alt={selectedBrand?.name || ""}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            <div className="p-8">
              {modalLoading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
                  <div className="h-20 bg-gray-100 rounded-lg w-full animate-pulse" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedBrand?.name}</h2>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">Official Partner</span>
                  </div>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Explore the latest collections and premium products from {selectedBrand?.name}. 
                    Quality and innovation at its best.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                      <Globe className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">Region</p>
                        <p className="font-bold text-sm">International</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                      <Award className="size-5 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">Trust</p>
                        <p className="font-bold text-sm">Top Rated</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 py-6 rounded-xl font-bold">View Products</Button>
                    <Button variant="outline" className="flex-1 py-6 rounded-xl font-bold" onClick={() => setIsModalOpen(false)}>Close</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
