-- Native Sponsor System Database Schema
-- This schema supports tiered, location-aware, native sponsor integration

-- Main sponsors table with tier and type classification
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  type sponsor_type NOT NULL, -- 'global' or 'local'
  tier sponsor_tier NOT NULL, -- 'platinum', 'gold', 'silver', 'community'
  
  -- Basic information
  description TEXT,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  contact_email VARCHAR(255),
  
  -- Categorization
  categories TEXT[] DEFAULT '{}', -- ['education', 'technology', 'charity', 'mosque', 'restaurant']
  tags TEXT[] DEFAULT '{}', -- ['quran', 'hadith', 'fiqh', 'arabic', 'community']
  
  -- Islamic authenticity and verification
  verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by VARCHAR(255), -- admin who verified
  islamic_authenticity_score INTEGER CHECK (islamic_authenticity_score >= 1 AND islamic_authenticity_score <= 10),
  community_reputation_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 10.00
  
  -- Business information
  halal_certified BOOLEAN DEFAULT false,
  islamic_values_aligned BOOLEAN DEFAULT true,
  community_focused BOOLEAN DEFAULT false,
  
  -- Status and lifecycle
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  partnership_start_date DATE,
  partnership_end_date DATE,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID, -- admin user who added
  
  -- Search and indexing
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Create enums for type safety
CREATE TYPE sponsor_type AS ENUM ('global', 'local');
CREATE TYPE sponsor_tier AS ENUM ('platinum', 'gold', 'silver', 'community');
CREATE TYPE location_type AS ENUM ('country', 'state', 'city', 'coordinates', 'postal_code');
CREATE TYPE integration_type AS ENUM ('suggestion', 'resource', 'achievement', 'directory', 'educational', 'community');
CREATE TYPE context_type AS ENUM ('homepage', 'journal', 'cards', 'games', 'profile', 'chat', 'prayer_times');

-- Location-based sponsor mapping for local sponsors
CREATE TABLE sponsor_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  
  -- Location hierarchy
  location_type location_type NOT NULL,
  location_value VARCHAR(255) NOT NULL, -- 'US', 'California', 'Los Angeles', '90210'
  location_display_name VARCHAR(255), -- 'United States', 'California', 'Los Angeles, CA'
  
  -- Precise location for local businesses
  coordinates POINT, -- PostGIS point for precise location
  address TEXT,
  postal_code VARCHAR(20),
  
  -- Service area
  radius_km INTEGER DEFAULT 10, -- service radius in kilometers
  serves_online BOOLEAN DEFAULT false, -- serves users online regardless of location
  
  -- Location metadata
  timezone VARCHAR(50), -- 'America/Los_Angeles'
  country_code CHAR(2), -- 'US', 'CA', 'UK'
  language_codes TEXT[] DEFAULT '{}', -- ['en', 'ar', 'ur']
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique location per sponsor
  UNIQUE(sponsor_id, location_type, location_value)
);

-- Context-based integration rules defining how sponsors appear
CREATE TABLE sponsor_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  
  -- Where the sponsor appears
  context context_type NOT NULL,
  integration_type integration_type NOT NULL,
  
  -- Display configuration
  message_template TEXT, -- Template with variables like {sponsor_name}, {user_name}
  call_to_action TEXT, -- "Explore courses", "Find nearby", "Learn more"
  icon_name VARCHAR(50), -- Lucide icon name
  
  -- Targeting and conditions
  targeting_conditions JSONB DEFAULT '{}', -- Complex targeting rules
  user_activity_trigger VARCHAR(100), -- 'journal_entry_completed', 'card_collected'
  min_user_level INTEGER DEFAULT 1,
  max_daily_impressions INTEGER DEFAULT 3,
  
  -- Priority and scheduling
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  weight DECIMAL(3,2) DEFAULT 1.00, -- For weighted random selection
  active_hours INTEGER[] DEFAULT '{}', -- [8,9,10,17,18,19] for 8am-10am, 5pm-7pm
  active_days INTEGER[] DEFAULT '{1,2,3,4,5,6,7}', -- 1=Monday, 7=Sunday
  
  -- Performance tracking
  impression_count INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  last_shown TIMESTAMP,
  
  -- Lifecycle
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Educational resources provided by sponsors
CREATE TABLE sponsor_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  
  -- Resource information
  title VARCHAR(255) NOT NULL,
  description TEXT,
  resource_type VARCHAR(50) NOT NULL, -- 'course', 'book', 'video', 'article', 'app'
  url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  
  -- Content metadata
  language_code CHAR(2) DEFAULT 'en',
  difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  estimated_duration_minutes INTEGER,
  topics TEXT[] DEFAULT '{}', -- ['quran', 'hadith', 'fiqh', 'arabic']
  
  -- Quality and verification
  quality_score DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 10.00
  islamic_authenticity_verified BOOLEAN DEFAULT false,
  content_reviewed BOOLEAN DEFAULT false,
  
  -- Availability
  free_access BOOLEAN DEFAULT false,
  requires_registration BOOLEAN DEFAULT false,
  cost_usd DECIMAL(10,2),
  
  -- Performance
  user_rating DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences for sponsor content
CREATE TABLE user_sponsor_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References your user table
  
  -- General preferences
  enable_sponsor_suggestions BOOLEAN DEFAULT true,
  enable_local_sponsors BOOLEAN DEFAULT true,
  enable_global_sponsors BOOLEAN DEFAULT true,
  
  -- Location preferences
  share_precise_location BOOLEAN DEFAULT false,
  share_city_location BOOLEAN DEFAULT true,
  manual_location VARCHAR(255), -- User-set location override
  
  -- Content preferences
  preferred_categories TEXT[] DEFAULT '{}',
  excluded_categories TEXT[] DEFAULT '{}',
  preferred_languages TEXT[] DEFAULT '{"en"}',
  max_daily_suggestions INTEGER DEFAULT 5,
  
  -- Privacy settings
  allow_behavioral_targeting BOOLEAN DEFAULT false,
  allow_location_based_suggestions BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id)
);

-- Sponsor performance analytics
CREATE TABLE sponsor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  context_id UUID REFERENCES sponsor_contexts(id) ON DELETE CASCADE,
  
  -- Metrics
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  interactions INTEGER DEFAULT 0, -- clicks, taps, engagements
  conversions INTEGER DEFAULT 0, -- meaningful actions taken
  
  -- User engagement depth
  average_engagement_time_seconds INTEGER DEFAULT 0,
  unique_users_reached INTEGER DEFAULT 0,
  returning_user_interactions INTEGER DEFAULT 0,
  
  -- Geographic breakdown
  country_code CHAR(2),
  state_province VARCHAR(100),
  city VARCHAR(100),
  
  -- Contextual performance
  context context_type,
  integration_type integration_type,
  
  -- Quality metrics
  user_satisfaction_score DECIMAL(3,2), -- Based on user feedback
  educational_value_score DECIMAL(3,2), -- Based on user learning outcomes
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Unique constraint to prevent duplicate daily records
  UNIQUE(sponsor_id, context_id, date, country_code, state_province, city)
);

-- User feedback on sponsor suggestions
CREATE TABLE sponsor_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- References your user table
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  context_id UUID REFERENCES sponsor_contexts(id) ON DELETE CASCADE,
  
  -- Feedback type
  feedback_type VARCHAR(50) NOT NULL, -- 'helpful', 'not_relevant', 'inappropriate', 'excellent'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Context
  shown_context context_type,
  user_location POINT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_sponsors_type_tier ON sponsors(type, tier);
CREATE INDEX idx_sponsors_active_verified ON sponsors(active, verified);
CREATE INDEX idx_sponsors_categories ON sponsors USING GIN(categories);
CREATE INDEX idx_sponsors_search ON sponsors USING GIN(search_vector);

CREATE INDEX idx_sponsor_locations_coordinates ON sponsor_locations USING GIST(coordinates);
CREATE INDEX idx_sponsor_locations_sponsor_type ON sponsor_locations(sponsor_id, location_type);

CREATE INDEX idx_sponsor_contexts_context_active ON sponsor_contexts(context, active);
CREATE INDEX idx_sponsor_contexts_priority ON sponsor_contexts(priority DESC);
CREATE INDEX idx_sponsor_contexts_sponsor_context ON sponsor_contexts(sponsor_id, context);

CREATE INDEX idx_sponsor_resources_type_active ON sponsor_resources(resource_type, active);
CREATE INDEX idx_sponsor_resources_topics ON sponsor_resources USING GIN(topics);

CREATE INDEX idx_sponsor_analytics_date_sponsor ON sponsor_analytics(date, sponsor_id);
CREATE INDEX idx_sponsor_analytics_context_date ON sponsor_analytics(context, date);

-- Views for common queries
CREATE VIEW active_sponsors AS
SELECT s.*, 
       CASE WHEN s.type = 'local' THEN sl.location_value ELSE 'global' END as location_context
FROM sponsors s
LEFT JOIN sponsor_locations sl ON s.id = sl.sponsor_id
WHERE s.active = true AND s.verified = true;

CREATE VIEW sponsor_performance_summary AS
SELECT 
    s.id,
    s.name,
    s.tier,
    s.type,
    SUM(sa.impressions) as total_impressions,
    SUM(sa.interactions) as total_interactions,
    SUM(sa.conversions) as total_conversions,
    CASE 
        WHEN SUM(sa.impressions) > 0 
        THEN ROUND((SUM(sa.interactions)::DECIMAL / SUM(sa.impressions)) * 100, 2)
        ELSE 0 
    END as interaction_rate_percent,
    AVG(sa.user_satisfaction_score) as avg_satisfaction_score
FROM sponsors s
LEFT JOIN sponsor_analytics sa ON s.id = sa.sponsor_id
WHERE s.active = true
GROUP BY s.id, s.name, s.tier, s.type;
