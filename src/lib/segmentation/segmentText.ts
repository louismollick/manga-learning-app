import { env } from "@/env.js";
import type { IchiranResponse } from "@/types/ichiran";
import ManagedError from "../errors/ManagedError";

export const segmentText = async (line: string) => {
  console.log(`Querying Ichiran for line: ${line}`);
  if (!line) {
    return [];
  }
  try {
    const res = await fetch(`${env.ICHIRAN_URL}/${line}`);
    if (!res.ok) {
      const reason = await res.text();
      const message = `Error response from Ichiran: ${reason}`;
      console.error(message);
      throw new ManagedError(message);
    }
    return (await res.json()) as IchiranResponse;
  } catch (error) {
    if (!(error instanceof ManagedError)) {
      console.error("Network error from Ichiran:", error);
    }
    throw error;
  }
};
