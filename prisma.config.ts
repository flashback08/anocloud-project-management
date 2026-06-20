import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Explicitly load environment variables from your root .env file
dotenv.config();

export default defineConfig({
  datasource: {
    // Now process.env.DATABASE_URL is guaranteed to contain your Supabase connection string
    url: process.env.DATABASE_URL,
  },
});