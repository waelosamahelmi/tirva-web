import { useRestaurant } from "@/lib/restaurant-context";
import * as LucideIcons from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "full" | "icon" | "text";
}

export function Logo({ 
  className = "", 
  size = "md", 
  showText = true,
  variant = "full" 
}: LogoProps) {
  const { config } = useRestaurant();
  
  // Size configurations
  const sizeConfig = {
    sm: { icon: "w-8 h-8", text: "text-lg", container: "space-x-2" },
    md: { icon: "w-10 h-10", text: "text-xl", container: "space-x-3" },
    lg: { icon: "w-14 h-14", text: "text-2xl", container: "space-x-3" },
    xl: { icon: "w-20 h-20", text: "text-4xl", container: "space-x-4" },
  };
  
  const sizes = sizeConfig[size];
  const restaurantName = config?.name || "Tirvan Kahvila";
  
  // Get primary color from theme config, fallback to green
  const primaryColor = config?.theme?.primary || "#16A34A";
  const primaryColorLight = adjustColor(primaryColor, 20);
  const primaryColorDark = adjustColor(primaryColor, -20);
  
  // Get the configured icon or default to Coffee
  const iconName = config?.logo?.icon || "Coffee";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Coffee;
  
  // Dynamic SVG Logo using theme colors and configured icon
  const DynamicLogo = ({ iconClassName }: { iconClassName: string }) => (
    <div className={`relative ${iconClassName} flex-shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
        {/* Gradient definitions using dynamic colors */}
        <defs>
          <linearGradient id="logoGradientDynamic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColorLight} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColorDark} />
          </linearGradient>
          <linearGradient id="cupGradientDynamic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F5F5F5" />
          </linearGradient>
          <linearGradient id="coffeeGradientDynamic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>
        
        {/* Main circle background with theme color */}
        <circle cx="50" cy="50" r="48" fill="url(#logoGradientDynamic)" />
        
        {/* Inner highlight ring */}
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        
        {/* Coffee cup - modern design */}
        <g transform="translate(50, 52)">
          {/* Cup body */}
          <path 
            d="M-18 -8 L-16 22 C-16 26 -10 30 0 30 C10 30 16 26 16 22 L18 -8 Z" 
            fill="url(#cupGradientDynamic)"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.5"
          />
          
          {/* Cup rim highlight */}
          <ellipse cx="0" cy="-8" rx="18" ry="5" fill="#FFFFFF" />
          <ellipse cx="0" cy="-8" rx="16" ry="4" fill="url(#coffeeGradientDynamic)" />
          
          {/* Cup handle */}
          <path 
            d="M18 -2 Q30 -2 30 10 Q30 20 18 20" 
            fill="none" 
            stroke="url(#cupGradientDynamic)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path 
            d="M18 1 Q26 1 26 10 Q26 17 18 17" 
            fill="none" 
            stroke="url(#logoGradientDynamic)"
            strokeWidth="2"
          />
        </g>
        
        {/* Steam - animated feel */}
        <g opacity="0.9">
          <path 
            d="M38 28 Q35 22 38 16 Q41 10 38 4" 
            fill="none" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
          <path 
            d="M50 24 Q47 18 50 12 Q53 6 50 0" 
            fill="none" 
            stroke="rgba(255,255,255,0.9)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <path 
            d="M62 28 Q59 22 62 16 Q65 10 62 4" 
            fill="none" 
            stroke="rgba(255,255,255,0.8)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );

  // Simple icon-based logo (uses Lucide icons from config)
  const SimpleIconLogo = ({ iconClassName }: { iconClassName: string }) => (
    <div 
      className={`${iconClassName} flex-shrink-0 rounded-full flex items-center justify-center`}
      style={{ backgroundColor: primaryColor }}
    >
      <IconComponent className="w-[60%] h-[60%] text-white" />
    </div>
  );
  
  // Determine which logo style to use
  const LogoIcon = config?.logo?.imageUrl ? null : 
    (iconName === "Coffee" ? DynamicLogo : SimpleIconLogo);
  
  // Split restaurant name for styling (first word in primary color)
  const nameParts = restaurantName.split(' ');
  const firstName = nameParts[0] || '';
  const restOfName = nameParts.slice(1).join(' ');
  
  // Return early if config is not loaded yet
  if (!config) {
    return (
      <div className={`flex items-center ${sizes.container} ${className}`}>
        <DynamicLogo iconClassName={sizes.icon} />
        {showText && variant !== "icon" && (
          <span className={`font-bold text-gray-900 dark:text-white whitespace-nowrap ${sizes.text}`}>
            {restaurantName}
          </span>
        )}
      </div>
    );
  }

  // Render based on variant
  if (variant === "icon") {
    return (
      <div className={className}>
        {config.logo?.imageUrl ? (
          <img 
            src={config.logo.imageUrl} 
            alt={restaurantName} 
            className={`${sizes.icon} object-contain`}
          />
        ) : LogoIcon ? (
          <LogoIcon iconClassName={sizes.icon} />
        ) : (
          <DynamicLogo iconClassName={sizes.icon} />
        )}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <span className={`font-bold text-gray-900 dark:text-white whitespace-nowrap ${sizes.text} ${className}`}>
        {restaurantName}
      </span>
    );
  }

  return (
    <div className={`flex items-center ${sizes.container} ${className}`}>
      {config.logo?.imageUrl ? (
        <img 
          src={config.logo.imageUrl} 
          alt={restaurantName} 
          className="h-10 w-auto object-contain flex-shrink-0"
        />
      ) : (
        <>
          {LogoIcon ? (
            <LogoIcon iconClassName={sizes.icon} />
          ) : (
            <DynamicLogo iconClassName={sizes.icon} />
          )}
          {(showText || config.logo?.showText) && (
            <span className={`font-bold text-gray-900 dark:text-white whitespace-nowrap ${sizes.text}`}>
              <span style={{ color: primaryColor }}>{firstName}</span>
              {restOfName && <span className="ml-1">{restOfName}</span>}
            </span>
          )}
        </>
      )}
    </div>
  );
}

// Helper function to lighten or darken a color
function adjustColor(color: string, percent: number): string {
  // Handle HSL format
  if (color.startsWith('hsl')) {
    const match = color.match(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
    if (match) {
      const h = parseInt(match[1]);
      const s = parseFloat(match[2]);
      const l = Math.min(100, Math.max(0, parseFloat(match[3]) + percent));
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  
  // Handle hex format
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const num = parseInt(hex, 16);
  let r = (num >> 16) + percent * 2.55;
  let g = ((num >> 8) & 0x00FF) + percent * 2.55;
  let b = (num & 0x0000FF) + percent * 2.55;
  
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  return `#${(0x1000000 + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
}