import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, MapPin, BookOpen, Users, Star, ChevronRight, Crown, Gem } from 'lucide-react';

export type SponsorTier = 'platinum' | 'gold' | 'silver' | 'community';
export type SponsorType = 'global' | 'local';
export type IntegrationType = 'suggestion' | 'resource' | 'achievement' | 'directory' | 'educational' | 'community';
export type ContextType = 'homepage' | 'journal' | 'cards' | 'games' | 'profile' | 'chat' | 'prayer_times';

export interface SponsorResource {
  id: string;
  title: string;
  description: string;
  resourceType: 'course' | 'book' | 'video' | 'article' | 'app' | 'event';
  url: string;
  thumbnailUrl?: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedDurationMinutes?: number;
  topics: string[];
  freeAccess: boolean;
  userRating: number;
  ratingCount: number;
}

export interface SponsorData {
  id: string;
  name: string;
  slug: string;
  type: SponsorType;
  tier: SponsorTier;
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
  categories: string[];
  tags: string[];
  verified: boolean;
  islamicAuthenticityScore: number;
  communityReputationScore: number;
  halalCertified: boolean;
  resources?: SponsorResource[];
  location?: {
    displayName: string;
    address?: string;
    distance?: number; // in km
  };
}

export interface NativeSponsorProps {
  context: ContextType;
  integrationType?: IntegrationType;
  userLocation?: {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
  };
  maxSponsors?: number;
  className?: string;
  onSponsorInteraction?: (sponsorId: string, action: string) => void;
}

interface SponsorSuggestionProps extends SponsorData {
  context: ContextType;
  integrationType: IntegrationType;
  messageTemplate?: string;
  callToAction?: string;
  onInteraction?: (action: string) => void;
}

// Helper function to get tier styling
const getTierStyling = (tier: SponsorTier) => {
  const styles = {
    platinum: {
      border: 'border-gradient-to-r from-purple-400 to-pink-400',
      badge: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-300/30 dark:text-purple-300 dark:border-purple-400/20',
      badgeText: '✨ Platinum Partner',
      glow: 'shadow-purple-500/20 shadow-lg'
    },
    gold: {
      border: 'border-gradient-to-r from-yellow-400 to-orange-400', 
      badge: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border-yellow-300/30 dark:text-yellow-300 dark:border-yellow-400/20',
      badgeText: '🥇 Gold Partner',
      glow: 'shadow-yellow-500/20 shadow-md'
    },
    silver: {
      border: 'border-gradient-to-r from-gray-300 to-gray-400',
      badge: 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-700 border-gray-300/30 dark:text-gray-300 dark:border-gray-400/20',
      badgeText: '🥈 Silver Partner',
      glow: 'shadow-gray-500/10 shadow-sm'
    },
    community: {
      border: 'border-pastel-mint/30',
      badge: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border-emerald-300/30 dark:text-emerald-300 dark:border-emerald-400/20',
      badgeText: '🤝 Community Partner',
      glow: ''
    }
  };
  return styles[tier];
};

// Helper function to get context-specific styling and layout
const getContextualStyling = (context: ContextType, integrationType: IntegrationType) => {
  const styles = {
    // Chat/Homepage - Conversation bubble style
    homepage: {
      container: 'max-w-md mx-auto mb-4',
      card: 'frosted-glass rounded-2xl p-4 border-white/10',
      layout: 'flex items-start gap-3',
      content: 'flex-1',
      showAvatar: true,
      compact: true
    },
    chat: {
      container: 'max-w-sm ml-12 mb-3',
      card: 'frosted-glass rounded-2xl rounded-tl-sm p-3 border-white/10 bg-white/5',
      layout: 'space-y-2',
      content: 'space-y-2',
      showAvatar: false,
      compact: true
    },
    
    // Cards - Card-like presentation
    cards: {
      container: 'w-full',
      card: 'frosted-glass rounded-3xl p-6 border-white/10 hover:scale-[1.02] transition-all duration-300',
      layout: 'space-y-4',
      content: 'space-y-3',
      showAvatar: true,
      compact: false
    },
    
    // Journal - Inline suggestion style
    journal: {
      container: 'w-full',
      card: 'frosted-glass rounded-2xl p-4 border-l-4 border-pastel-purple bg-gradient-to-r from-pastel-purple/5 to-transparent',
      layout: 'flex items-center gap-4',
      content: 'flex-1',
      showAvatar: true,
      compact: true
    },
    
    // Games - Achievement/badge style
    games: {
      container: 'w-full',
      card: 'frosted-glass rounded-2xl p-4 border-white/10 bg-gradient-to-r from-pastel-gold/10 to-pastel-orange/10',
      layout: 'flex items-center gap-4',
      content: 'flex-1',
      showAvatar: true,
      compact: true
    },
    
    // Profile - Community/social style
    profile: {
      container: 'w-full',
      card: 'frosted-glass rounded-3xl p-5 border-white/10 bg-gradient-to-br from-pastel-mint/5 to-pastel-blue/5',
      layout: 'space-y-4',
      content: 'space-y-3',
      showAvatar: true,
      compact: false
    },
    
    // Prayer times - Minimal inline style
    prayer_times: {
      container: 'w-full',
      card: 'frosted-glass rounded-xl p-3 border-white/10 bg-white/5',
      layout: 'flex items-center gap-3',
      content: 'flex-1',
      showAvatar: false,
      compact: true
    }
  };
  
  return styles[context] || styles.homepage;
};

// Helper for elegant sponsor tier badge props
function getTierBadgeProps(tier: SponsorTier) {
  switch (tier) {
    case 'platinum':
      return {
        icon: <Crown className="w-3 h-3 mr-1 text-purple-400" />, 
        label: 'Platinum Partner',
        className: 'bg-gradient-to-r from-purple-100/60 to-pink-100/60 text-purple-700 border border-purple-200/40 dark:text-purple-200 dark:border-purple-400/20',
      };
    case 'gold':
      return {
        icon: <Star className="w-3 h-3 mr-1 text-yellow-400" />, 
        label: 'Gold Partner',
        className: 'bg-gradient-to-r from-yellow-100/60 to-orange-100/60 text-yellow-700 border border-yellow-200/40 dark:text-yellow-200 dark:border-yellow-400/20',
      };
    case 'silver':
      return {
        icon: <Gem className="w-3 h-3 mr-1 text-gray-400" />, 
        label: 'Silver Partner',
        className: 'bg-gradient-to-r from-gray-100/60 to-slate-100/60 text-gray-600 border border-gray-200/40 dark:text-gray-200 dark:border-gray-400/20',
      };
    case 'community':
    default:
      return {
        icon: <Users className="w-3 h-3 mr-1 text-emerald-400" />, 
        label: 'Community Partner',
        className: 'bg-gradient-to-r from-emerald-100/60 to-teal-100/60 text-emerald-700 border border-emerald-200/40 dark:text-emerald-200 dark:border-emerald-400/20',
      };
  }
}

// Individual sponsor suggestion component
const SponsorSuggestion: React.FC<SponsorSuggestionProps> = ({
  id,
  name,
  description,
  tier,
  type,
  logoUrl,
  websiteUrl,
  categories,
  verified,
  islamicAuthenticityScore,
  halalCertified,
  location,
  resources,
  context,
  integrationType,
  messageTemplate,
  callToAction = "Learn More",
  onInteraction
}) => {
  const tierStyling = getTierStyling(tier);
  const contextStyling = getContextualStyling(context, integrationType);
  
  const handleInteraction = (action: string) => {
    onInteraction?.(action);
  };

  const getContextualMessage = () => {
    if (messageTemplate) return messageTemplate;
    
    const contextMessages = {
      journal: `"And whoever relies upon Allah - then He is sufficient for him." - Reflect deeper with authentic Islamic resources and guided journal prompts.`,
      cards: `"And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Continue your journey with more authentic Islamic wisdom.`,
      games: `"And whoever strives only strives for [the benefit of] himself." - Challenge yourself with Islamic knowledge games and memory enhancement tools.`,
      profile: `"And whoever does righteous deeds, whether male or female, while being a believer - those will enter Paradise." - Connect with your local Islamic community and learning circles.`,
      homepage: `"Read in the name of your Lord who created." - Discover authentic Islamic knowledge through trusted scholars and educational resources.`,
      chat: `Here's a helpful Islamic resource that might interest you based on our conversation.`,
      prayer_times: `"And establish prayer and give zakah and bow with those who bow." - Find prayer resources and Islamic guidance for your daily worship.`
    };
    
    return contextMessages[context] || `Discover authentic Islamic knowledge and resources.`;
  };

  const getIntegrationIcon = () => {
    const icons = {
      suggestion: BookOpen,
      resource: ExternalLink,
      achievement: Star,
      directory: MapPin,
      educational: BookOpen,
      community: Users
    };
    
    const Icon = icons[integrationType] || BookOpen;
    return <Icon className="h-4 w-4" />;
  };

  // Render different layouts based on context
  const renderAvatar = () => {
    if (!contextStyling.showAvatar) return null;
    
    return (
      <div className="flex-shrink-0">
        {logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${name} logo`}
            className={`rounded-full object-cover ${contextStyling.compact ? 'w-8 h-8' : 'w-12 h-12'}`}
          />
        ) : (
          <div className={`rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center ${contextStyling.compact ? 'w-8 h-8' : 'w-12 h-12'}`}>
            {getIntegrationIcon()}
          </div>
        )}
      </div>
    );
  };

  const renderHeader = () => (
    <div className="flex items-center gap-2 mb-2">
      <h4 className={`font-semibold text-white truncate ${contextStyling.compact ? 'text-sm' : 'text-base'}`}>
        {name}
      </h4>
      {verified && (
        <div className="w-4 h-4 rounded-full bg-pastel-mint flex items-center justify-center">
          <span className="text-xs">✓</span>
        </div>
      )}
      {type === 'local' && (
        <Badge className="text-xs px-2 py-0.5 bg-pastel-blue/20 text-pastel-blue border-pastel-blue/30">
          <MapPin className="h-3 w-3 mr-1" />
          Local
        </Badge>
      )}
    </div>
  );

  const renderContent = () => (
    <div className={contextStyling.content}>
      {renderHeader()}
      
      <p className={`text-white/70 mb-3 line-clamp-2 ${contextStyling.compact ? 'text-xs' : 'text-sm'}`}>
        {getContextualMessage()}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {halalCertified && (
            <Badge className="text-xs px-2 py-0.5 bg-pastel-mint/20 text-pastel-mint border-pastel-mint/30">
              Halal
            </Badge>
          )}
          {islamicAuthenticityScore >= 8 && (
            <Badge className="text-xs px-2 py-0.5 bg-pastel-yellow/20 text-pastel-yellow border-pastel-yellow/30">
              Verified
            </Badge>
          )}
        </div>

        <Button
          size="sm"
          className={`frosted-button-sm h-7 px-3 ${contextStyling.compact ? 'text-xs' : 'text-sm'}`}
          onClick={() => handleInteraction('explore')}
        >
          {callToAction}
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      {/* Tier badge at bottom */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <Badge className={`text-xs px-2 py-1 backdrop-blur-sm border ${tierStyling.badge}`}>
          {tierStyling.badgeText}
        </Badge>
      </div>
    </div>
  );

  // Chat bubble style for homepage/chat contexts
  if (context === 'chat') {
    return (
      <div className={contextStyling.container}>
        <div className={`${contextStyling.card} ${tierStyling.glow}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink flex items-center justify-center">
              {getIntegrationIcon()}
            </div>
            <Badge className={`text-xs px-2 py-0.5 backdrop-blur-sm border ${tierStyling.badge}`}>
              {tierStyling.badgeText}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-white text-sm">{name}</h5>
            <p className="text-white/70 text-xs">{getContextualMessage()}</p>
            
            <Button
              size="sm"
              className="frosted-button-sm text-xs h-6 px-2 w-full"
              onClick={() => handleInteraction('explore')}
            >
              {callToAction}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Card-style layout for cards page - TRULY NATIVE (looks like HikmahCard)
  if (context === 'cards') {
    const badgeProps = getTierBadgeProps(tier);
    return (
      <div className={contextStyling.container}>
        <Card className="elegant-card border border-border/40 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              {/* Icon and content in a row for density */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 flex items-center justify-center border border-white/10 mt-1">
                  <BookOpen className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-snug font-medium italic mb-1">
                    {getContextualMessage()}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-white/60">
                    <span>Resource by {name}</span>
                    {halalCertified && (
                      <span className="w-3 h-3 rounded-full bg-pastel-mint/40 flex items-center justify-center ml-1">
                        <span className="text-pastel-mint text-xs">✓</span>
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-normal ${badgeProps.className}`} style={{marginLeft: 4}}>
                      {badgeProps.icon}{badgeProps.label}
                    </span>
                  </div>
                </div>
                {/* Subtle CTA as icon button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10 ml-2"
                  onClick={() => handleInteraction('explore')}
                  aria-label="Explore sponsor resource"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default layout for other contexts
  return (
    <div className={contextStyling.container}>
      <Card className={`${contextStyling.card} ${tierStyling.glow}`}>
        <CardContent className={contextStyling.compact ? 'p-4' : 'p-6'}>
          <div className={contextStyling.layout}>
            {renderAvatar()}
            {renderContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Resource card for educational content
const SponsorResourceCard: React.FC<{
  resource: SponsorResource;
  sponsor: SponsorData;
  onInteraction?: (action: string) => void;
}> = ({ resource, sponsor, onInteraction }) => {
  const difficultyColors = {
    1: 'text-green-400',
    2: 'text-blue-400', 
    3: 'text-yellow-400',
    4: 'text-orange-400',
    5: 'text-red-400'
  };

  const difficultyLabels = {
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate', 
    4: 'Advanced',
    5: 'Expert'
  };

  return (
    <Card className="frosted-glass border-white/10 rounded-2xl frosted-hover transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {resource.thumbnailUrl && (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">
              {resource.title}
            </h4>
            
            <p className="text-white/70 text-xs mb-2 line-clamp-2">
              {resource.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={`text-xs px-2 py-0.5 ${difficultyColors[resource.difficultyLevel]} bg-white/10 border-white/20`}>
                  {difficultyLabels[resource.difficultyLevel]}
                </Badge>
                
                {resource.freeAccess && (
                  <Badge className="text-xs px-2 py-0.5 bg-pastel-mint/20 text-pastel-mint border-pastel-mint/30">
                    Free
                  </Badge>
                )}
                
                {resource.userRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-pastel-yellow text-pastel-yellow" />
                    <span className="text-xs text-white/70">{resource.userRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <Button
                size="sm"
                className="frosted-button-sm text-xs h-6 px-2"
                onClick={() => onInteraction?.('view_resource')}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main native sponsor component
export const NativeSponsor: React.FC<NativeSponsorProps> = ({
  context,
  integrationType = 'suggestion',
  userLocation,
  maxSponsors = 2,
  className = '',
  onSponsorInteraction
}) => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContextualSponsors();
  }, [context, userLocation]);

  const fetchContextualSponsors = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        context,
        integration_type: integrationType,
        max_results: maxSponsors.toString()
      });

      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
      }

      const response = await fetch(`/api/sponsors/contextual?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSponsors(data.sponsors || []);
      }
    } catch (error) {
      console.error('Failed to fetch contextual sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSponsorInteraction = (sponsorId: string, action: string) => {
    onSponsorInteraction?.(sponsorId, action);
    
    // Track interaction
    fetch('/api/sponsors/track-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sponsor_id: sponsorId,
        context,
        action,
        user_location: userLocation
      })
    }).catch(console.error);
  };

  if (loading || sponsors.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {sponsors.map((sponsor) => (
        <SponsorSuggestion
          key={sponsor.id}
          {...sponsor}
          context={context}
          integrationType={integrationType}
          onInteraction={(action) => handleSponsorInteraction(sponsor.id, action)}
        />
      ))}
    </div>
  );
};

// Directory view for browsing sponsors
export const SponsorDirectory: React.FC<{
  type?: SponsorType;
  category?: string;
  userLocation?: { lat: number; lng: number };
  className?: string;
}> = ({ type, category, userLocation, className = '' }) => {
  const [sponsors, setSponsors] = useState<SponsorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, [type, category, userLocation]);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (category) params.append('category', category);
      if (userLocation) {
        params.append('lat', userLocation.lat.toString());
        params.append('lng', userLocation.lng.toString());
      }

      const response = await fetch(`/api/sponsors/directory?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSponsors(data.sponsors || []);
      }
    } catch (error) {
      console.error('Failed to fetch sponsor directory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="frosted-glass h-20 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {sponsors.map((sponsor) => (
        <Card key={sponsor.id} className="frosted-glass border-white/10 rounded-2xl frosted-hover">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {sponsor.logoUrl && (
                <img
                  src={sponsor.logoUrl}
                  alt={`${sponsor.name} logo`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{sponsor.name}</h3>
                  
                  {sponsor.verified && (
                    <div className="w-5 h-5 rounded-full bg-pastel-mint flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                  
                  <Badge className={getTierStyling(sponsor.tier).badge}>
                    {sponsor.tier}
                  </Badge>
                </div>
                
                <p className="text-white/70 text-sm mb-3">{sponsor.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {sponsor.location && (
                      <Badge className="bg-pastel-blue/20 text-pastel-blue border-pastel-blue/30">
                        <MapPin className="h-3 w-3 mr-1" />
                        {sponsor.location.displayName}
                      </Badge>
                    )}
                    
                    {sponsor.halalCertified && (
                      <Badge className="bg-pastel-mint/20 text-pastel-mint border-pastel-mint/30">
                        Halal Certified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {sponsor.resources && sponsor.resources.length > 0 && (
                      <Button size="sm" className="frosted-button-sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Resources ({sponsor.resources.length})
                      </Button>
                    )}
                    
                    {sponsor.websiteUrl && (
                      <Button size="sm" className="frosted-button-sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resources */}
            {sponsor.resources && sponsor.resources.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-white/80">Available Resources:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sponsor.resources.slice(0, 4).map((resource) => (
                    <SponsorResourceCard
                      key={resource.id}
                      resource={resource}
                      sponsor={sponsor}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NativeSponsor;
