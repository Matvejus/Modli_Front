"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Home} from "lucide-react"

export default function Navigation() {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    if (isHomePage) return null;

    return (
        <div className="container flex items-center">
          <div className="mr-6 hidden md:flex">
            <nav className="mt-6 flex items-left space-x-4 text-sm font-medium text-white">
              <Link href="/" className="transition-colors hover:text-foreground/80">
                <Home/>
              </Link>
            </nav>
          </div>
        </div>
    );
};