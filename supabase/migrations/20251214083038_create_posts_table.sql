create extension if not exists "pgcrypto";

create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  cover_image text,
  slug varchar unique,
  author_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);