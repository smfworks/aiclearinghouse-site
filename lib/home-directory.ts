import { getAgentList, getAllCards, getSections } from "./marketplace/loader";
import type { AgentListItem, MarketplaceCard } from "./marketplace/types";

export interface HomeDirectory {
  agents: AgentListItem[];
  genericItems: Record<string, MarketplaceCard[]>;
  newsItems: MarketplaceCard[];
}

/** Homepage search and headlines. Card fields only — article bodies stay on detail routes. */
export function loadHomeDirectory(): HomeDirectory {
  const agents = getAgentList();
  const genericItems: Record<string, MarketplaceCard[]> = {};
  for (const section of getSections()) {
    if (section === "agents") continue;
    genericItems[section] = getAllCards(section);
  }
  const newsItems = (genericItems["ai-news"] || []).slice(0, 4);
  return { agents, genericItems, newsItems };
}
