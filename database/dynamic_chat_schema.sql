-- DeenQuest Dynamic Chat System Database Schema
-- Phase 1: Foundation Database Tables

-- =====================================================
-- CONVERSATION ANALYSIS & CONTEXT TRACKING
-- =====================================================

-- Table to store conversation sessions and their context
CREATE TABLE conversation_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    session_duration_minutes INTEGER,
    message_count INTEGER DEFAULT 0,
    topics_discussed TEXT[] DEFAULT ARRAY[]::TEXT[],
    spiritual_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
    emotional_tone VARCHAR(50), -- 'seeking', 'reflective', 'curious', 'troubled', 'grateful', 'peaceful'
    knowledge_level VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    engagement_score INTEGER DEFAULT 0, -- 1-10 scale
    ai_suggestions_given TEXT[] DEFAULT ARRAY[]::TEXT[],
    content_unlocked JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table to store individual messages with analysis
CREATE TABLE conversation_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES conversation_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    message_type VARCHAR(20) NOT NULL, -- 'user', 'ai', 'system'
    message_content TEXT NOT NULL,
    message_timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Analysis fields
    topics_extracted TEXT[] DEFAULT ARRAY[]::TEXT[],
    spiritual_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
    emotional_indicators TEXT[] DEFAULT ARRAY[]::TEXT[],
    knowledge_indicators TEXT[] DEFAULT ARRAY[]::TEXT[],
    unlock_triggers TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Metadata
    word_count INTEGER,
    complexity_score INTEGER, -- 1-10
    engagement_level INTEGER, -- 1-10
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- DYNAMIC CONTENT UNLOCKING SYSTEM
-- =====================================================

-- Enhanced unlockable content table with complex conditions
CREATE TABLE unlockable_content (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL, -- 'wisdom_card', 'game', 'journal_prompt', 'achievement'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_data JSONB NOT NULL, -- Flexible content storage
    
    -- Unlock conditions (complex JSON structure)
    unlock_conditions JSONB NOT NULL DEFAULT '{
        "topics_required": [],
        "themes_required": [],
        "engagement_threshold": 5,
        "conversation_count_min": 1,
        "emotional_states": [],
        "knowledge_level": "any",
        "time_requirements": {},
        "prerequisite_unlocks": []
    }'::JSONB,
    
    -- Content categorization
    spiritual_themes TEXT[] DEFAULT ARRAY[]::TEXT[],
    islamic_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
    content_category VARCHAR(100),
    
    -- Metadata
    created_by VARCHAR(100) DEFAULT 'system',
    is_active BOOLEAN DEFAULT true,
    unlock_priority INTEGER DEFAULT 100, -- Lower = higher priority
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table to track user's unlocked content
CREATE TABLE user_unlocked_content (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    content_id INTEGER REFERENCES unlockable_content(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    unlock_trigger_session INTEGER REFERENCES conversation_sessions(id),
    unlock_reason TEXT, -- Description of why it was unlocked
    viewed_at TIMESTAMP,
    engagement_score INTEGER, -- How user engaged with unlocked content
    user_feedback VARCHAR(50), -- 'helpful', 'relevant', 'not_relevant'
    
    UNIQUE(user_id, content_id) -- Prevent duplicate unlocks
);

-- =====================================================
-- USER CONVERSATION PROGRESS TRACKING
-- =====================================================

-- Enhanced user progress tracking
CREATE TABLE user_conversation_progress (
    user_id UUID PRIMARY KEY,
    
    -- Conversation statistics
    total_conversations INTEGER DEFAULT 0,
    total_messages_sent INTEGER DEFAULT 0,
    average_session_duration DECIMAL(10,2) DEFAULT 0,
    longest_session_minutes INTEGER DEFAULT 0,
    last_conversation_at TIMESTAMP,
    
    -- Learning progress
    topics_explored TEXT[] DEFAULT ARRAY[]::TEXT[],
    spiritual_themes_discussed TEXT[] DEFAULT ARRAY[]::TEXT[],
    current_knowledge_level VARCHAR(20) DEFAULT 'beginner',
    knowledge_progression JSONB DEFAULT '[]'::JSONB, -- Track knowledge level changes over time
    
    -- Engagement patterns
    preferred_conversation_times JSONB DEFAULT '{}'::JSONB, -- Time preferences analysis
    average_engagement_score DECIMAL(3,2) DEFAULT 0,
    communication_style VARCHAR(50), -- 'direct', 'contemplative', 'inquisitive', 'emotional'
    response_preferences JSONB DEFAULT '{
        "length": "medium",
        "formality": "moderate",
        "detail_level": "balanced"
    }'::JSONB,
    
    -- Content preferences
    preferred_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    avoided_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    content_unlock_rate DECIMAL(3,2) DEFAULT 0, -- Percentage of available content unlocked
    
    -- Spiritual journey tracking
    spiritual_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
    spiritual_challenges TEXT[] DEFAULT ARRAY[]::TEXT[],
    spiritual_growth_indicators JSONB DEFAULT '[]'::JSONB,
    
    -- Achievement tracking
    achievements_unlocked TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_points_earned INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- AI CONVERSATION GUIDANCE SYSTEM
-- =====================================================

-- Table to store AI conversation suggestions and guidance
CREATE TABLE conversation_suggestions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_id INTEGER REFERENCES conversation_sessions(id),
    
    suggestion_type VARCHAR(50) NOT NULL, -- 'topic_suggestion', 'spiritual_practice', 'learning_path', 'reflection'
    suggestion_title VARCHAR(200) NOT NULL,
    suggestion_description TEXT NOT NULL,
    suggestion_action VARCHAR(100), -- Action to take when suggestion is selected
    suggestion_data JSONB DEFAULT '{}'::JSONB, -- Additional data for the suggestion
    
    -- Contextual information
    triggered_by_topic VARCHAR(200),
    triggered_by_theme VARCHAR(200),
    user_emotional_state VARCHAR(50),
    
    -- Suggestion metadata
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    relevance_score INTEGER DEFAULT 50, -- 1-100 relevance to current conversation
    
    -- User interaction
    presented_at TIMESTAMP DEFAULT NOW(),
    user_response VARCHAR(50), -- 'accepted', 'declined', 'ignored'
    responded_at TIMESTAMP,
    
    -- Effectiveness tracking
    led_to_engagement BOOLEAN DEFAULT false,
    led_to_unlock BOOLEAN DEFAULT false,
    user_satisfaction_score INTEGER -- 1-5 rating if provided
);

-- =====================================================
-- SPIRITUAL GUIDANCE AND REMINDERS
-- =====================================================

-- Table for contextual spiritual reminders and guidance
CREATE TABLE spiritual_guidance (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    guidance_type VARCHAR(50) NOT NULL, -- 'prayer_reminder', 'reflection_prompt', 'dua_suggestion', 'practice_reminder'
    
    -- Guidance content
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    islamic_reference TEXT, -- Quran verse, Hadith reference, etc.
    arabic_text TEXT, -- For duas, Quranic verses
    transliteration TEXT,
    
    -- Context that triggered the guidance
    triggered_by_conversation BOOLEAN DEFAULT false,
    trigger_context JSONB DEFAULT '{}'::JSONB,
    conversation_session INTEGER REFERENCES conversation_sessions(id),
    
    -- Timing and delivery
    scheduled_delivery TIMESTAMP,
    delivered_at TIMESTAMP,
    delivery_method VARCHAR(50) DEFAULT 'chat', -- 'chat', 'notification', 'reminder'
    
    -- User interaction
    viewed_at TIMESTAMP,
    user_action VARCHAR(50), -- 'acted_upon', 'saved', 'dismissed', 'shared'
    effectiveness_rating INTEGER, -- 1-5 if user provides feedback
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ADAPTIVE LEARNING AND PERSONALIZATION
-- =====================================================

-- Table to store user's adaptive learning profile
CREATE TABLE user_learning_profile (
    user_id UUID PRIMARY KEY,
    
    -- Learning preferences (learned from behavior)
    preferred_response_length VARCHAR(20) DEFAULT 'medium', -- 'short', 'medium', 'long'
    preferred_complexity_level INTEGER DEFAULT 3, -- 1-5 scale
    learns_best_through VARCHAR(50) DEFAULT 'conversation', -- 'conversation', 'examples', 'questions', 'stories'
    
    -- Communication style preferences
    preferred_tone VARCHAR(50) DEFAULT 'supportive', -- 'formal', 'casual', 'supportive', 'scholarly'
    cultural_context VARCHAR(100), -- Cultural background affecting communication style
    language_proficiency VARCHAR(20) DEFAULT 'fluent', -- For adapting language complexity
    
    -- Spiritual learning patterns
    spiritual_learning_style VARCHAR(50), -- 'contemplative', 'practical', 'intellectual', 'emotional'
    motivation_factors TEXT[] DEFAULT ARRAY[]::TEXT[], -- What motivates this user
    learning_pace VARCHAR(20) DEFAULT 'moderate', -- 'slow', 'moderate', 'fast'
    
    -- Behavioral patterns
    most_active_times JSONB DEFAULT '[]'::JSONB, -- When user is most engaged
    session_length_preference VARCHAR(20) DEFAULT 'medium', -- 'short', 'medium', 'long'
    topic_jumping_tendency INTEGER DEFAULT 5, -- 1-10 how often user changes topics
    
    -- AI adaptation parameters
    current_ai_personality VARCHAR(50) DEFAULT 'balanced', -- How AI should present itself
    personalization_level INTEGER DEFAULT 5, -- 1-10 how much to personalize
    
    -- Learning effectiveness metrics
    content_retention_score DECIMAL(3,2) DEFAULT 0,
    engagement_response_to_adaptations JSONB DEFAULT '[]'::JSONB,
    most_effective_guidance_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Conversation sessions indexes
CREATE INDEX idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX idx_conversation_sessions_start_time ON conversation_sessions(session_start);
CREATE INDEX idx_conversation_sessions_topics ON conversation_sessions USING GIN(topics_discussed);
CREATE INDEX idx_conversation_sessions_themes ON conversation_sessions USING GIN(spiritual_themes);

-- Messages indexes
CREATE INDEX idx_conversation_messages_session ON conversation_messages(session_id);
CREATE INDEX idx_conversation_messages_user ON conversation_messages(user_id);
CREATE INDEX idx_conversation_messages_timestamp ON conversation_messages(message_timestamp);
CREATE INDEX idx_conversation_messages_topics ON conversation_messages USING GIN(topics_extracted);

-- Unlockable content indexes
CREATE INDEX idx_unlockable_content_type ON unlockable_content(content_type);
CREATE INDEX idx_unlockable_content_themes ON unlockable_content USING GIN(spiritual_themes);
CREATE INDEX idx_unlockable_content_active ON unlockable_content(is_active);

-- User unlocked content indexes
CREATE INDEX idx_user_unlocked_content_user ON user_unlocked_content(user_id);
CREATE INDEX idx_user_unlocked_content_unlocked_at ON user_unlocked_content(unlocked_at);

-- Suggestions indexes
CREATE INDEX idx_suggestions_user_session ON conversation_suggestions(user_id, session_id);
CREATE INDEX idx_suggestions_type ON conversation_suggestions(suggestion_type);
CREATE INDEX idx_suggestions_priority ON conversation_suggestions(priority_level);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Sample unlockable wisdom cards
INSERT INTO unlockable_content (content_type, title, description, content_data, unlock_conditions, spiritual_themes, islamic_topics, difficulty_level) VALUES
('wisdom_card', 'Patience in Hardship', 'A wisdom card about finding patience during difficult times', 
'{"quote": "And give good tidings to the patient, Who, when disaster strikes them, say, \"Indeed we belong to Allah, and indeed to Him we will return.\"", "reference": "Quran 2:155-156", "reflection": "True patience is not just enduring hardship, but trusting in Allah''s wisdom through all circumstances."}',
'{"topics_required": ["hardship", "patience", "difficulty", "struggle"], "themes_required": ["patience", "trust_in_allah"], "engagement_threshold": 6, "emotional_states": ["troubled", "seeking"]}',
ARRAY['patience', 'trust_in_allah', 'hardship'],
ARRAY['sabr', 'tawakkul', 'trials'],
2),

('wisdom_card', 'Gratitude and Contentment', 'Finding joy and gratitude in Allah''s blessings', 
'{"quote": "If you are grateful, I will certainly give you more.", "reference": "Quran 14:7", "reflection": "Gratitude is not just saying thank you, but recognizing Allah''s hand in every blessing, great and small."}',
'{"topics_required": ["gratitude", "blessings", "thankfulness"], "themes_required": ["gratitude", "contentment"], "engagement_threshold": 4, "emotional_states": ["grateful", "peaceful"]}',
ARRAY['gratitude', 'contentment', 'blessings'],
ARRAY['shukr', 'barakah', 'contentment'],
1),

('game', 'Prayer Times Quiz', 'Interactive quiz about Islamic prayer times and practices',
'{"type": "quiz", "questions": [{"q": "How many obligatory prayers are there per day?", "options": ["3", "4", "5", "6"], "correct": 2}], "difficulty": "beginner"}',
'{"topics_required": ["prayer", "salah", "worship"], "themes_required": ["daily_practice", "worship"], "engagement_threshold": 5, "knowledge_level": "beginner"}',
ARRAY['daily_practice', 'worship', 'salah'],
ARRAY['salah', 'prayer_times', 'worship'],
1),

('journal_prompt', 'Reflecting on Daily Blessings', 'A guided reflection on recognizing Allah''s daily blessings',
'{"prompt": "Take a moment to reflect on three specific blessings you experienced today. How did each blessing make you feel closer to Allah?", "follow_up_questions": ["What blessing surprised you today?", "How can you show gratitude for these blessings?", "What would you like to ask Allah for tomorrow?"]}',
'{"topics_required": ["gratitude", "blessings", "reflection"], "themes_required": ["gratitude", "daily_reflection"], "engagement_threshold": 5, "emotional_states": ["grateful", "reflective"]}',
ARRAY['gratitude', 'daily_reflection', 'mindfulness'],
ARRAY['shukr', 'reflection', 'daily_practice'],
1);

-- Sample conversation achievements
INSERT INTO unlockable_content (content_type, title, description, content_data, unlock_conditions, spiritual_themes) VALUES
('achievement', 'Thoughtful Seeker', 'Asked 5+ deep questions about Islamic concepts',
'{"badge_icon": "brain", "badge_color": "purple", "points": 100, "description": "Your curiosity and deep questions show a sincere desire to understand Islam better."}',
'{"conversation_count_min": 3, "engagement_threshold": 7, "topics_required": ["questions", "seeking", "understanding"]}',
ARRAY['knowledge_seeking', 'curiosity']),

('achievement', 'Grateful Heart', 'Consistently expressed gratitude in conversations',
'{"badge_icon": "heart", "badge_color": "pink", "points": 150, "description": "Your grateful heart reflects the beauty of Islamic character."}',
'{"themes_required": ["gratitude"], "emotional_states": ["grateful"], "conversation_count_min": 5}',
ARRAY['gratitude', 'character']);

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to update user conversation progress
CREATE OR REPLACE FUNCTION update_user_conversation_progress(
    p_user_id UUID,
    p_session_id INTEGER,
    p_topics TEXT[],
    p_themes TEXT[],
    p_engagement_score INTEGER
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_conversation_progress (
        user_id, total_conversations, topics_explored, spiritual_themes_discussed, 
        last_conversation_at, average_engagement_score
    ) VALUES (
        p_user_id, 1, p_topics, p_themes, NOW(), p_engagement_score
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_conversations = user_conversation_progress.total_conversations + 1,
        topics_explored = array_cat(user_conversation_progress.topics_explored, p_topics),
        spiritual_themes_discussed = array_cat(user_conversation_progress.spiritual_themes_discussed, p_themes),
        last_conversation_at = NOW(),
        average_engagement_score = (user_conversation_progress.average_engagement_score + p_engagement_score) / 2,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check unlock conditions
CREATE OR REPLACE FUNCTION check_unlock_eligibility(
    p_user_id UUID,
    p_content_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    content_conditions JSONB;
    user_progress RECORD;
    meets_conditions BOOLEAN := true;
BEGIN
    -- Get unlock conditions for the content
    SELECT unlock_conditions INTO content_conditions 
    FROM unlockable_content WHERE id = p_content_id;
    
    -- Get user progress
    SELECT * INTO user_progress 
    FROM user_conversation_progress WHERE user_id = p_user_id;
    
    -- Check if already unlocked
    IF EXISTS (SELECT 1 FROM user_unlocked_content WHERE user_id = p_user_id AND content_id = p_content_id) THEN
        RETURN false;
    END IF;
    
    -- Check various conditions (simplified - would be more complex in real implementation)
    IF content_conditions->>'engagement_threshold' IS NOT NULL THEN
        IF user_progress.average_engagement_score < (content_conditions->>'engagement_threshold')::INTEGER THEN
            meets_conditions := false;
        END IF;
    END IF;
    
    RETURN meets_conditions;
END;
$$ LANGUAGE plpgsql;
