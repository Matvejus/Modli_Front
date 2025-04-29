import Link from "next/link";

export default function Navigation(){
    return (
        <div className="container flex items-center">
          <div className="mr-6 hidden md:flex">
            <nav className="mt-6 px-6 flex items-left space-x-4 text-sm font-medium text-white">
              <Link href="/" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="/gowns" className="transition-colors hover:text-foreground/80">
                Gown Comparison
              </Link>
            </nav>
          </div>
        </div>
    );
};