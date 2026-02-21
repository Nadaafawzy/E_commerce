export default function Loading() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="h-12 w-12 rounded-full border-2 border-zinc-100" />
        {/* Inner spinning segment */}
        <div className="absolute top-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-black" />
      </div>
      <p className="animate-pulse text-sm font-medium tracking-widest text-zinc-500 uppercase">
        ShopMark
      </p>
    </div>
  );
}
