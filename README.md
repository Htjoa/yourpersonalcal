# YourPersonalCal
Editable React calendar with browser-local event storage.

## Development
Install Node.js and pnpm, then run:

    pnpm install
    pnpm dev

Edit src/App.tsx and src/styles.css. The preview updates when files are saved.

## Publish
Push this folder to the main branch of a GitHub repository. In repository Settings > Pages, select GitHub Actions as the source. The included workflow builds and publishes the app; later pushes update it automatically.

Events are stored in each browser and do not sync between devices. Hosted Higgsfield login and CalBuddy AI are not included in this local version. No existing calendar event data is included in this repository.
