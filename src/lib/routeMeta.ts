/**
 * Per-route page metadata.
 *
 * Consumed in two places, which is why it lives on its own:
 *   1. At runtime by <DocumentTitle> in App.tsx, so client-side navigation
 *      updates the tab title and description.
 *   2. At build time by the prerender plugin in vite.config.ts, which writes a
 *      static HTML file per route so crawlers and link-preview bots (Slack,
 *      LinkedIn, iMessage) see real metadata without executing any JavaScript.
 *
 * Keep the two in sync by only ever editing this file.
 */

export const SITE_URL = "https://muheportfolio.com";
export const SITE_NAME = "Mu He";

/** Shown for any path with no entry below (mistyped URLs, removed pages). */
export const DEFAULT_TITLE = "Mu He — Product Designer";
export const DEFAULT_DESCRIPTION =
  "Portfolio of Mu He, a product designer with 6+ years of B2B SaaS experience in networking & security — UX/UI design and research.";

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** Kept out of the sitemap and not prerendered. */
  noIndex?: boolean;
}

export const ROUTE_META: RouteMeta[] = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: "/about",
    title: "About — Mu He",
    description:
      "Mu He is a product designer with 6+ years of experience shaping B2B SaaS networking & security products at VMware by Broadcom, and a Gold Prize winner at the Cybersecurity Excellence Awards.",
  },
  {
    path: "/resume",
    title: "Resume — Mu He",
    description:
      "Resume of Mu He — product designer specializing in B2B SaaS networking, security, and data visualization.",
  },
  {
    path: "/project/malware-prevention",
    title: "Malware Prevention Dashboard — Mu He",
    description:
      "Case study: designing a real-time malware detection and prevention dashboard, covering file inspection and threat analysis for security operators.",
  },
  {
    path: "/project/northstar-onboarding",
    title: "Northstar Onboarding — Mu He",
    description:
      "Case study: a step-by-step onboarding experience for VMware Cloud Gateway, guiding administrators through prerequisites and configuration.",
  },
  {
    path: "/project/vcf-network",
    title: "VCF Network Operations — Mu He",
    description:
      "Case study: network operations experience for VMware Cloud Foundation. This case study is password protected.",
  },
  {
    path: "/project/xenith-website",
    title: "Xenith Website Redesign — Mu He",
    description:
      "Case study: redesigning the Xenith website, from information architecture through visual design.",
  },
  {
    path: "/admin",
    title: "Analytics — Mu He",
    description: DEFAULT_DESCRIPTION,
    noIndex: true,
  },
];

/** Exact-match lookup; falls back to the site defaults for unknown paths. */
export function metaForPath(pathname: string): RouteMeta {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return (
    ROUTE_META.find((route) => route.path === normalized) ?? {
      path: normalized,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    }
  );
}
