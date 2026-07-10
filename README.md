# Financial Garden

Financial Garden is a gamified financial-literacy app. Users build better money habits by completing lessons and quizzes that grow a virtual garden. It rewards learning and consistency, not wealth.

```text
Expo app -> FastAPI -> PostgreSQL
```

The Expo app provides the mobile/web experience. The FastAPI service in `backend/` owns persisted application data, including users, questionnaire responses, learning content, quiz attempts, plants, budgets, and community data. PostgreSQL is the production datastore.

## Run locally

### 1. Start the API and database

Follow the setup instructions in [`backend/README.md`](backend/README.md). The Docker workflow starts FastAPI and PostgreSQL together:

```bash
docker compose up --build
```

The API is available at `http://localhost:8000` on the development machine.

### 2. Configure the Expo app

Copy `.env.example` to `.env` and set the public API URL:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
```

For Android/iOS simulators and physical devices, use an address the device can reach instead of `localhost` (normally your computer's LAN IP), for example:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000
```

### 3. Start Expo

```bash
npm install
npm run start
```

Useful commands:

```bash
npm run ios
npm run android
npm run web
npm run typecheck
```

## Product concept

Users begin with a small garden and expand it through approachable financial education. Learning areas include budgeting, saving, credit and debt, retirement, career money and taxes, and investment fundamentals. The Sunflower companion offers educational explanations, not personalized financial advice.

The project currently uses a demo-authentication flow for hackathon development. Production authentication and other integrations will be added behind FastAPI rather than directly from the Expo client.

The product requirements, feature priorities, privacy rules, and intended demo journey are documented in [`docs/product-spec.md`](docs/product-spec.md).
