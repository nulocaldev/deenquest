import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration - replace with actual database queries
const mockSponsors = [
  {
    id: '1',
    name: 'Bayyinah Institute',
    slug: 'bayyinah-institute',
    type: 'global' as const,
    tier: 'platinum' as const,
    description: 'Authentic Quranic education and Arabic language learning with Ustadh Nouman Ali Khan',
    websiteUrl: 'https://bayyinah.com',
    logoUrl: null,
    categories: ['education', 'quran', 'arabic'],
    tags: ['quran', 'arabic', 'tafseer', 'education'],
    verified: true,
    islamicAuthenticityScore: 9,
    communityReputationScore: 9.2,
    halalCertified: true,
    resources: [
      {
        id: 'r1',
        title: 'Quranic Arabic Fundamentals',
        description: 'Master the Arabic language to understand the Quran directly',
        resourceType: 'course' as const,
        url: 'https://bayyinah.com/arabic-fundamentals',
        difficultyLevel: 2 as const,
        estimatedDurationMinutes: 720,
        topics: ['quran', 'arabic', 'language'],
        freeAccess: true,
        userRating: 4.9,
        ratingCount: 3247
      }
    ]
  },
  {
    id: '2', 
    name: 'SeekersGuidance',
    slug: 'seekers-guidance',
    type: 'global' as const,
    tier: 'gold' as const,
    description: 'Traditional Islamic knowledge from qualified scholars worldwide',
    websiteUrl: 'https://seekersguidance.org',
    logoUrl: null,
    categories: ['education', 'fiqh', 'spirituality', 'scholars'],
    tags: ['fiqh', 'aqeedah', 'spirituality', 'scholars', 'traditional'],
    verified: true,
    islamicAuthenticityScore: 9,
    communityReputationScore: 8.8,
    halalCertified: true,
    resources: [
      {
        id: 'r2',
        title: 'Islamic Character and Ethics',
        description: 'Develop beautiful character based on Prophetic teachings',
        resourceType: 'course' as const,
        url: 'https://seekersguidance.org/courses/islamic-character',
        difficultyLevel: 1 as const,
        estimatedDurationMinutes: 480,
        topics: ['akhlaq', 'character', 'sunnah', 'spirituality'],
        freeAccess: true,
        userRating: 4.8,
        ratingCount: 1856
      }
    ]
  },
  {
    id: '3',
    name: 'Masjid An-Noor Community Center',
    slug: 'masjid-an-noor',
    type: 'local' as const,
    tier: 'silver' as const,
    description: 'Your local Islamic community center serving families with prayer, education, and community programs',
    websiteUrl: 'https://masjidannoor.org',
    logoUrl: null,
    categories: ['community', 'prayer', 'education', 'family'],
    tags: ['mosque', 'community', 'local', 'prayer', 'family'],
    verified: true,
    islamicAuthenticityScore: 8,
    communityReputationScore: 8.5,
    halalCertified: true,
    location: {
      displayName: 'Downtown Community Center',
      address: '123 Community Blvd, Your City',
      distance: 1.8
    }
  },
  {
    id: '4',
    name: 'Darul Qalam Heritage Foundation',
    slug: 'darul-qalam',
    type: 'global' as const,
    tier: 'community' as const,
    description: 'Preserving Islamic calligraphy, manuscripts, and traditional arts for future generations',
    websiteUrl: 'https://darulqalam.org',
    logoUrl: null,
    categories: ['art', 'culture', 'preservation', 'calligraphy'],
    tags: ['calligraphy', 'art', 'manuscripts', 'culture', 'heritage'],
    verified: true,
    islamicAuthenticityScore: 8,
    communityReputationScore: 7.9,
    halalCertified: true,
    resources: [
      {
        id: 'r4',
        title: 'Islamic Calligraphy Workshop',
        description: 'Learn the sacred art of Arabic calligraphy',
        resourceType: 'course' as const,
        url: 'https://darulqalam.org/workshops',
        difficultyLevel: 2 as const,
        estimatedDurationMinutes: 360,
        topics: ['calligraphy', 'art', 'arabic', 'culture'],
        freeAccess: false,
        userRating: 4.6,
        ratingCount: 428
      }
    ]
  }
];

// Context-based sponsor matching logic
function getContextualSponsors(
  context: string,
  integrationType: string,
  userLocation?: { lat: number; lng: number },
  maxResults: number = 3
) {
  let relevantSponsors = [...mockSponsors];

  // Filter by context relevance
  switch (context) {
    case 'journal':
      relevantSponsors = relevantSponsors.filter(s => 
        s.categories.includes('education') || s.categories.includes('spiritual')
      );
      break;
    case 'cards':
      relevantSponsors = relevantSponsors.filter(s =>
        s.categories.includes('education') || s.categories.includes('quran')
      );
      break;
    case 'games':
      relevantSponsors = relevantSponsors.filter(s =>
        s.categories.includes('education') || s.categories.includes('community')
      );
      break;
    case 'profile':
      relevantSponsors = relevantSponsors.filter(s =>
        s.categories.includes('education') || s.categories.includes('achievement')
      );
      break;
    case 'homepage':
      // Show mix of all types
      break;
    case 'prayer_times':
      relevantSponsors = relevantSponsors.filter(s =>
        s.categories.includes('mosque') || s.categories.includes('prayer')
      );
      break;
  }

  // Prioritize local sponsors if user location is available
  if (userLocation) {
    relevantSponsors.sort((a, b) => {
      if (a.type === 'local' && b.type === 'global') return -1;
      if (a.type === 'global' && b.type === 'local') return 1;
      
      // Sort by tier within same type
      const tierOrder = { platinum: 4, gold: 3, silver: 2, community: 1 };
      return tierOrder[b.tier] - tierOrder[a.tier];
    });
  } else {
    // Without location, prioritize global sponsors by tier
    relevantSponsors = relevantSponsors.filter(s => s.type === 'global');
    relevantSponsors.sort((a, b) => {
      const tierOrder = { platinum: 4, gold: 3, silver: 2, community: 1 };
      return tierOrder[b.tier] - tierOrder[a.tier];
    });
  }

  return relevantSponsors.slice(0, maxResults);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get('context') || 'homepage';
    const integrationType = searchParams.get('integration_type') || 'suggestion';
    const maxResults = parseInt(searchParams.get('max_results') || '3');
    
    // Parse user location if provided
    let userLocation: { lat: number; lng: number } | undefined;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    
    if (lat && lng) {
      userLocation = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
    }

    // Get contextual sponsors
    const sponsors = getContextualSponsors(
      context,
      integrationType,
      userLocation,
      maxResults
    );

    // Add contextual messaging based on context and integration type
    const enrichedSponsors = sponsors.map(sponsor => {
      let messageTemplate = '';
      let callToAction = 'Learn More';

      switch (context) {
        case 'journal':
          messageTemplate = `Deepen your spiritual reflection with guidance from ${sponsor.name}`;
          callToAction = 'Explore Resources';
          break;
        case 'cards':
          messageTemplate = `Discover more Islamic wisdom through ${sponsor.name}'s teachings`;
          callToAction = 'View Collection';
          break;
        case 'games':
          messageTemplate = `Challenge yourself with educational content from ${sponsor.name}`;
          callToAction = 'Try Now';
          break;
        case 'profile':
          messageTemplate = `Continue your Islamic learning journey with ${sponsor.name}`;
          callToAction = 'Explore Courses';
          break;
        case 'prayer_times':
          if (sponsor.type === 'local') {
            messageTemplate = `Find prayer times and community at ${sponsor.name}`;
            callToAction = 'Get Directions';
          } else {
            messageTemplate = `Enhance your prayer experience with ${sponsor.name}`;
            callToAction = 'Learn More';
          }
          break;
        default:
          messageTemplate = `Discover Islamic knowledge and community through ${sponsor.name}`;
      }

      return {
        ...sponsor,
        contextualMessage: messageTemplate,
        callToAction
      };
    });

    return NextResponse.json({
      success: true,
      sponsors: enrichedSponsors,
      context,
      userLocation: userLocation ? {
        provided: true,
        approximate: { lat: Math.round(userLocation.lat), lng: Math.round(userLocation.lng) }
      } : { provided: false }
    });

  } catch (error) {
    console.error('Error fetching contextual sponsors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}
