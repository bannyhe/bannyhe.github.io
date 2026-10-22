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
export const CHINESE_SITE_NAME = "何沐";

/**
 * Every page's browser tab reads exactly this, by request.
 *
 * Worth knowing what it costs, since it is easy to change back: with several
 * tabs open none of them can be told apart, every bookmark saves under the same
 * name, and a search result shows "MU HE" instead of the page's subject. The
 * per-route `title` values below are therefore still used for og:title and
 * twitter:title, so links shared into Slack or LinkedIn keep a meaningful
 * headline even though the tab does not.
 *
 * To restore per-page tabs, use `metaForPath(...).title` in place of this in
 * DocumentTitle (src/App.tsx) and in the prerender plugin (vite.config.ts).
 */
export const BROWSER_TITLE = "MU HE";

/** Shown for any path with no entry below (mistyped URLs, removed pages). */
export const DEFAULT_TITLE = "Mu He — Product Designer";
export const DEFAULT_DESCRIPTION =
  "Portfolio of Mu He, a product designer with 7+ years of B2B SaaS experience in networking & security — UX/UI design and research.";

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** Prerendered with noindex and excluded from the sitemap. */
  noIndex?: boolean;
}

const EN_ROUTE_META: RouteMeta[] = [
  {
    path: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  {
    path: "/about",
    title: "About — Mu He",
    description:
      "Mu He is a product designer with 7+ years of experience shaping B2B SaaS networking & security products at VMware by Broadcom, and a Gold Prize winner at the Cybersecurity Excellence Awards.",
  },
  {
    path: "/resume",
    title: "Resume — Mu He",
    description:
      "Resume of Mu He — Senior Product Designer with 7 years in enterprise SaaS, cloud infrastructure, and cybersecurity, leading Network Operations UX and conversational AI concept design.",
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
  {
    path: "/project/ai-assistant",
    title: "Network AI Assistant — Mu He",
    description:
      "Envisioning Network AI Assistant within VCF Operations. UX Design Lead, May–July 2026. A password-protected concept walkthrough covering object context, diagnostics, remediation review, and session continuity.",
  },
];


/** Chinese URLs share the same components and have their own crawlable metadata. */
const ZH_META: Record<string, [string, string]> = {
  "/": ["何沐 — 产品设计师", "何沐的产品设计作品集：拥有 7 年以上企业 SaaS 经验，专注 AI、云基础设施、网络与安全领域的用户体验设计与研究。"],
  "/about": ["关于何沐", "了解何沐：拥有 7 年以上经验的产品设计师，在 VMware by Broadcom 设计企业网络与安全产品，参与的方案曾获网络安全卓越奖金奖。"],
  "/resume": ["简历 — 何沐", "何沐的简历：高级产品设计师，专注企业 SaaS、云基础设施与网络安全，主导网络运维体验和对话式 AI 概念设计。"],
  "/project/malware-prevention": ["恶意软件防护 — 何沐", "设计案例：实时恶意软件检测与防护仪表盘，通过文件检测、威胁分析和数据可视化，帮助安全人员更高效地理解并应对风险。"],
  "/project/northstar-onboarding": ["Northstar 首次使用体验 — 何沐", "设计案例：为 VMware Cloud Gateway 构建清晰的首次使用体验，引导管理员完成前提检查、配置与部署。"],
  "/project/vcf-network": ["VCF 网络运维 — 何沐", "设计案例：将网络运维能力整合到 VMware Cloud Foundation，统一信息架构与交互模式。本案例需要密码访问。"],
  "/project/xenith-website": ["Xenith 网站改版 — 何沐", "设计案例：通过用户研究、信息架构和视觉设计，优化 Xenith 电商网站的产品发现、对比与购买体验。"],
  "/project/ai-assistant": ["网络 AI 助手 — 何沐", "探索 VCF Operations 中的网络 AI 助手。UX 设计负责人，2026 年 5—7 月。案例涵盖对象上下文、诊断证据、修复审批与会话延续，需要密码访问。"],
  "/admin": ["访问分析 — 何沐", "作品集访问分析工作台。"]
};
export const ROUTE_META: RouteMeta[] = [
  ...EN_ROUTE_META,
  ...EN_ROUTE_META.map(route => ({
    ...route, path: "/zh" + (route.path === "/" ? "/" : route.path),
    title: ZH_META[route.path][0], description: ZH_META[route.path][1]
  }))
];

/**
 * Exact-match lookup. Anything unknown is a 404 — the catch-all route renders
 * NotFoundPage, so the tab should say so rather than claim to be the portfolio
 * home page.
 */
export function metaForPath(pathname: string): RouteMeta {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return (
    ROUTE_META.find((route) => route.path.replace(/\/$/, "") === normalized.replace(/\/$/, "")) ?? {
      path: normalized,
      title: /^\/zh(?:\/|$)/.test(pathname) ? "页面不存在 — 何沐" : "Page not found — Mu He",
      description: /^\/zh(?:\/|$)/.test(pathname) ? ZH_META["/"][1] : DEFAULT_DESCRIPTION,
      noIndex: true,
    }
  );
}
