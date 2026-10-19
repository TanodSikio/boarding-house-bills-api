# Tindahan Ledger API

Version: **1.0.0**

The API uses the same Supabase Auth project and Postgres database as the web app and phone app. Send `Authorization: Bearer <access-token>` from the phone client. Browser requests can use the Supabase session cookie. Roles are read from the `profiles` table; new accounts receive the `client` role.

Base URL: `http://localhost:3000`

| Method | Path | Access | Success | Other responses |
| --- | --- | --- | --- | --- |
| GET | `/api/me` | Signed in | `200` profile JSON | `401` unauthenticated |
| GET | `/api/customers` | Signed in | `200` customer array | `401` unauthenticated |
| POST | `/api/customers` | Admin | `201` created customer | `400` invalid JSON/body, `401` unauthenticated, `403` client |
| GET | `/api/customers/{id}` | Signed in | `200` customer | `401` unauthenticated, `404` missing customer |
| GET | `/api/customers/{id}/entries` | Signed in | `200` entries array | `401` unauthenticated, `404` missing customer |
| POST | `/api/customers/{id}/entries` | Admin | `201` created entry | `400` invalid body or payment exceeds balance, `401` unauthenticated, `403` client, `404` missing customer |

## Request bodies

Create a customer:

```json
{ "name": "Aling Nena", "balance": 340.00 }
```

Record a due or a payment:

```json
{ "kind": "due", "amount": 50.00 }
```

`kind` is `due` or `payment`. Amounts must be positive. A due increases the balance; a payment decreases it and cannot exceed the current balance. Each accepted operation creates an immutable history row and updates the balance in one database transaction.

## Local setup

Copy `.env.example` to `.env` and fill in the Supabase URL, publishable key, and database URL. In Supabase, disable email confirmation for the class demo and create your account. After signing in once, promote your instructor-designated admin account in the SQL Editor (replace the address):

```sql
update public.profiles set role = 'admin' where email = 'your-admin@example.com';
```

Then apply the schema with:

```sh
npx drizzle-kit push
npm run dev
```

Do not commit `.env`. New sign-ups are always clients; promote only the intended admin directly in the database.
