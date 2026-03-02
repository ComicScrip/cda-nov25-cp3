import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4">
        {/* Main header with title */}
        <div className="py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors"
          >
            Dev Blog
          </Link>
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
