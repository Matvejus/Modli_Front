"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"

export default function DynamicTomorrowImage() {
  const pathname = usePathname()

  // Define the heights for different pages
  let topPosition = "810px" // Default height

  // Adjust height based on the current path
  if (pathname === "/gowns/" || /^\/gowns\/[1-6]$/.test(pathname) || /^\/gowns\/1[0-9]$/.test(pathname)) {
    topPosition = "695px"
  } else if (pathname === "/gowns/7") {
    topPosition = "420px"
  } else if (pathname === "/") {
    topPosition = "810px"
  }

  return (
    <Image
      alt="Modli tomorrow"
      src="/media/tomorrow.png"
      className="absolute right-40"
      style={{ top: topPosition }}
      width={200}
      height={200}
    />
  )
}
