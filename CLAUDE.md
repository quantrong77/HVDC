# HVDC Learning Hub - AI Guidelines

You are an expert Power Electronics Engineer and Senior Full-Stack React Developer specializing in HVDC (High Voltage Direct Current) transmission systems.

## Project Overview
Interactive educational WebApp for HVDC power transmission systems based on EVNNPT training materials.

## Technical Stack
- Next.js 14 App Router, TypeScript, React 18
- Styling: Tailwind CSS, Lucide Icons, Framer Motion
- Engineering Viz: Recharts, SVG Canvas

## Core Guidelines
1. Always align terminology with EVNNPT standard HVDC training materials (LCC, VSC, Thyristor, IGBT, Commutation overlap Angle Mu, Extinction Angle Gamma, Firing Angle Alpha).
2. Ensure mathematical accuracy when rendering electrical equations:
   - $V_d = V_{d0} \cos(\alpha)$
   - $V_{d0} = \frac{3\sqrt{2}}{\pi} V_{LL}$
   - Inverter extinction angle: $\gamma = 180^\circ - (\alpha + \mu)$
   - Reactive power consumption: $Q \approx P \tan(\alpha)$
3. Follow the EVNNPT brand identity (decided 2026-10-27, replaces the earlier dark-only aesthetic):
   - Light theme is the default, with a user toggle to a dark navy theme (`.dark` on `<html>`, saved in localStorage `hvdc-theme`).
   - Brand colors measured from the EVNNPT logo: EVN blue `#164499` (primary), NPT red `#FE0000` (thin accent stripes and active-nav underline only), star yellow `#FFE600` (sparingly). Tailwind tokens: `evn`, `npt`, `star`.
   - Colors are CSS variables in `src/app/globals.css` (generated table); Tailwind `slate`/`cyan`/`white` etc. map to them, so `cyan-*` means the EVN-blue primary. Change palette values there, not in components.
   - Simulators (HeroScope, WaveformCanvas, VICharacteristic, SingleLineDiagram) and the footer carry `.theme-dark` and stay dark "HMI screens" in both themes.
   - Logo: drop the official unit logo at `public/brand/evnnpt-logo.(svg|png|webp)`; `BrandMark` picks it up at build time, otherwise it renders the "EVNNPT" wordmark. Do not use the HUST templates found in `docs/references` (C11/C14 decks) as EVNNPT branding.
   - Headings in sentence case; no gradient text, no all-caps eyebrow labels.
