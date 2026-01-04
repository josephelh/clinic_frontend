import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import nprogress from "nprogress";
import "nprogress/nprogress.css";

// Inject custom Moroccan Brand colors into NProgress
const GlobalStyle = `
  #nprogress .bar {
    background: #422afb !important; 
    height: 3px !important;
  }
  #nprogress .spinner-icon {
    border-top-color: #422afb !important;
    border-left-color: #422afb !important;
  }
`;

const RouteProgress = () => {
  const location = useLocation();

  useEffect(() => {
    // Inject style once
    if (!document.getElementById("nprogress-style")) {
      const style = document.createElement("style");
      style.id = "nprogress-style";
      style.innerHTML = GlobalStyle;
      document.head.appendChild(style);
    }

    nprogress.start();
    
    // Finish progress after a tiny delay to simulate smoothness
    const timer = setTimeout(() => {
      nprogress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      nprogress.done();
    };
  }, [location]);

  return null;
};

export default RouteProgress;