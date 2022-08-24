interface LayoutGridProps {
  children: React.ReactNode;
}

export default function LayoutGrid({ children }: LayoutGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
