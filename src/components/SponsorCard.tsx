"use client";

import React from "react";
import { ExternalLink, Heart, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SponsorCardProps {
  sponsor: {
    id: string;
    name: string;
    logo?: string;
    description: string;
    type: "mission-aligned" | "lifestyle" | "community";
    location?: string;
    website?: string;
    specialOffer?: string;
    contextMessage?: string;
  };
  context?: "achievement" | "wisdom" | "community" | "journey";
  onInteraction?: (sponsorId: string, action: string) => void;
}

export default function SponsorCard({ 
  sponsor, 
  context = "wisdom",
  onInteraction = () => {}
}: SponsorCardProps) {
  const getContextMessage = () => {
    if (sponsor.contextMessage) return sponsor.contextMessage;
    
    switch (context) {
      case "achievement":
        return `${sponsor.name} celebrates your achievement!`;
      case "wisdom":
        return `This wisdom is supported by ${sponsor.name}`;
      case "community":
        return `Join the community with ${sponsor.name}`;
      case "journey":
        return `Continue your journey with ${sponsor.name}`;
      default:
        return `Discover more with ${sponsor.name}`;
    }
  };

  const getIconByType = () => {
    switch (sponsor.type) {
      case "mission-aligned":
        return <Heart className="h-4 w-4" />;
      case "lifestyle":
        return <Star className="h-4 w-4" />;
      case "community":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const handleClick = () => {
    onInteraction(sponsor.id, 'click');
    if (sponsor.website) {
      window.open(sponsor.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="sponsor-card p-4 mb-6 relative">
      <div className="sponsor-badge">
        Sponsored
      </div>
      
      <div className="flex items-start gap-4">
        {sponsor.logo && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
            <img 
              src={sponsor.logo} 
              alt={`${sponsor.name} logo`}
              className="w-8 h-8 object-contain"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getIconByType()}
            <h3 className="text-frosted-strong text-lg font-semibold">
              {sponsor.name}
            </h3>
            {sponsor.location && (
              <span className="text-frosted-light text-sm">
                • {sponsor.location}
              </span>
            )}
          </div>
          
          <p className="text-frosted text-sm mb-3 leading-relaxed">
            {getContextMessage()}
          </p>
          
          <p className="text-frosted-light text-sm mb-3">
            {sponsor.description}
          </p>
          
          {sponsor.specialOffer && (
            <div className="bg-gradient-to-r from-pastel-mint to-pastel-blue bg-opacity-30 rounded-lg p-3 mb-3">
              <p className="text-frosted-strong text-sm font-medium">
                Special Offer: {sponsor.specialOffer}
              </p>
            </div>
          )}
          
          <Button
            onClick={handleClick}
            className="frosted-button hover:frosted-button:hover text-sm px-4 py-2 h-auto"
            size="sm"
          >
            Learn More
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
