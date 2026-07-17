# Flourish

**1st Place Winner at FidHacks**

Flourish is a gamified financial literacy app that helps users build better money habits by growing a virtual garden. Instead of making finance feel intimidating, the app turns learning, budgeting, quizzes, and reflection into visible progress.

The garden rewards consistency and learning, not wealth.

```text
Learn -> Take Quiz -> Earn Garden Resources -> Grow Flowers -> Unlock New Financial Areas
```

## Run Locally

```bash
npm install
npm run start
```

Useful scripts:

```bash
npm run ios
npm run android
npm run web
npm run typecheck
```

## Backend (FastAPI + Postgres)

The app is wired to a local FastAPI backend (see `backend/` and `docker-compose.yml`).

```bash
docker compose up --build        # starts Postgres + the API on http://localhost:8000
```

Point the app at the backend by copying `.env.example` to `.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000/api
```

The app signs in as a demo user automatically, hydrates the garden from Postgres, and routes the Sunflower chat and receipt scanning through the backend. If the backend is offline, the app falls back to local demo data so it always runs.

Gemini is never called directly from the mobile app. The Gemini key lives only on the backend. Set `GEMINI_API_KEY` in `backend/.env` to enable real receipt OCR (`POST /api/receipts/scan`); otherwise a built-in demo receipt is returned.

## App Concept

Users begin with a simple flower. As they complete financial literacy lessons, take quizzes, track their budget, and build consistent habits, their garden grows.

Flowers grow in number and variety, not height. For example:

- 1 Daisy means the user started budgeting basics.
- 3 Daisies means the user completed multiple budgeting lessons.
- 5 Daisies means the budgeting basics milestone is complete.

The garden becomes a visual representation of financial growth. It does not show personal dollar amounts, but it does show progress, consistency, and learning milestones.

## Core Experience

Users grow the garden by completing small actions:

- Watching a short lesson.
- Passing a quiz.
- Logging expected spending.
- Comparing expected vs. actual spending.
- Completing a weekly challenge.
- Asking the Sunflower AI companion a finance question.
- Reaching a financial literacy milestone.

Reward mapping:

| Action | Reward |
| --- | --- |
| Complete lesson | Sunlight |
| Pass quiz | Water |
| Log budget | Fertilizer |
| Complete weekly challenge | Bonus growth |
| Finish a module | New flower unlocked |

## Streaks Without Punishment

The app uses Duolingo-style streaks for motivation, but avoids punishing users for missing a day. Missing a day does not kill the garden or reset progress. It simply pauses growth.

The goal is consistency, not perfection.

## Screen Map

### 1. Welcome / Landing Screen

Purpose: introduce the app quickly and visually.

What users see:

- App name.
- Tagline: `Grow your money knowledge one habit at a time.`
- Simple garden illustration.
- `Get Started` button.
- `Log In` button.
- Starting flower in a small pot with the Sunflower AI companion nearby.

### 2. Sign Up / Login Screen

Purpose: let users create an account and save progress.

Implementation:

- Demo auth against the FastAPI backend (`POST /api/auth/demo`).
- Support email/password sign up and login UI (demo flow).
- Include `Continue as Demo User`.

Data saved:

- User account.
- Garden progress.
- Streak.
- Quiz scores.
- Budget data.
- Flower unlocks.
- Flower EXP and flower quantity.

### 3. First Login Questionnaire Screen

Purpose: gauge the user's financial experience and personalize the starting path.

Format: 1-5 confidence ratings for each flower category.

Questions:

- Daisy, Budgeting Basics: "How confident are you with creating and following a budget?"
- Marigold, Savings + Emergency Fund: "How confident are you with saving money or building an emergency fund?"
- Rose, Credit + Debt: "How confident are you with credit cards, credit scores, APR, and debt?"
- Orchid, Retirement Accounts: "How confident are you with Roth IRAs, 401(k)s, and employer matches?"
- Blue Iris, Career Money + Taxes: "How confident are you with paychecks, taxes, benefits, and take-home pay?"
- Investment Flowers: "How confident are you with savings accounts, bonds, index funds, mutual funds, and stocks?"

Other questionnaire inputs:

- Whether the user has used a debit card or credit card.
- Whether they know what a Roth IRA, 401(k), stocks, bonds, or funds are.
- Current budgeting habits.
- Primary financial goal.
- Confidence level with money decisions.

Primary goals:

- Save money.
- Learn investing.
- Pay off debt.
- Prepare for career.
- Build budgeting habits.

Output:

- Beginner path.
- Intermediate path.
- Advanced path.
- Recommended starting modules.

Example: if a user rates budgeting and credit low, recommend the Daisy and Rose modules first.

### 4. Home / Garden Dashboard

Purpose: main screen of the app.

What users see:

- Current garden.
- Streak count.
- Weekly challenge.
- Recommended next action.
- Current garden resources.
- Unlocked flowers.
- Sunflower AI companion button.

Main widgets:

- Garden preview.
- `Continue Lesson` card.
- `Review Budget` card.
- `Ask Sunflower` button.
- `Weekly Challenge` card.
- Streak indicator.

### 5. Garden Detail Screen

Purpose: show what each flower means and how the user unlocked it.

Flower meanings:

| Flower | Category | Meaning |
| --- | --- | --- |
| Sunflower | AI Companion | Always-visible helper |
| Daisy | Budgeting Basics | Budgeting and expected vs. actual spending |
| Marigold | Savings + Emergency Fund | Saving goals and emergency fund knowledge |
| Rose | Credit + Debt | Credit cards, credit score, APR, and debt |
| Orchid | Retirement Accounts | Roth IRA, 401(k), employer match |
| Blue Iris | Career Money + Taxes | Paychecks, taxes, benefits, income decisions |
| White Lily | Cash / Savings Account | Lowest risk, lowest return |
| Blue Hydrangea / Bluebell | Bonds | Low-to-moderate risk |
| Purple Tulip | Mutual Funds / Index Funds | Diversified, medium risk |
| Red Poppy | Individual Stocks | Highest risk, highest return potential |

Interaction:

- Tap a flower to see category name.
- Show lessons completed.
- Show quiz score.
- Show progress percentage.
- Show what action grows that flower next.

Example: tapping a Rose shows, "You have completed 2 of 5 Credit + Debt lessons. Complete the APR quiz to earn another Rose."

### 6. Learning Path Screen

Purpose: organize financial literacy resources.

Modules:

- Daisy, Budgeting Basics: what is a budget, expected vs. actual spending, spending categories, better money habits.
- Marigold, Savings + Emergency Fund: why savings matter, emergency fund basics, short-term goals, saving consistently.
- Rose, Credit + Debt: debit vs. credit cards, credit scores, APR, responsible credit use, debt repayment basics.
- Orchid, Retirement Accounts: Roth IRA, 401(k), employer matching, why retirement saving starts early.
- Blue Iris, Career Money + Taxes: reading a paycheck, taxes and take-home pay, benefits basics, salary decisions.
- Investment Flowers, Risk / Return Ladder: savings accounts, bonds, mutual funds, index funds, individual stocks, risk vs. return.

Resource style:

- 1-3 minute video or reading.
- 3-5 question quiz.
- One simple takeaway.
- Ideally use or link to beginner-friendly educational content from Fidelity or similarly reputable finance education sources.

### 7. Lesson Screen

Purpose: teach one concept at a time.

What users see:

- Lesson title.
- Short explanation or embedded video.
- Key terms with tap explanations.
- `Take Quiz` button.

Example lesson: `What is APR?`

Highlighted terms:

- APR.
- Interest.
- Minimum payment.
- Credit card balance.

### 8. Quiz / Knowledge Check Screen

Purpose: make sure the user learned the concept.

What users see:

- 3-5 multiple choice questions.
- Immediate feedback.
- Explanation for wrong answers.
- Retry option.
- Reward animation after passing.

Example question: "What is the main difference between a debit card and a credit card?"

### 9. Budget Dashboard Screen

Purpose: help users compare planned spending against actual spending.

Budget categories:

- Savings and Investments.
- Living Expenses.
- Education and Career.
- Lifestyle.
- Debt.
- Taxes.

Each category shows:

- Expected amount or percentage.
- Actual amount or percentage.
- Difference.

UI approach:

- Use a toggle: `Expected | Actual | Difference`.
- This is cleaner than showing too much in one pie chart.

Example insight: "You planned 15% for Lifestyle but spent 25%. Want to review what changed?"

The gap between expected and actual spending is the teachable moment. The goal is not to shame the user, but to help them understand their habits.

### 10. Budget Input Screen

Purpose: let users enter expected and actual spending.

Inputs per category:

- Expected spending.
- Actual spending.

Hackathon simplification:

- No real bank linking.
- Manual entry only.
- Include `Use Sample Budget` so judges can instantly see the chart.

### 11. AI Financial Companion Screen

Purpose: provide beginner-friendly financial explanations.

Companion identity:

- Sunflower.
- Friendly, bright, recognizable, and theme-consistent.
- Always available as a floating or potted companion icon.

The AI can answer:

- "What is a Roth IRA?"
- "What is APR?"
- "What is the difference between stocks and bonds?"
- "Why did my actual spending differ from my expected spending?"
- "Which lesson should I take next?"

The AI should avoid:

- "Buy this stock."
- "Invest this exact amount."
- "Choose this retirement account for your personal situation."

Positioning: the Sunflower explains, reflects, and recommends lessons inside the app. It is an educational companion, not a financial advisor.

System prompt:

```text
You are a financial literacy tutor. Explain concepts in beginner-friendly language. Do not give personalized investment, tax, or legal advice. Recommend relevant app lessons when helpful.
```

### 12. Jargon Translator Feature

Purpose: help users understand financial terms without leaving the screen.

UI idea:

- Financial terms appear underlined or in a different color.
- Tapping a term opens a tooltip, modal, or popover.
- On web this could use the HTML `title` attribute.
- In React Native, use a small modal, popover, or tooltip component.

Example terms:

- Roth IRA.
- APR.
- 401(k).
- Index fund.
- Bond.
- Credit utilization.
- Vesting.
- Employer match.

Example tooltip: `APR: The yearly cost of borrowing money, shown as a percentage.`

### 13. Weekly Challenge Screen

Purpose: give users a reason to return even if they do not use the app daily.

Example challenges:

- Create your first weekly budget.
- Learn the difference between debit and credit cards.
- Review one actual spending category.
- Complete one investing lesson.
- Ask the Sunflower one finance question.
- Learn what a 401(k) match means.
- Identify one unnecessary expense.
- Complete a taxes basics quiz.

Rewards:

- Bonus sunlight, water, or fertilizer.
- Special badge.
- Extra flower growth.
- Streak protection or streak boost.

### 14. Social Garden Screen

Purpose: let users view each other's gardens for motivation.

Privacy rule: never show income, savings amount, debt amount, spending amount, or net worth.

What users can see:

- Garden stage.
- Flower types unlocked.
- Number of milestones completed.
- Weekly challenge badges.
- Streak level.

This creates soft motivation without turning financial progress into unhealthy comparison.

### 15. Community Posts Screen

Purpose: let users share learning milestones.

Recommended version: milestone-based posts instead of open-ended social posting.

Example post templates:

- "I completed my first budget."
- "I learned what a Roth IRA is."
- "I finished my first credit card lesson."
- "I started learning about investing."
- "I completed this week's challenge."

Hackathon simplification: use sample seeded posts from the database instead of building a full moderation-heavy social feed.

## Navigation

Use bottom tab navigation with five tabs:

- Garden.
- Learn.
- Budget.
- Community.
- Profile.

The Sunflower AI companion can be a floating button available on most screens.

## Flower System

### Sunflower = AI Financial Companion

- Color: bright yellow.
- Role: helper and guide, not a progress category.
- Appearance: always-visible potted sunflower companion.

### Daisy = Budgeting Basics

- Topics: budgeting, expected vs. actual spending, spending categories, money habits.
- Color: white petals, yellow center.
- Fit: starter flower for the most basic money skill.
- Growth triggers: first budget, spending log, expected vs. actual review, budgeting lessons and quizzes.

### Marigold = Savings + Emergency Fund

- Topics: saving money, emergency funds, short-term savings goals.
- Color: orange/gold.
- Fit: resilient, protective metaphor for savings security.
- Growth triggers: savings goal, emergency fund lesson, savings milestones, savings quizzes.

### Rose = Credit + Debt

- Topics: credit cards, credit scores, APR, debt, interest, repayment.
- Color: red or deep pink.
- Fit: valuable but risky, like credit.
- Growth triggers: credit score lessons, responsible card usage, APR/debt lessons, credit quizzes.

### Orchid = Retirement Accounts

- Topics: Roth IRA, 401(k), employer match, retirement planning.
- Color: purple.
- Fit: advanced, elegant, long-term.
- Growth triggers: Roth IRA vs. 401(k), employer match, retirement modules, advanced retirement lessons.

### Blue Iris = Career Money + Taxes

- Topics: paychecks, taxes, take-home pay, benefits, salary basics, career-money decisions.
- Color: blue.
- Fit: professional and structured.
- Growth triggers: paycheck lessons, tax lessons, benefits lessons, career-money quizzes.

### Investment Flowers = Risk / Return Ladder

| Flower | Investment Area | Meaning | Risk / Return |
| --- | --- | --- | --- |
| White Lily | Savings Account / Cash | Safest, smallest growth | Lowest risk / lowest growth |
| Blue Hydrangea or Bluebell | Bonds | More growth than savings, still relatively safe | Low-to-moderate risk |
| Purple Tulip | Mutual Funds / Index Funds | Balanced, diversified, moderate growth | Medium risk / medium return |
| Red Poppy | Individual Stocks / Shares | Bold, high-risk, high-reward potential | Highest risk / highest potential return |

## Recommended Tech Stack

### Frontend

- React Native + Expo for quick phone interfaces.
- TypeScript.
- Expo Router or React Navigation.
- NativeWind, React Native StyleSheet, React Native Paper, or Tamagui for UI.
- `react-native-svg` for early garden visuals.
- Lottie for watering, sunlight, and flower unlock animations.

Garden rendering options:

- Simple demo: static SVG or PNG flower assets.
- Better: SVG components with `react-native-svg`.
- Most polished: Lottie animations for rewards and unlocks.
- Larger/zoomable garden: consider a PixiJS-style 2D rendering approach if targeting web, or a native canvas/game rendering library for mobile.

### Charts

Do not rely on Recharts for a native mobile demo.

Options:

- `react-native-gifted-charts`: best for a fast hackathon build.
- Victory Native XL: better for more custom chart interactions.

Recommendation: use Gifted Charts for speed.

### Backend

A local FastAPI service backed by PostgreSQL (see `backend/` and `docker-compose.yml`) provides:

- Demo auth.
- Postgres database.
- User profiles.
- Garden progress (plants + growth).
- Lessons.
- Quiz results.
- Budget entries.
- Community posts.

Tables are defined as SQLAlchemy models under `backend/app/models/` and created via Alembic migrations.

### AI Layer

Gemini is called through the FastAPI backend so the API key stays server-side.

Flow:

```text
React Native app -> FastAPI backend -> Gemini API -> Response back to app
```

## Data Model

### Plant

```ts
type PlantCategory =
  | "budgeting"
  | "savings"
  | "credit_debt"
  | "retirement"
  | "career_taxes"
  | "cash"
  | "bonds"
  | "funds"
  | "stocks";

type Plant = {
  id: string;
  userId: string;
  type: PlantCategory;
  flowerName: string;
  stage: number;
  growth: number; // 0 to 100
  quantity: number; // number of flowers shown
  water: number;
  sunlight: number;
  fertilizer: number;
  unlocked: boolean;
  createdAt: string;
  updatedAt: string;
};
```

Example:

```ts
const budgetingPlant: Plant = {
  id: "plant_001",
  userId: "user_001",
  type: "budgeting",
  flowerName: "Daisy",
  stage: 2,
  growth: 68,
  quantity: 3,
  water: 3,
  sunlight: 2,
  fertilizer: 1,
  unlocked: true,
  createdAt: "2026-07-09T00:00:00Z",
  updatedAt: "2026-07-09T00:00:00Z"
};
```

### User Profile

```ts
type UserProfile = {
  id: string;
  displayName: string;
  streakCount: number;
  lastActivityDate: string;
  currentPath: "beginner" | "intermediate" | "advanced";
  gardenVisibility: "private" | "friends" | "public";
};
```

### Questionnaire Responses

```ts
type QuestionnaireResponses = {
  userId: string;
  budgetingConfidence: number;
  savingsConfidence: number;
  creditDebtConfidence: number;
  retirementConfidence: number;
  careerTaxesConfidence: number;
  investingConfidence: number;
  primaryGoal:
    | "save_money"
    | "learn_investing"
    | "pay_off_debt"
    | "prepare_for_career"
    | "build_budgeting_habits";
};
```

### Budget Entry

```ts
type BudgetCategory =
  | "savings_investments"
  | "living_expenses"
  | "education_career"
  | "lifestyle"
  | "debt"
  | "taxes";

type BudgetEntry = {
  id: string;
  userId: string;
  category: BudgetCategory;
  expectedAmount: number;
  actualAmount: number;
  month: string; // "2026-07"
};
```

### Lesson

```ts
type Lesson = {
  id: string;
  category: PlantCategory;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  contentType: "video" | "reading" | "interactive";
  sourceUrl?: string;
  reward: {
    sunlight?: number;
    water?: number;
    fertilizer?: number;
  };
};
```

## Database Table Sketch

### `plants`

| Column | Type |
| --- | --- |
| id | uuid |
| user_id | uuid |
| type | text |
| flower_name | text |
| stage | int |
| growth | int |
| quantity | int |
| water | int |
| sunlight | int |
| fertilizer | int |
| unlocked | boolean |
| created_at | timestamp |
| updated_at | timestamp |

### `budget_entries`

| Column | Type |
| --- | --- |
| id | uuid |
| user_id | uuid |
| category | text |
| expected_amount | numeric |
| actual_amount | numeric |
| month | text |
| created_at | timestamp |

### `quiz_attempts`

| Column | Type |
| --- | --- |
| id | uuid |
| user_id | uuid |
| lesson_id | uuid |
| score | int |
| passed | boolean |
| created_at | timestamp |

### `community_posts`

| Column | Type |
| --- | --- |
| id | uuid |
| user_id | uuid |
| template_type | text |
| content | text |
| created_at | timestamp |

The complete schema lives in the SQLAlchemy models under `backend/app/models/` and the Alembic migrations in `backend/alembic/`.

## MVP Build Priority

Must build:

- Login / signup.
- First login questionnaire.
- Garden dashboard.
- Flower category system.
- Learning modules.
- Quizzes.
- Budget input.
- Expected vs. actual chart.
- Sunflower AI companion.
- Basic profile and streak tracking.

Nice to have:

- Social garden viewing.
- Community posts.
- Weekly challenges.
- Jargon translator.
- Animations for watering, sunlight, and fertilizer.

Cut first if time is tight:

- Open-ended posts.
- Friend requests.
- Real bank linking.
- Complex investment simulators.
- Heavy garden animations.

## Best Demo Flow

1. User signs up.
2. User answers the confidence questionnaire.
3. App recommends the beginner path.
4. User starts with the Daisy budgeting module.
5. User completes a short lesson.
6. User passes a quiz.
7. Garden earns sunlight and water.
8. Daisy count increases from 1 to 2.
9. User enters expected vs. actual budget.
10. Pie chart shows the difference.
11. User asks Sunflower: "Why did I spend more than expected?"
12. Sunflower explains and recommends a budgeting lesson.
13. User views another person's garden with no dollar amounts shown.

This demo shows the app's value: learning, budgeting, AI help, and visual growth all connected.

## Why This Works

Flourish combines proven engagement patterns:

- Duolingo-style streaks for consistency.
- Garden growth for visual progress.
- Quiz-based learning for retention.
- Budget tracking for real financial habits.
- AI support for beginner-friendly explanations.
- Community gardens for soft motivation without exposing private financial data.

The key difference is that the app does not teach finance through static lessons only. It turns financial literacy into an interactive growth system where users build habits, unlock plants, and see progress visually.

## Main Value Proposition

Flourish makes personal finance less intimidating by turning learning and budgeting into a game-like experience. Users grow a virtual garden by completing lessons, building streaks, passing quizzes, tracking budgets, and reflecting on financial decisions.

The app rewards consistency and learning, not wealth. This makes it accessible, encouraging, and useful for beginners.
