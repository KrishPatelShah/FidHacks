import { Plant } from "@/types/domain";

// A single source of truth for each friend's garden. Every community view
// (leaderboard, gardens, directory) derives its numbers from `garden`, so the
// flower counts always agree instead of being hard-coded separately per screen.
export type FriendFlower = { flowerName: string; count: number };

export type Friend = {
  userId: string;
  displayName: string;
  username: string;
  goal: string;
  blurb: string;
  streakDays: number;
  topBadge: string;
  garden: FriendFlower[];
};

export const friends: Friend[] = [
  {
    userId: "friend_maya",
    displayName: "Maya R.",
    username: "maya.grows",
    goal: "Indexing Nerd",
    blurb: "Loves index funds and low-fee investing.",
    streakDays: 12,
    topBadge: "Indexing Nerd",
    garden: [
      { flowerName: "Purple Tulip", count: 4 },
      { flowerName: "Daisy", count: 3 },
      { flowerName: "Marigold", count: 3 },
      { flowerName: "Orchid", count: 2 },
      { flowerName: "Rose", count: 2 }
    ]
  },
  {
    userId: "friend_jordan",
    displayName: "Jordan K.",
    username: "jordan.saves",
    goal: "Saving for Grad School",
    blurb: "Building an emergency fund before tuition.",
    streakDays: 9,
    topBadge: "Emergency Fund Hero",
    garden: [
      { flowerName: "Marigold", count: 4 },
      { flowerName: "Daisy", count: 3 },
      { flowerName: "Rose", count: 2 },
      { flowerName: "Orchid", count: 2 }
    ]
  },
  {
    userId: "friend_alex",
    displayName: "Alex T.",
    username: "alex.starts",
    goal: "Just Started",
    blurb: "New to budgeting and learning the basics.",
    streakDays: 4,
    topBadge: "First Sprout",
    garden: [
      { flowerName: "Daisy", count: 3 },
      { flowerName: "Marigold", count: 2 }
    ]
  }
];

export function friendFlowerCount(friend: Friend): number {
  return friend.garden.reduce((sum, flower) => sum + flower.count, 0);
}

export function friendFlowerTypes(friend: Friend): number {
  return friend.garden.filter((flower) => flower.count > 0).length;
}

// Expand a friend's garden spec into Plant records the shared GardenPreview can
// render. Only flowerName/quantity/unlocked drive the drawing, the rest are
// display-only defaults.
export function friendPlants(friend: Friend): Plant[] {
  return friend.garden.map((flower, index) => ({
    id: `${friend.userId}_${index}`,
    userId: friend.userId,
    type: "budgeting",
    flowerName: flower.flowerName,
    stage: 2,
    growth: 60,
    quantity: flower.count,
    water: 0,
    sunlight: 0,
    fertilizer: 0,
    unlocked: flower.count > 0,
    createdAt: "",
    updatedAt: ""
  }));
}

// People you are not connected with yet, surfaced in the "Find friends" tab so
// you can search by username or invite via contacts (mocked for the demo).
export type DiscoverPerson = {
  userId: string;
  displayName: string;
  username: string;
  goal: string;
  mutualFriends: number;
};

export const discoverPeople: DiscoverPerson[] = [
  { userId: "person_sam", displayName: "Sam P.", username: "sam.sprout", goal: "First Sprout", mutualFriends: 2 },
  { userId: "person_riley", displayName: "Riley N.", username: "riley.budgets", goal: "Budget Reflector", mutualFriends: 1 },
  { userId: "person_devon", displayName: "Devon L.", username: "devon.invests", goal: "Long-Term Investor", mutualFriends: 3 },
  { userId: "person_priya", displayName: "Priya S.", username: "priya.saves", goal: "Emergency Fund Hero", mutualFriends: 0 },
  { userId: "person_chris", displayName: "Chris M.", username: "chris.credit", goal: "Credit Climber", mutualFriends: 1 }
];

export const demoCommunityPosts = [
  {
    id: "post_1",
    templateType: "first_budget",
    content: "I completed my first budget.",
    flowerName: "Daisy"
  },
  {
    id: "post_2",
    templateType: "learned_roth_ira",
    content: "I learned what a Roth IRA is.",
    flowerName: "Orchid"
  },
  {
    id: "post_3",
    templateType: "weekly_challenge",
    content: "I completed this week's challenge.",
    flowerName: "Marigold"
  }
];
