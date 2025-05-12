-- Blog Outlines Table
create table if not exists blog_outlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  blog_post_id uuid references blog_posts(id),
  outline jsonb not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- AI Feedback Table
create table if not exists ai_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  outline_id uuid references blog_outlines(id),
  feedback_text text not null,
  created_at timestamp with time zone default timezone('utc', now())
); 