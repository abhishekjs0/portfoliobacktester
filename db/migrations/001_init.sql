CREATE TABLE IF NOT EXISTS "user" (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  plan VARCHAR(32) DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batch (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES "user"(id) ON DELETE CASCADE,
  strategy_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploadfilerecord (
  id VARCHAR(36) PRIMARY KEY,
  batch_id VARCHAR(36) REFERENCES batch(id) ON DELETE CASCADE,
  ticker VARCHAR(32) NOT NULL,
  strategy VARCHAR(255) NOT NULL,
  export_date DATE NOT NULL,
  filename VARCHAR(255) NOT NULL,
  object_key VARCHAR(255) NOT NULL,
  rows_parsed INT NOT NULL,
  rows_skipped INT NOT NULL,
  warnings JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfoliorun (
  id VARCHAR(36) PRIMARY KEY,
  batch_id VARCHAR(36) REFERENCES batch(id) ON DELETE CASCADE,
  currency VARCHAR(8) DEFAULT 'USD',
  total_capital DOUBLE PRECISION NOT NULL,
  date_start TIMESTAMPTZ,
  date_end TIMESTAMPTZ,
  metrics JSONB NOT NULL,
  equity_curve JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_log (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES "user"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  runs INT DEFAULT 0,
  files_uploaded INT DEFAULT 0,
  UNIQUE (user_id, date)
);
