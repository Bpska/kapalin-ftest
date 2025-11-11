import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4 text-sage-brown">404</h1>
        <p className="text-xl text-muted-foreground mb-6">This wisdom tale seems to be missing</p>
        <a 
          href="/" 
          className="inline-block bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg shadow-soft hover:opacity-90 transition-all duration-300 hover:scale-105"
        >
          Return to Stories
        </a>
      </div>
    </div>
  );
};

export default NotFound;
