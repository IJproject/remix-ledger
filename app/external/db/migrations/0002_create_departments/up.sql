-- 部門マスタ。階層（上位部門）や使用停止などの列は、必要になった機能のマイグレーションで追加する
create table departments (
  id         integer generated always as identity primary key,
  code       text not null unique,
  name       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
