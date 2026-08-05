"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Database, Download, FileText, Server, TabletSmartphone } from "lucide-react";

interface SetupGuide {
  name: string;
  description: string;
  icon: React.ElementType;
  tint: string;
  guide: string;
}

const guides: SetupGuide[] = [
  {
    name: "FastAPI",
    description: "Backend service setup — Python 3.12, uvicorn & Alembic.",
    icon: Server,
    tint: "bg-teal-subtle text-teal",
    guide: `## About
The PawCare backend is a FastAPI service exposing REST endpoints for
auth, pets, appointments, vaccinations and health records. Generated
code targets Python 3.12 with fully typed Pydantic v2 models.

## Prerequisites
- Python 3.12+
- uv (or pip + venv)
- PostgreSQL 16 running locally (see PostgreSQL guide)
- A .env file with DATABASE_URL and JWT_SECRET

## Installation
\`\`\`bash
git clone https://github.com/ram/agilecoder pawcare-api
cd pawcare-api/backend

uv venv && source .venv/bin/activate
uv pip install -r requirements.txt

# run database migrations
alembic upgrade head

# start the dev server
uvicorn app.main:app --reload --port 8000
\`\`\`

## Project Structure
\`\`\`
backend/
├── app/
│   ├── main.py            # FastAPI app factory & routers
│   ├── core/              # settings, security, JWT
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic request/response schemas
│   ├── api/
│   │   ├── auth.py        # sign up / sign in / OTP
│   │   ├── pets.py        # pet profiles & records
│   │   └── appointments.py
│   └── services/          # business logic
├── alembic/               # migrations
└── tests/                 # pytest suite
\`\`\``,
  },
  {
    name: "PostgreSQL",
    description: "Database provisioning — schema, roles & seed data.",
    icon: Database,
    tint: "bg-brand-subtle text-brand",
    guide: `## About
PawCare uses PostgreSQL 16 as its primary datastore. The schema covers
users, pets, visits, vaccinations, reminders and audit logs, with
row-level security prepared for multi-workspace isolation.

## Prerequisites
- PostgreSQL 16+ (Docker or native install)
- psql CLI on your PATH
- Superuser access to create roles and databases

## Installation
\`\`\`bash
# start postgres via docker
docker run --name pawcare-db \\
  -e POSTGRES_PASSWORD=pawcare_dev \\
  -e POSTGRES_DB=pawcare \\
  -p 5432:5432 -d postgres:16

# create the application role
psql -h localhost -U postgres -c \\
  "CREATE ROLE pawcare_app LOGIN PASSWORD 'app_secret';"

# apply the generated schema & seed data
psql -h localhost -U postgres -d pawcare -f db/schema.sql
psql -h localhost -U postgres -d pawcare -f db/seed.sql
\`\`\`

## Project Structure
\`\`\`
db/
├── schema.sql             # tables, indexes, constraints
├── seed.sql               # demo pets, vets & appointments
├── policies.sql           # row-level security policies
└── migrations/
    ├── 0001_init.sql
    ├── 0002_vaccinations.sql
    └── 0003_reminders.sql
\`\`\``,
  },
  {
    name: "React Native",
    description: "Mobile app setup — Expo, TypeScript & design tokens.",
    icon: TabletSmartphone,
    tint: "bg-info-subtle text-info",
    guide: `## About
The PawCare mobile app is an Expo (React Native) project written in
TypeScript. It ships with the generated design tokens, navigation
stack, auth flows and API client wired to the FastAPI backend.

## Prerequisites
- Node.js 20+
- Expo CLI (npx expo)
- Xcode 16 (iOS) and/or Android Studio (Android)
- Backend running on http://localhost:8000

## Installation
\`\`\`bash
cd pawcare-app

npm install

# copy environment defaults
cp .env.example .env.local

# start the dev client
npx expo start

# run on a simulator
npx expo run:ios      # or: npx expo run:android
\`\`\`

## Project Structure
\`\`\`
app/
├── (auth)/                # sign in, OTP, onboarding
├── (tabs)/
│   ├── home.tsx           # dashboard & health summary
│   ├── appointments.tsx   # booking & reminders
│   └── pets.tsx           # pet profiles
├── components/            # generated UI kit
├── lib/
│   ├── api.ts             # typed API client
│   └── tokens.ts          # design tokens
└── assets/                # icons & illustrations
\`\`\``,
  },
];

export function SetupFilesTab() {
  const [openGuide, setOpenGuide] = useState<SetupGuide | null>(null);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold">Setup files</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Generated environment guides for every layer of the PawCare stack.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <div
            key={g.name}
            className="flex flex-col rounded-xl border bg-card p-4 shadow-elevation-low"
          >
            <span
              className={`inline-flex size-9 items-center justify-center rounded-lg ${g.tint}`}
            >
              <g.icon className="size-4.5" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-semibold">{g.name}</p>
            <p className="mt-0.5 flex-1 text-xs text-muted-foreground">
              {g.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-fit"
              onClick={() => setOpenGuide(g)}
            >
              <FileText className="size-3.5" aria-hidden />
              View guide
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={openGuide !== null}
        onOpenChange={(o) => !o && setOpenGuide(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{openGuide?.name} setup guide</DialogTitle>
            <DialogDescription>
              Generated for PawCare — follow top to bottom on a fresh machine.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55svh] overflow-y-auto rounded-lg border bg-muted/40 p-4">
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {openGuide?.guide}
            </pre>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (openGuide) {
                  navigator.clipboard.writeText(openGuide.guide);
                  toast.success("Guide copied to clipboard");
                }
              }}
            >
              <Copy className="size-3.5" aria-hidden />
              Copy to clipboard
            </Button>
            <Button
              onClick={() =>
                toast.success(`Downloading ${openGuide?.name} guide…`)
              }
            >
              <Download className="size-3.5" aria-hidden />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
