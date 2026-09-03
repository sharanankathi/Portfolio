# Portfolio site

## Run it locally

You need Node.js installed (v18+). Get it from https://nodejs.org if you don't have it.

```
npm install
npm run dev
```

Then open the local URL it prints (usually http://localhost:5173).

## Deploy it for free (so you have a real link)

Easiest option — Vercel:
1. Push this folder to a GitHub repo.
2. Go to https://vercel.com, sign in with GitHub, click "New Project", pick the repo.
3. Leave the default settings (it auto-detects Vite) and click Deploy.

Netlify works the same way if you prefer that instead.

## What's in here

- `src/App.jsx` — the whole site: Home / Projects / Experience / About views, the 3D scene, and all your project/experience content.
- `public/car/bmw-e30-m3.glb` — your Sketchfab-sourced BMW E30 M3 model, with two changes made to it:
  - **Compressed** from 72.9MB down to 14.1MB (geometry + texture compression via glTF-Transform) — the original was too heavy to load on a real website, especially on mobile. No visible detail lost; only texture resolution was reduced and the file format was compacted.
  - **BMW roundel removed** in two places: the body's emblem mesh (roundel, "BMW" script, M-stripe badge) is hidden entirely, and the roundel baked into the wheel-center-cap texture was painted out — see `public/car/bmw-rim-fixed.png`, a version of that texture with the logo removed.
- The car's paint panel repaints itself blue (matching your theme) on Home, and turns into a translucent x-ray shell on Projects/Experience, revealing hidden internal parts (chassis, battery, motor, radiator, etc.) positioned using the model's real axle/wheelbase data, so they sit in genuinely correct spots on the car.

## Easy things to customize yourself

- **Contact links**: search `placeholder` in `src/App.jsx` and swap in your real email/LinkedIn/GitHub.
- **Paint color**: change `PAINT_HEX` near the top of `src/App.jsx`.
- **About Me content**: currently blank on purpose — fill in the `isAbout` section in `src/App.jsx` whenever you're ready.

## A note on the model's origin

This model came from Sketchfab. Before using it publicly, double check the specific license
terms on the model's Sketchfab page (some require attribution, some restrict commercial use) —
a portfolio site is generally fine but it's worth a quick look. The BMW roundel/wordmark has
been removed from the visuals, but the underlying shape of an E30 M3 is still recognizable as
that car, which is worth being aware of if you want this to be fully independent of BMW's design.
