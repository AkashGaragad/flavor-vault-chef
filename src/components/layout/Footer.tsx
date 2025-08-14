import { Link } from "react-router-dom";
import { ChefHat, Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md flex items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elegant">
            <ChefHat className="h-5 w-5" />
          </div>
          <span className="font-semibold">My Recipes</span>
        </Link>
  <div className=" py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} My Recipes. All rights reserved.
      </div>
       
  
        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Bottom text */}
    
    </footer>
  );
};

export default Footer;
