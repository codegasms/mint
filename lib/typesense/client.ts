import Typesense from "typesense";
import { config } from "dotenv";

config({ path: ".env.local" });
let typesenseClient: Typesense.Client;

export function getTypesenseClient() {
  if (!typesenseClient) {
    typesenseClient = new Typesense.Client({
      nodes: [
        {
          host: process.env.TYPESENSE_HOST!,
          port: parseInt(process.env.TYPESENSE_PORT!, 10),
          protocol: process.env.TYPESENSE_PROTOCOL!,
        },
      ],
      apiKey: process.env.TYPESENSE_API_KEY!,
      connectionTimeoutSeconds: 2,
      retryIntervalSeconds: 0.1,
      numRetries: 3,
    });
  }

  return typesenseClient;
}

// Helper function to handle search errors
export async function safeSearch<T>(
  searchFn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await searchFn();
  } catch (error) {
    console.error("Typesense search error:", error);
    return fallback;
  }
}

// Types for common search parameters
export interface SearchParams {
  q: string;
  query_by: string;
  filter_by?: string;
  sort_by?: string;
  page?: number;
  per_page?: number;
  facet_by?: string;
  max_facet_values?: number;
}

// Common search result interface
export interface SearchResponse<T> {
  found: number;
  hits: Array<{
    document: T;
    highlights: Array<{
      field: string;
      snippet: string;
    }>;
  }>;
  facet_counts?: Array<{
    field_name: string;
    counts: Array<{
      count: number;
      value: string;
    }>;
  }>;
  page: number;
}

// Helper function to create search parameters
export function createSearchParams(
  query: string,
  queryBy: string[],
  options: Partial<SearchParams> = {},
): SearchParams {
  return {
    q: query,
    query_by: queryBy.join(","),
    per_page: 10,
    ...options,
  };
}
