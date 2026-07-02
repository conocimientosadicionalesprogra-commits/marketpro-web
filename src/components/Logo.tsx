import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src={`${import.meta.env.BASE_URL}MarketPro.png`} alt="MarketPro Logo" className="h-10 w-auto" 
      />
    </div>
  );
};

export default Logo;