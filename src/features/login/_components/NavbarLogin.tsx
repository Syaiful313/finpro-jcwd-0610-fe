import Image from "next/image";
import Link from "next/link";
const NavbarLogin = () => {  
    return (    
        <nav className="bg-white p-4 shadow-sm">       
            <div className="container mx-auto flex items-center justify-start h-16">         
                <Link href="/" className="flex items-center space-x-2">          
                    <div className="flex items-center">            
                        <Image src="/logo-text.svg" alt="bubblify-logo" height={100} width={100} className="h-8 w-auto lg:h-15"/>          
                    </div>        
                </Link>      
            </div>    
        </nav>  
    );
};
export default NavbarLogin;