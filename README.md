# support desk system

This is a mern stack support ticketing system

### Tech stack

- MongoDB
- ReactJS
- NodeJS-Express
- Redux-Toolkit
- React-Router

### How do I get set up?

```
git clone <url>

npm install
```

### Contribution guidelines

- add `.env` file in root and add the following

```
NODE_ENV=development || production

PORT=5000

MONGO_URI=your mongo uri

JWT_SECRET=your jwt secret

GEMINI_API_KEY=your Google AI Studio Gemini API key
```

### Render deploy

- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Node:** 22+ (repo includes `.node-version`; or set `NODE_VERSION=22` in Render)
- Set env vars in the Render dashboard: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`
- If start fails with exit code 1, check logs **above** the `ELIFECYCLE` line (often Mongo connection / missing `MONGO_URI`)

### Who do I talk to?

- Repo owner [https://www.raisanjmr.in](https://www.raisanjmr.in)
- view live [https://support-desk-0azr.onrender.com](https://support-desk-0azr.onrender.com)
