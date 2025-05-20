import Image from "next/image";
import Link from "next/link";
import Navigation from "../navigation/navigation";



 export default function Header(){
    return (
        <header>
            <div className="container flex h-14 items-center justify-between"> 
            <Link href="/">
                <Image
                    alt="Modli logo"
                    src="/media/AUAS.png"
                    className="top-6 ml-8"
                    width={400}
                    height={100}
                />
            </Link>
                <Navigation/>
            </div>

        </header>
        
    );
};
  














