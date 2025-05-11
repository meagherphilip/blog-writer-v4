### Database Schema for AI Blog Generator

## Core Tables

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  role VARCHAR(50) DEFAULT 'user' -- 'user', 'admin', etc.
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  website VARCHAR(255),
  company VARCHAR(255),
  avatar_url VARCHAR(255),
  timezone VARCHAR(100) DEFAULT 'UTC',
  language VARCHAR(50) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### 3. Blog Posts Table

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured_image_url VARCHAR(255),
  word_count INTEGER,
  reading_time INTEGER, -- in minutes
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE UNIQUE INDEX idx_blog_posts_slug ON blog_posts(slug);
```

### 4. Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
```

### 5. Post Categories (Junction Table)

```sql
CREATE TABLE post_categories (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);
```

### 6. Tags Table

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);
```

### 7. Post Tags (Junction Table)

```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

## Analytics Tables

### 8. Post Views Table

```sql
CREATE TABLE post_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  viewer_ip VARCHAR(45), -- IPv6 compatible
  viewer_user_agent TEXT,
  referer_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_views_post_id ON post_views(post_id);
CREATE INDEX idx_post_views_viewed_at ON post_views(viewed_at);
```

### 9. Post Engagement Table

```sql
CREATE TABLE post_engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'like', 'share', 'comment', 'bookmark'
  source VARCHAR(50), -- 'website', 'twitter', 'facebook', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_engagement_post_id ON post_engagement(post_id);
CREATE INDEX idx_post_engagement_user_id ON post_engagement(user_id);
CREATE INDEX idx_post_engagement_type ON post_engagement(type);
```

### 10. Analytics Summary Table (for dashboard)

```sql
CREATE TABLE analytics_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  average_read_time FLOAT,
  bounce_rate FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_analytics_summary_user_date ON analytics_summary(user_id, date);
```

## AI Content Generation Tables

### 11. AI Prompts Table

```sql
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  prompt_text TEXT NOT NULL,
  category VARCHAR(100),
  tone VARCHAR(100),
  keywords TEXT[],
  length VARCHAR(50), -- 'short', 'medium', 'long', 'comprehensive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_prompts_user_id ON ai_prompts(user_id);
```

### 12. AI Generations Table

```sql
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES ai_prompts(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  model_used VARCHAR(100), -- 'gpt-4', 'gpt-3.5-turbo', etc.
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  converted_to_post BOOLEAN DEFAULT FALSE,
  post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_prompt_id ON ai_generations(prompt_id);
```

### 13. Content Ideas Table

```sql
CREATE TABLE content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50), -- 'easy', 'medium', 'hard'
  keywords TEXT[],
  is_ai_generated BOOLEAN DEFAULT TRUE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_ideas_user_id ON content_ideas(user_id);
CREATE INDEX idx_content_ideas_is_used ON content_ideas(is_used);
```

## User Settings and Preferences

### 14. User Settings Table

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  post_published_notifications BOOLEAN DEFAULT TRUE,
  post_performance_notifications BOOLEAN DEFAULT TRUE,
  login_alerts BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

### 15. API Keys Table

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_name VARCHAR(100) NOT NULL,
  api_key VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE UNIQUE INDEX idx_api_keys_api_key ON api_keys(api_key);
```

### 16. Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  user_agent TEXT,
  ip_address VARCHAR(45),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_session_token ON sessions(session_token);
```

## Entity Relationship Diagram (ERD)

```mermaid
AI Blog Generator Database Schema.download-icon {
            cursor: pointer;
            transform-origin: center;
        }
        .download-icon .arrow-part {
            transition: transform 0.35s cubic-bezier(0.35, 0.2, 0.14, 0.95);
             transform-origin: center;
        }
        button:has(.download-icon):hover .download-icon .arrow-part, button:has(.download-icon):focus-visible .download-icon .arrow-part {
          transform: translateY(-1.5px);
        }
        #mermaid-diagram-rt6c{font-family:var(--font-geist-sans);font-size:12px;fill:#000000;}#mermaid-diagram-rt6c .error-icon{fill:#552222;}#mermaid-diagram-rt6c .error-text{fill:#552222;stroke:#552222;}#mermaid-diagram-rt6c .edge-thickness-normal{stroke-width:1px;}#mermaid-diagram-rt6c .edge-thickness-thick{stroke-width:3.5px;}#mermaid-diagram-rt6c .edge-pattern-solid{stroke-dasharray:0;}#mermaid-diagram-rt6c .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-diagram-rt6c .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-diagram-rt6c .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-diagram-rt6c .marker{fill:#666;stroke:#666;}#mermaid-diagram-rt6c .marker.cross{stroke:#666;}#mermaid-diagram-rt6c svg{font-family:var(--font-geist-sans);font-size:12px;}#mermaid-diagram-rt6c p{margin:0;}#mermaid-diagram-rt6c .entityBox{fill:#eee;stroke:#999;}#mermaid-diagram-rt6c .attributeBoxOdd{fill:#ffffff;stroke:#999;}#mermaid-diagram-rt6c .attributeBoxEven{fill:#f2f2f2;stroke:#999;}#mermaid-diagram-rt6c .relationshipLabelBox{fill:hsl(-160, 0%, 93.3333333333%);opacity:0.7;background-color:hsl(-160, 0%, 93.3333333333%);}#mermaid-diagram-rt6c .relationshipLabelBox rect{opacity:0.5;}#mermaid-diagram-rt6c .relationshipLine{stroke:#666;}#mermaid-diagram-rt6c .entityTitleText{text-anchor:middle;font-size:18px;fill:#000000;}#mermaid-diagram-rt6c #MD_PARENT_START{fill:#f5f5f5!important;stroke:#666!important;stroke-width:1;}#mermaid-diagram-rt6c #MD_PARENT_END{fill:#f5f5f5!important;stroke:#666!important;stroke-width:1;}#mermaid-diagram-rt6c .flowchart-link{stroke:hsl(var(--gray-400));stroke-width:1px;}#mermaid-diagram-rt6c .marker,#mermaid-diagram-rt6c marker,#mermaid-diagram-rt6c marker *{fill:hsl(var(--gray-400))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rt6c .label,#mermaid-diagram-rt6c text,#mermaid-diagram-rt6c text>tspan{fill:hsl(var(--black))!important;color:hsl(var(--black))!important;}#mermaid-diagram-rt6c .background,#mermaid-diagram-rt6c rect.relationshipLabelBox{fill:hsl(var(--white))!important;}#mermaid-diagram-rt6c .entityBox,#mermaid-diagram-rt6c .attributeBoxEven{fill:hsl(var(--gray-150))!important;}#mermaid-diagram-rt6c .attributeBoxOdd{fill:hsl(var(--white))!important;}#mermaid-diagram-rt6c .label-container,#mermaid-diagram-rt6c rect.actor{fill:hsl(var(--white))!important;stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rt6c line{stroke:hsl(var(--gray-400))!important;}#mermaid-diagram-rt6c :root{--mermaid-font-family:var(--font-geist-sans);}USERSUSER_PROFILESBLOG_POSTSAI_PROMPTSAI_GENERATIONSCONTENT_IDEASUSER_SETTINGSAPI_KEYSSESSIONSPOST_VIEWSPOST_ENGAGEMENTCATEGORIESTAGSPOST_CATEGORIESPOST_TAGSANALYTICS_SUMMARYhascreatescreatesownshasconfiguresmanagesmaintainsreceivesgetsbelongs_tohasreferenceslinksreferenceslinksproducesconverts_totracks
```

## Implementation Notes

1. **UUID vs. Integer IDs**: This schema uses UUIDs for primary keys, which provides better security and easier distributed systems. You can switch to auto-incrementing integers if preferred.
2. **Timestamps**: All tables include created_at timestamps, and tables that can be updated include updated_at timestamps.
3. **Soft Deletes**: Consider adding a `deleted_at` timestamp to implement soft deletes for important tables like `users` and `blog_posts`.
4. **Indexing**: Indexes are added on columns frequently used in WHERE clauses, JOIN conditions, and ORDER BY statements.
5. **Text Search**: For production, consider adding full-text search capabilities using database-specific features:

1. PostgreSQL: Use tsvector columns and GIN indexes
2. MySQL: Use FULLTEXT indexes



6. **JSON Fields**: For flexible data storage, consider using JSON/JSONB fields (especially in PostgreSQL) for data like:

1. User preferences
2. Post metadata
3. AI generation parameters



7. **Database Choice**:

1. **PostgreSQL**: Recommended for its robust features, JSON support, and full-text search capabilities
2. **MySQL/MariaDB**: Good alternative with solid performance
3. **Supabase**: Excellent choice if you want a managed PostgreSQL database with built-in authentication





## Migration Strategy

When implementing this schema:

1. Start with core tables: users, user_profiles, blog_posts
2. Add categories and tags
3. Implement analytics tables
4. Add AI-related tables
5. Finally, add settings and preferences tables


This allows you to build the application incrementally while maintaining a solid data foundation.