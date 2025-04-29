import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from "next/image";
import './globals.css'
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MODLI',
  description: 'Procurement decision tool',
}

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Image
              alt="Modli doctors"
              src="/media/Modli_doctors.png"
              className="fixed top-0 right-0"
              width={800}
              height={100}
            />
            <Image
              alt="Modli green Arrow"
              src="/media/Modli_green_arrow.png"
              className="absolute top-40"
              width={100}
              height={100}
            />
            {/* <Image
              alt="Modli white Arrow"
              src="/media/Modli_white_arrow.png"
              className="absolute right-0 top-[480px]"
              width={100}
              height={100}
            /> */}
            <Image
              alt="Modli orange Arrow"
              src="/media/Modli_orange_arrow.png"
              className="absolute right-0 top-6"
              width={100}
              height={100}
            />
            <Image
              alt="Modli waves"
              src="/media/waves.png"
              className="absolute left-1/2 transform -translate-x-1/2 top-[380px] w-[950px] h-[250px] z-0"
              width={300}
              height={200}
            />
            <Image
              alt="Modli tomorrow"
              src="/media/tomorrow.png"
              className="absolute top-[550px] right-40"
              width={200}
              height={200}
            />
          <main className="bg-background-modli flex-1 overflow-y-auto p-8">
            <Header/>
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  )
}



