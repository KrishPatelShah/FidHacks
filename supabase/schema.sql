create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  streak_count int not null default 0,
  last_activity_date date,
  current_path text not null default 'beginner' check (current_path in ('beginner', 'intermediate', 'advanced')),
  garden_visibility text not null default 'friends' check (garden_visibility in ('private', 'friends', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  budgeting_confidence int not null check (budgeting_confidence between 1 and 5),
  savings_confidence int not null check (savings_confidence between 1 and 5),
  credit_debt_confidence int not null check (credit_debt_confidence between 1 and 5),
  retirement_confidence int not null check (retirement_confidence between 1 and 5),
  career_taxes_confidence int not null check (career_taxes_confidence between 1 and 5),
  investing_confidence int not null check (investing_confidence between 1 and 5),
  primary_goal text not null,
  created_at timestamptz not null default now()
);

create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  flower_name text not null,
  stage int not null default 1,
  growth int not null default 0 check (growth between 0 and 100),
  quantity int not null default 1,
  water int not null default 0,
  sunlight int not null default 0,
  fertilizer int not null default 0,
  unlocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists learning_modules (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  flower_name text not null,
  title text not null,
  sort_order int not null default 0
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references learning_modules(id) on delete cascade,
  category text not null,
  title text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  content_type text not null check (content_type in ('video', 'reading', 'interactive')),
  source_url text,
  summary text not null,
  reward jsonb not null default '{}'::jsonb
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  prompt text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text not null
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  score int not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists budget_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category text not null,
  expected_amount numeric not null default 0,
  actual_amount numeric not null default 0,
  month text not null,
  created_at timestamptz not null default now()
);

create table if not exists weekly_challenges (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reward jsonb not null default '{}'::jsonb,
  active_week text not null
);

create table if not exists user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  challenge_id uuid not null references weekly_challenges(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  template_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  merchant text not null,
  amount numeric not null default 0,
  category text not null check (category in ('needs', 'wants', 'save', 'income')),
  source text not null default 'manual' check (source in ('scanned', 'manual')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  metric text not null,
  goal int not null
);

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  achievement_id text not null references achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table profiles enable row level security;
alter table questionnaire_responses enable row level security;
alter table plants enable row level security;
alter table quiz_attempts enable row level security;
alter table budget_entries enable row level security;
alter table user_challenges enable row level security;
alter table community_posts enable row level security;
alter table transactions enable row level security;
alter table user_achievements enable row level security;

create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);
create policy "users manage own plants" on plants for all using (auth.uid() = user_id);
create policy "users manage own budget" on budget_entries for all using (auth.uid() = user_id);
create policy "users manage own quiz attempts" on quiz_attempts for all using (auth.uid() = user_id);
create policy "users manage own questionnaire" on questionnaire_responses for all using (auth.uid() = user_id);
create policy "users manage own transactions" on transactions for all using (auth.uid() = user_id);
create policy "users manage own achievements" on user_achievements for all using (auth.uid() = user_id);
