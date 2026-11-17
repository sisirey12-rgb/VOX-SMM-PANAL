import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  for (const service of [
    { name: "Campaign strategy", category: "Strategy", description: "Audience research, channel plan, and measurable campaign brief.", priceCents: 14900 },
    { name: "Paid social launch", category: "Advertising", description: "Setup and management for consent-based paid social campaigns.", priceCents: 24900 },
    { name: "Content calendar", category: "Content", description: "A monthly publishing plan with creative direction and reporting.", priceCents: 9900 },
    { name: "Performance report", category: "Analytics", description: "Human-reviewed campaign analytics and optimization recommendations.", priceCents: 5900 }
  ]) await db.service.upsert({ where: { id: service.name.toLowerCase().replaceAll(" ", "-") }, create: { id: service.name.toLowerCase().replaceAll(" ", "-"), ...service }, update: service });
}
main().finally(() => db.$disconnect());
