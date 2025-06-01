import Image from "next/image";
import Link from "next/link";
const NavbarLogin = () => {  
    return (    
        <nav className="bg-white p-4 shadow-sm">
            <div className="container mx-auto flex items-center justify-start h-16 px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="flex items-center">
                        <Image
                            src="/logo-text.svg"
                            alt="bubblify-logo"
                            width={100}
                            height={40}
                            className="h-7 sm:h-8 md:h-15 w-auto"
                        />
                    </div>
                </Link>
            </div>
        </nav>
    );
};
export default NavbarLogin;