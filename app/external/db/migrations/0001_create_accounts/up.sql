-- 勘定科目マスタ。区分などの列は、必要になった機能のマイグレーションで追加する
create table accounts (
  id         integer generated always as identity primary key,
  code       text not null unique,
  name       text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
