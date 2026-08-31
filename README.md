# Quote Command Center

Redesign the existing /admin dashboard so it is an operations dashboard for the vehicle-insurance website.

IMPORTANT:

Use ONLY legitimate customer/quote information that is already collected by the public insurance website.

DASHBOARD STRUCTURE

1. LEFT SIDEBAR

Create a clean sidebar titled:

"Admin Dashboard"

Subtitle:

"Insurance Operations"

Navigation:

- Overview

- Live Quotes

- Customers

- Vehicles

- Insurance Offers

- Sessions

Show simple counters beside relevant sections.

2. TOP BAR

Include:

- Search field: "Search by quote ID, phone, national ID..."

- Refresh button

- Admin/user menu

- Sign out button

3. OVERVIEW CARDS

Display:

- Total active sessions

- New quotes

- Customers

- Completed quotes

- Pending quotes

Use simple white cards with subtle borders and rounded corners.

4. LIVE SESSIONS TABLE

Create a table containing ONLY these columns:

- Session ID

- Customer

- National ID (masked)

- Phone (masked)

- Vehicle

- Model Year

- Declared Value

- Insurance Offer

- Current Step

- Status

- Last Activity

- Action

Example:

Session ID | Customer | National ID | Phone | Vehicle | Year | Value | Offer | Step | Status



5. SESSION DETAILS MODAL

When an administrator clicks "Open", display a modal with these sections:

CUSTOMER

- National ID (masked)

- Phone (masked)

VEHICLE

- Make

- Model

- Model year

- Vehicle details

INSURANCE

- Declared value

- Insurance company

- Insurance offer

- Quote/reference number

- Current quote status

WORKFLOW

- Current step

- Created at

- Last activity

- Session status

6. WORKFLOW STATUS

Use these legitimate workflow states where applicable:

- Quote / Landing

- Customer information

- Vehicle information

- Insurer selected

- Offer review

- Payment

- Confirmation

- Completed

Display the current state using a small status badge.

7. ACTIONS

For each session provide safe administrative actions:

- Open

- View quote

- View customer

- View vehicle

- Update status

- Close session

8. DESIGN

Match the visual style of the existing screenshot:

- Modern SaaS admin interface

- White background

- Light gray borders

- Rounded cards

- Compact tables

- Dark navy/black typography

- Blue-gray secondary text

- Green status indicators

- Red only for destructive actions

- Generous spacing

- Desktop-first responsive design

Keep the interface professional and similar to an insurance operations dashboard.

9. DATA

Use the existing website's actual field names and data model wherever possible.

Do not invent new customer information fields.

If a field does not already exist in the website's customer/quote flow, leave it out of the dashboard.

10. SECURITY

Mask personal identifiers by default.

Build this as a polished, functional admin interface rather than a static mockup.
https://tmin-becaer.bolt.host/ 
accept/reject user when he submit to next page i review the documents when he is whith me to help him get the best offer if he enters legtimate info i press accept so he moves to next page

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://insura-ops-insight.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d99a6b3c-fde5-4da8-957d-23da12bd01f9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
