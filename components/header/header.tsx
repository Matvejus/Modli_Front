import Image from "next/image";
import Link from "next/link";
import Navigation from "../navigation/navigation";



 export default function Header(){
    return (
        <header>
            <div className="container flex h-14 items-center justify-between"> 
                <Image
                    alt="Modli logo"
                    src="/media/logo.png"
                    className="top-6 left-5"
                    width={200}
                    height={100}
                />
                <Navigation/>
            </div>
        </header>
        
    );
};
  














