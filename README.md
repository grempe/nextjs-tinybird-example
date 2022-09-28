## Next.js + Tinybird

This repo shows a sample implementation of using an existing Next.js app to have the capability to use GDPR friendly first-party cookies with the Tinybird [web analytics starter kit](https://github.com/tinybirdco/web-analytics-starter-kit).

This example uses Typescript. It should be straightforward to convert it to plain JavaScript if that is your preference.

### Setup in your own project

#### Step 1 : API

Copy the file `pages/api/tracking.ts` to your own project in the same location. This API will proxy all requests from the client-side `flock.js` tracking script to Tinybird.

#### Step 2 : Environment variables

- `TINYBIRD_TRACKER_TOKEN` : set this to the value of your `tracker` auth token after running the Tinybird workspace starter. This will only be visible on the server-side `tracking.js` proxy.
- `NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY` : Set this to the origin of your application. For example, if your app is publicly hosted at `https://myapp.example.com:8080` you would specify that. This is used by the client-side tracking JavaScript and so must be prefixed with `NEXT_PUBLIC_` or it won't be visible to the client code. This will be converted to `https://myapp.example.com:8080/api/tracking` by the `flock.js` code.

There are a couple of other optional environment variables that you can see in the `tracking.js` script.

#### Step 3 : Integrate tracking script

To make the tracking script available on every page in your app you'll need to create the `pages/_document.tsx` file and add the tracking script to it. You can learn more about [custom documents](https://nextjs.org/docs/advanced-features/custom-document) in Next.js.

You can see the tracking script has no knowledge of the Tinybird token, and now uses `NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY` to set the `data-proxy` script attribute.

#### Step 4 : Run locally

If you add a `.env.local` file to the root of this repo you can configure your environment to test this locally.

Here's a sample:

```sh
TINYBIRD_TRACKER_TOKEN=replace-me-with-your token
NEXT_PUBLIC_TINYBIRD_TRACKER_PROXY=http://127.0.0.1:3000
```

Run `npm install && npm run dev` and page loads should start showing in your Tinybird console.

## Original README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
