-- Create daily_journal_entries table
CREATE TABLE IF NOT EXISTS daily_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  entry_date VARCHAR(10) NOT NULL, -- YYYY-MM-DD format
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT daily_journal_user_date_unique UNIQUE (user_id, entry_date)
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_daily_journal_user_id ON daily_journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_journal_entry_date ON daily_journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_journal_user_date ON daily_journal_entries(user_id, entry_date);
