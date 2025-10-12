import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://thdksheaeketrrpmdfep.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZGtzaGVhZWtldHJycG1kZmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjM3ODAsImV4cCI6MjA3NTQ5OTc4MH0.TD7pqsb8lDMYEo2oxCFMsXGdx78OyiO5E7UaseQMlhY"
);
