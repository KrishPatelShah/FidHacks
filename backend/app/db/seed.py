from uuid import NAMESPACE_URL, UUID, uuid5

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import DEMO_USER_ID
from app.db.session import SessionLocal
from app.models.community import CommunityPost
from app.models.lesson import LearningModule, Lesson, LessonProgress
from app.models.plant import Plant
from app.models.quiz import QuizAttempt, QuizQuestion
from app.models.user import Profile


def _uuid(slug: str) -> UUID:
    """Deterministic UUID for a stable slug so re-seeding is idempotent."""
    return uuid5(NAMESPACE_URL, f"financial-garden:{slug}")


# Quiz questions are keyed by category. Every lesson in a category reuses these
# questions (with lesson-prefixed slugs) so the quiz endpoint always has content
# to serve. This mirrors the frontend offline quiz bank in src/data/quizBank.ts.
CATEGORY_QUIZZES: dict[str, list[dict]] = {
    "budgeting": [
        {
            "prompt": "Why compare expected spending with actual spending?",
            "options": ["To shame yourself for mistakes", "To find useful habit patterns", "To calculate a credit score"],
            "correct_index": 1,
            "explanation": "The gap between planned and real spending is a learning signal that helps explain what changed.",
        },
        {
            "prompt": "Which of these is a 'need' rather than a 'want'?",
            "options": ["A streaming subscription", "Rent or housing", "A concert ticket"],
            "correct_index": 1,
            "explanation": "Needs are essential expenses like housing, food, and utilities; wants are discretionary.",
        },
    ],
    "savings": [
        {
            "prompt": "What is an emergency fund for?",
            "options": ["Expected and unexpected essential expenses", "Only investing", "Increasing credit limits"],
            "correct_index": 0,
            "explanation": "Emergency savings help absorb essential expenses without relying on debt.",
        },
        {
            "prompt": "A common starting goal for an emergency fund is:",
            "options": ["3-6 months of expenses", "10 years of income", "Exactly $50"],
            "correct_index": 0,
            "explanation": "Many guidelines suggest building toward 3-6 months of living expenses over time.",
        },
    ],
    "credit_debt": [
        {
            "prompt": "What does APR describe?",
            "options": ["The yearly cost of borrowing", "A bank account balance", "A credit score"],
            "correct_index": 0,
            "explanation": "APR communicates the annualized cost of borrowing money.",
        },
        {
            "prompt": "Which habit generally helps your credit score?",
            "options": ["Paying bills on time", "Maxing out every card", "Missing payments"],
            "correct_index": 0,
            "explanation": "On-time payments are one of the biggest positive factors in a credit score.",
        },
    ],
    "retirement": [
        {
            "prompt": "What is the usual purpose of a retirement account?",
            "options": ["Long-term retirement saving", "Daily spending", "Avoiding every tax"],
            "correct_index": 0,
            "explanation": "These accounts are designed to support long-term retirement saving goals.",
        },
        {
            "prompt": "An employer match on a 401(k) is best described as:",
            "options": ["Free money toward retirement", "A loan you repay", "A penalty"],
            "correct_index": 0,
            "explanation": "An employer match adds money to your retirement savings when you contribute.",
        },
    ],
    "funds": [
        {
            "prompt": "What does diversification aim to do?",
            "options": ["Spread investment exposure", "Guarantee returns", "Remove all risk"],
            "correct_index": 0,
            "explanation": "Diversification can reduce concentration risk, but it cannot remove all investment risk.",
        },
        {
            "prompt": "An index fund is designed to:",
            "options": ["Track a market index", "Beat the market every year", "Avoid all fees"],
            "correct_index": 0,
            "explanation": "Index funds aim to track the performance of a market index at low cost.",
        },
    ],
}


# Full learning catalog: five modules, ten lessons each. Kept in sync with the
# frontend directory in src/data/Modules/*.ts so the app shows the same content
# whether it reads from the backend or its offline fallback.
MODULES = [
    {
        "slug": "module_budgeting",
        "category": "budgeting",
        "flower_name": "Daisy",
        "title": "Budgeting Basics",
        "sort_order": 1,
        "lessons": [
            {
                "slug": "budgeting-expected-actual",
                "title": "Expected vs. Actual Spending",
                "difficulty": "beginner",
                "summary": "Learn why comparing planned spending with what actually happened is the foundation of every successful budget.",
                "source_url": "https://econumo.com/posts/budget-vs-actual/",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "budgeting-needs-vs-wants",
                "title": "Needs vs. Wants",
                "difficulty": "beginner",
                "summary": "Understand how to separate essential expenses from discretionary spending so you can make smarter financial decisions.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/spending-and-saving",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "budgeting-track-expenses",
                "title": "Tracking Every Dollar",
                "difficulty": "beginner",
                "summary": "Discover practical ways to record your income and expenses so your budget reflects reality instead of guesses.",
                "source_url": "https://www.consumerfinance.gov/owning-a-home/prepare/assess-your-spending/",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "budgeting-fixed-variable",
                "title": "Fixed vs. Variable Expenses",
                "difficulty": "beginner",
                "summary": "Learn which expenses stay consistent each month and which fluctuate so you can plan with confidence.",
                "source_url": "https://www.wellbyfinancial.com/blog/comparing-fixed-variable-costs/",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "budgeting-first-budget",
                "title": "Creating Your First Budget",
                "difficulty": "beginner",
                "summary": "Combine your income, expenses, and financial priorities into your first complete monthly budget.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/how-to-budget",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "budgeting-budget-methods",
                "title": "Choosing a Budgeting Method",
                "difficulty": "intermediate",
                "summary": "Explore budgeting approaches such as percentage-based budgeting and zero-based budgeting to find what works best for you.",
                "source_url": "https://www.nerdwallet.com/article/finance/how-to-budget",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "budgeting-emergency-fund",
                "title": "Building an Emergency Fund",
                "difficulty": "intermediate",
                "summary": "Learn how emergency savings protect your budget from unexpected expenses and reduce financial stress.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/emergency-fund",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "budgeting-irregular-expenses",
                "title": "Planning for Irregular Expenses",
                "difficulty": "intermediate",
                "summary": "Prepare for expenses like holidays, insurance, car repairs, and annual subscriptions before they disrupt your budget.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/savings-plan",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "budgeting-budget-optimization",
                "title": "Improving Your Budget",
                "difficulty": "intermediate",
                "summary": "Analyze spending trends, adjust categories, and continuously improve your budget as your financial goals change.",
                "source_url": "https://www.khanacademy.org/college-careers-more/personal-finance",
                "reward": {"sunlight": 3, "water": 3},
            },
            {
                "slug": "budgeting-long-term-plan",
                "title": "Budgeting for Long-Term Success",
                "difficulty": "intermediate",
                "summary": "Bring everything together by creating a sustainable budget that supports saving, investing, debt repayment, and future financial goals.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/money-management",
                "reward": {"sunlight": 5, "water": 5},
            },
        ],
    },
    {
        "slug": "module_savings",
        "category": "savings",
        "flower_name": "Marigold",
        "title": "Savings + Emergency Fund",
        "sort_order": 2,
        "lessons": [
            {
                "slug": "savings-emergency-fund",
                "title": "Why Emergency Funds Matter",
                "difficulty": "beginner",
                "summary": "Learn how emergency savings protect you from unexpected expenses and provide financial security when life changes.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/emergency-fund",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "savings-saving-goals",
                "title": "Setting Savings Goals",
                "difficulty": "beginner",
                "summary": "Discover how creating clear short-term and long-term savings goals helps you stay motivated and make better financial decisions.",
                "source_url": "https://saversbank.com/resources/savers-two-cents-blog/why-you-need-a-savings-goal-and-how-to-set-one/",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "savings-pay-yourself-first",
                "title": "Pay Yourself First",
                "difficulty": "beginner",
                "summary": "Learn why saving before spending is a powerful habit and how prioritizing savings can improve financial stability.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/5-ways-to-save-more",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "savings-automation",
                "title": "Automating Your Savings",
                "difficulty": "beginner",
                "summary": "Understand how automatic transfers and consistent contributions make saving easier and more reliable.",
                "source_url": "https://www.goamplify.com/blog/moneymanagement/automate-your-savings/",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "savings-right-account",
                "title": "Choosing the Right Savings Account",
                "difficulty": "beginner",
                "summary": "Compare savings accounts, money market accounts, and other cash options to understand where your money can safely grow.",
                "source_url": "https://www.fdic.gov/resources/consumers/money-smart/",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "savings-how-much",
                "title": "How Much Should You Save?",
                "difficulty": "intermediate",
                "summary": "Learn how to estimate an emergency fund target based on your expenses, income stability, and personal situation.",
                "source_url": "https://www.fidelity.com/viewpoints/personal-finance/save-for-an-emergency",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "savings-sinking-funds",
                "title": "Using Sinking Funds",
                "difficulty": "intermediate",
                "summary": "Learn how setting aside money for planned expenses prevents future financial stress.",
                "source_url": "https://justagirlandherblog.com/what-are-sinking-funds/",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "savings-growing-savings",
                "title": "Making Your Savings Grow",
                "difficulty": "intermediate",
                "summary": "Explore how interest, compound growth, and smart account choices can help your savings increase over time.",
                "source_url": "https://landmarkcu.com/blog/how-to-grow-your-savings/",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "savings-common-mistakes",
                "title": "Avoiding Savings Mistakes",
                "difficulty": "intermediate",
                "summary": "Identify common mistakes like inconsistent saving, relying too much on credit, and failing to plan for expenses.",
                "source_url": "https://www.experian.com/blogs/ask-experian/emergency-savings-mistakes-to-avoid/",
                "reward": {"sunlight": 3, "water": 3},
            },
            {
                "slug": "savings-building-wealth",
                "title": "From Saving to Investing",
                "difficulty": "intermediate",
                "summary": "Learn when your emergency savings are established and why investing becomes the next step toward building long-term wealth.",
                "source_url": "https://www.fidelity.com/learning-center/trading-investing/investing-for-beginners",
                "reward": {"sunlight": 5, "water": 5},
            },
        ],
    },
    {
        "slug": "module_credit",
        "category": "credit_debt",
        "flower_name": "Rose",
        "title": "Credit + Debt",
        "sort_order": 3,
        "lessons": [
            {
                "slug": "credit-what-is-credit",
                "title": "Understanding Credit",
                "difficulty": "beginner",
                "summary": "Learn what credit is, why it exists, and how responsible borrowing can help you achieve financial goals.",
                "source_url": "https://www.consumerfinance.gov/consumer-tools/credit-cards/",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "credit-credit-score",
                "title": "Understanding Credit Scores",
                "difficulty": "beginner",
                "summary": "Discover how credit scores are calculated and why they influence loans, housing, and financial opportunities.",
                "source_url": "https://www.myfico.com/credit-education/what-is-a-fico-score",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "credit-credit-report",
                "title": "Reading Your Credit Report",
                "difficulty": "beginner",
                "summary": "Explore what information appears on your credit report and why regularly checking it helps protect your financial health.",
                "source_url": "https://www.annualcreditreport.com/index.action",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "credit-apr",
                "title": "What Is APR?",
                "difficulty": "beginner",
                "summary": "Understand Annual Percentage Rate (APR), how interest works, and why carrying balances can become expensive.",
                "source_url": "https://gosunward.org/articles/apr-meaning/",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "credit-credit-cards",
                "title": "Using Credit Cards Wisely",
                "difficulty": "beginner",
                "summary": "Learn how to use credit cards responsibly while avoiding unnecessary interest, fees, and debt.",
                "source_url": "https://www.greenpath.com/blog/using-credit-cards-wisely/",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "credit-debt-types",
                "title": "Good Debt vs. Bad Debt",
                "difficulty": "intermediate",
                "summary": "Compare common forms of debt including student loans, mortgages, auto loans, and credit cards.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/good-debt-vs-bad-debt",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "credit-paying-off-debt",
                "title": "Strategies to Pay Off Debt",
                "difficulty": "intermediate",
                "summary": "Learn repayment strategies such as the debt snowball and debt avalanche methods.",
                "source_url": "https://dfpi.ca.gov/news/insights/three-steps-to-managing-and-getting-out-of-debt/",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "credit-improve-score",
                "title": "Improving Your Credit Score",
                "difficulty": "intermediate",
                "summary": "Discover habits that improve credit scores, including payment history, credit utilization, and responsible borrowing.",
                "source_url": "https://www.experian.com/blogs/ask-experian/ways-to-improve-credit/",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "credit-avoid-mistakes",
                "title": "Avoiding Common Credit Mistakes",
                "difficulty": "intermediate",
                "summary": "Identify mistakes that damage credit, such as missed payments, high balances, and excessive applications.",
                "source_url": "https://www.experian.com/blogs/ask-experian/common-credit-mistakes-to-avoid/",
                "reward": {"sunlight": 3, "water": 3},
            },
            {
                "slug": "credit-mastering-credit",
                "title": "Mastering Credit & Debt",
                "difficulty": "intermediate",
                "summary": "Combine credit knowledge, debt strategies, and responsible borrowing habits into a long-term financial approach.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/managing-debt",
                "reward": {"sunlight": 5, "water": 5},
            },
        ],
    },
    {
        "slug": "module_retirement",
        "category": "retirement",
        "flower_name": "Orchid",
        "title": "Retirement Accounts",
        "sort_order": 4,
        "lessons": [
            {
                "slug": "retirement-why-save",
                "title": "Why Save for Retirement?",
                "difficulty": "beginner",
                "summary": "Learn why retirement planning starts early and how consistent contributions can grow into meaningful savings over time.",
                "source_url": "https://www.fidelity.com/retirement/retirement-planning",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "retirement-compound-growth",
                "title": "The Power of Compound Growth",
                "difficulty": "beginner",
                "summary": "Discover how investment growth can accelerate over time and why starting early is one of the biggest advantages in retirement planning.",
                "source_url": "https://www.berkeleycapitalmanagement.com/the-power-of-compound-growth/",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "retirement-account-types",
                "title": "Understanding Retirement Accounts",
                "difficulty": "beginner",
                "summary": "Compare retirement accounts such as 401(k)s, Traditional IRAs, and Roth IRAs and understand their different purposes.",
                "source_url": "https://fwccu.org/blog/iras-explained-retirement-planning-basics",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "retirement-401k",
                "title": "How a 401(k) Works",
                "difficulty": "beginner",
                "summary": "Learn how employer-sponsored retirement plans allow employees to save automatically through payroll contributions.",
                "source_url": "https://www.fidelity.com/learning-center/personal-finance/retirement/401k-benefits",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "retirement-match",
                "title": "What Is a 401(k) Match?",
                "difficulty": "beginner",
                "summary": "Understand how employer contributions work and why taking advantage of a company match can accelerate retirement savings.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/average-401k-match",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "retirement-roth-vs-traditional",
                "title": "Roth vs. Traditional",
                "difficulty": "intermediate",
                "summary": "Compare Roth and Traditional retirement accounts by learning when taxes are paid and how withdrawals work.",
                "source_url": "https://www.fidelity.com/retirement-ira/roth-ira",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "retirement-contribution-limits",
                "title": "Contribution Limits",
                "difficulty": "intermediate",
                "summary": "Learn why retirement accounts have yearly contribution limits and how they affect retirement savings strategies.",
                "source_url": "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contributions",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "retirement-withdrawals",
                "title": "Withdrawal Rules",
                "difficulty": "intermediate",
                "summary": "Understand retirement withdrawal rules, taxes, and why accessing retirement money early may have consequences.",
                "source_url": "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions",
                "reward": {"sunlight": 3, "water": 3},
            },
            {
                "slug": "retirement-common-mistakes",
                "title": "Avoiding Retirement Mistakes",
                "difficulty": "intermediate",
                "summary": "Identify common retirement mistakes such as waiting too long to save, missing employer benefits, or ignoring investment choices.",
                "source_url": "https://www.fidelity.com/learning-center/wealth-management-insights/retirement-master-plan",
                "reward": {"sunlight": 4, "water": 3},
            },
            {
                "slug": "retirement-building-plan",
                "title": "Building Your Retirement Plan",
                "difficulty": "intermediate",
                "summary": "Combine retirement accounts, contributions, investing, and long-term goals into a complete retirement strategy.",
                "source_url": "https://www.fidelity.com/retirement-planning/plan-for-retirement",
                "reward": {"sunlight": 5, "water": 5},
            },
        ],
    },
    {
        "slug": "module_investing",
        "category": "funds",
        "flower_name": "Investment Flowers",
        "title": "Risk / Return Ladder",
        "sort_order": 5,
        "lessons": [
            {
                "slug": "investing-why-invest",
                "title": "Why Invest?",
                "difficulty": "beginner",
                "summary": "Learn why investing helps grow wealth over time and how it differs from simply saving money.",
                "source_url": "https://www.fidelity.com/learning-center/trading-investing/investing-for-beginners",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "investing-compound-growth",
                "title": "Compound Growth",
                "difficulty": "beginner",
                "summary": "Understand how investments can grow over time as your earnings generate additional earnings.",
                "source_url": "https://www.fiducientadvisors.com/blog/the-power-of-compounding-how-time-can-be-your-best-investment-ally",
                "reward": {"sunlight": 1, "water": 1},
            },
            {
                "slug": "investing-risk-return",
                "title": "Risk vs. Return",
                "difficulty": "beginner",
                "summary": "Understand why investments with higher potential returns usually involve greater risk.",
                "source_url": "https://www.fidelity.com/learning-center/trading-investing/risk-tolerance",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "investing-asset-classes",
                "title": "Stocks, Bonds, and Cash",
                "difficulty": "beginner",
                "summary": "Compare major investment categories and learn how stocks, bonds, and cash serve different purposes.",
                "source_url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products",
                "reward": {"sunlight": 2, "water": 1},
            },
            {
                "slug": "investing-diversification",
                "title": "Diversification",
                "difficulty": "beginner",
                "summary": "Learn why spreading investments across different assets can help manage risk.",
                "source_url": "https://www.fidelity.com/viewpoints/investing-ideas/guide-to-diversification",
                "reward": {"sunlight": 2, "water": 2},
            },
            {
                "slug": "investing-mutual-funds",
                "title": "Mutual Funds vs. ETFs",
                "difficulty": "intermediate",
                "summary": "Compare mutual funds and ETFs and understand how investors use them to create diversified portfolios.",
                "source_url": "https://www.fidelity.com/viewpoints/investing-ideas/mutual-fund-or-etf",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "investing-index-funds",
                "title": "What Are Index Funds?",
                "difficulty": "intermediate",
                "summary": "Learn how index funds track market indexes and why many long-term investors choose passive investing strategies.",
                "source_url": "https://www.fidelity.com/learning-center/smart-money/what-is-an-index-fund",
                "reward": {"sunlight": 3, "water": 2},
            },
            {
                "slug": "investing-risk-tolerance",
                "title": "Finding Your Risk Level",
                "difficulty": "intermediate",
                "summary": "Discover how your goals, timeline, and comfort with market changes affect investment decisions.",
                "source_url": "https://www.mheducation.com/highered/blog/2025/06/whats-your-risk-tolerance-how-to-figure-it-out-before-you-invest.html",
                "reward": {"sunlight": 3, "water": 3},
            },
            {
                "slug": "investing-long-term",
                "title": "Investing for the Long Term",
                "difficulty": "intermediate",
                "summary": "Learn why patience, consistency, and avoiding emotional decisions are important for successful investing.",
                "source_url": "https://www.bny.com/wealth/global/en/insights/benefits-of-investing.html",
                "reward": {"sunlight": 4, "water": 3},
            },
            {
                "slug": "investing-building-portfolio",
                "title": "Building Your First Portfolio",
                "difficulty": "intermediate",
                "summary": "Combine asset allocation, diversification, and risk management to understand how a simple portfolio is created.",
                "source_url": "https://www.ml.com/articles/how-to-build-investment-portfolio.html",
                "reward": {"sunlight": 5, "water": 5},
            },
        ],
    },
]

# A fresh demo account starts with an empty clearing: the five learnable flower
# beds exist so quizzes have something to grow, but nothing has bloomed yet.
# This keeps the player's starting flower count at 0 when the backend is running,
# while friends remain static dummy data. Progress accrues as quizzes are passed.
PLANTS = [
    {
        "id": UUID("10000000-0000-0000-0000-000000000001"),
        "type": "budgeting",
        "flower_name": "Daisy",
        "stage": 0,
        "growth": 0,
        "quantity": 0,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000002"),
        "type": "savings",
        "flower_name": "Marigold",
        "stage": 0,
        "growth": 0,
        "quantity": 0,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000003"),
        "type": "credit_debt",
        "flower_name": "Rose",
        "stage": 0,
        "growth": 0,
        "quantity": 0,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000004"),
        "type": "retirement",
        "flower_name": "Orchid",
        "stage": 0,
        "growth": 0,
        "quantity": 0,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
    {
        "id": UUID("10000000-0000-0000-0000-000000000005"),
        "type": "funds",
        "flower_name": "Purple Tulip",
        "stage": 0,
        "growth": 0,
        "quantity": 0,
        "water": 0,
        "sunlight": 0,
        "fertilizer": 0,
        "unlocked": False,
    },
]


def _upsert(db: Session, model: type, key: UUID, values: dict) -> None:
    instance = db.get(model, key)
    if instance is None:
        db.add(model(id=key, **values))
        return
    for field, value in values.items():
        setattr(instance, field, value)


def _upsert_by_slug(db: Session, model: type, slug: str, values: dict):
    """Upsert a slugged row, matching on the unique slug rather than the id.

    Earlier seeds inserted these rows with different hard-coded UUIDs, so keying
    on the id would collide with the existing rows' unique slug. Matching on slug
    updates the existing row in place (preserving its id for any children that
    already reference it) and only mints a deterministic uuid5 id for new rows.
    The row is flushed so its id is available to child inserts while autoflush is
    disabled.
    """
    instance = db.scalar(select(model).where(model.slug == slug))
    if instance is None:
        instance = model(id=_uuid(slug), slug=slug, **values)
        db.add(instance)
        db.flush()
        return instance
    for field, value in values.items():
        setattr(instance, field, value)
    return instance


def seed(db: Session) -> None:
    _upsert(
        db,
        Profile,
        DEMO_USER_ID,
        {
            "display_name": "Demo Gardener",
            "streak_count": 0,
            "last_activity_date": None,
            "current_path": "beginner",
            "garden_visibility": "friends",
        },
    )

    # Flush the parent profile row before inserting anything that references it.
    # The session runs with autoflush disabled and the models declare no ORM
    # relationships, so SQLAlchemy cannot infer FK insert ordering on its own and
    # would otherwise try to insert child rows (plants, community posts) first.
    db.flush()

    # Reset the demo user's earned progress so every fresh start begins with an
    # empty garden (0 flowers, 0 lessons, 0 quizzes). Friends stay as static
    # dummy data on the client; only the player's own account is reset here.
    for progress in db.scalars(select(LessonProgress).where(LessonProgress.user_id == DEMO_USER_ID)).all():
        db.delete(progress)
    for attempt in db.scalars(select(QuizAttempt).where(QuizAttempt.user_id == DEMO_USER_ID)).all():
        db.delete(attempt)

    for plant in PLANTS:
        values = {key: value for key, value in plant.items() if key != "id"}
        values["user_id"] = DEMO_USER_ID
        _upsert(db, Plant, plant["id"], values)

    for order, module in enumerate(MODULES, start=1):
        module_row = _upsert_by_slug(
            db,
            LearningModule,
            module["slug"],
            {
                "category": module["category"],
                "flower_name": module["flower_name"],
                "title": module["title"],
                "sort_order": module.get("sort_order", order),
            },
        )
        for lesson_order, lesson in enumerate(module["lessons"], start=1):
            lesson_row = _upsert_by_slug(
                db,
                Lesson,
                lesson["slug"],
                {
                    "module_id": module_row.id,
                    "category": module["category"],
                    "title": lesson["title"],
                    "sort_order": lesson_order,
                    "difficulty": lesson["difficulty"],
                    "content_type": lesson.get("content_type", "reading"),
                    "source_url": lesson.get("source_url"),
                    "summary": lesson["summary"],
                    "reward": lesson["reward"],
                },
            )
            for question_index, question in enumerate(CATEGORY_QUIZZES.get(module["category"], []), start=1):
                _upsert_by_slug(
                    db,
                    QuizQuestion,
                    f"{lesson['slug']}-q{question_index}",
                    {
                        "lesson_id": lesson_row.id,
                        "prompt": question["prompt"],
                        "options": question["options"],
                        "correct_index": question["correct_index"],
                        "explanation": question["explanation"],
                    },
                )

    # Remove stale rows from earlier, smaller seeds so the catalog exactly
    # matches this file. FK cascades clean up their child questions/progress.
    valid_module_slugs = {module["slug"] for module in MODULES}
    valid_lesson_slugs = {lesson["slug"] for module in MODULES for lesson in module["lessons"]}
    valid_question_slugs = {
        f"{lesson['slug']}-q{index}"
        for module in MODULES
        for lesson in module["lessons"]
        for index in range(1, len(CATEGORY_QUIZZES.get(module["category"], [])) + 1)
    }
    for question_row in db.scalars(select(QuizQuestion)).all():
        if question_row.slug not in valid_question_slugs:
            db.delete(question_row)
    for lesson_row in db.scalars(select(Lesson)).all():
        if lesson_row.slug not in valid_lesson_slugs:
            db.delete(lesson_row)
    for module_row in db.scalars(select(LearningModule)).all():
        if module_row.slug not in valid_module_slugs:
            db.delete(module_row)

    _upsert(
        db,
        CommunityPost,
        UUID("50000000-0000-0000-0000-000000000001"),
        {
            "user_id": DEMO_USER_ID,
            "template_type": "lesson_completed",
            "content": "I learned what a Roth IRA is.",
        },
    )

    db.commit()


def main() -> None:
    with SessionLocal() as db:
        seed(db)


if __name__ == "__main__":
    main()
