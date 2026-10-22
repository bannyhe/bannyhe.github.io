import messages from "./zh-CN.json" with { type: "json" };
import { terms } from "./terms.ts";

export type Locale = "en" | "zh";
export function localeForPath(path: string): Locale {
  return /^\/zh(?:\/|$)/.test(path) ? "zh" : "en";
}
export const locale: Locale = typeof window === "undefined" ? "en" : localeForPath(window.location.pathname);
export const isChinese = locale === "zh";
export const languageTag = isChinese ? "zh-CN" : "en";
export function withoutLocale(path: string) {
  return path.replace(/^\/zh(?=\/|$)/, "") || "/";
}
export function languagePath(path: string, target: Locale) {
  const plain = withoutLocale(path);
  return target === "zh" ? "/zh" + (plain === "/" ? "/" : plain) : plain;
}

const catalog: Record<string, string> = { ...messages, ...terms };
export function translateText(value: string, target: Locale = locale): string {
  if (target !== "zh" || !value.trim()) return value;
  const key = value.replace(/\s+/g, " ").trim();
  const translated = catalog[key];
  if (translated !== undefined) return value.match(/^\s*/)?.[0] + translated + value.match(/\s*$/)?.[0];
  // Dynamic accessible labels keep the translated subject intact.
  const templates: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/^(.+) project preview$/, m => translateText(m[1], target) + "项目预览"],
    [/^Enlarge: (.+)$/, m => "放大查看：" + translateText(m[1], target)],
    [/^Open the full-size still frame for (.+)$/, m => "查看完整截图：" + translateText(m[1], target)],
    [/^Still frame: (.+)$/, m => "视频截图：" + translateText(m[1], target)],
    [/^The analytics service returned an error \((\d+)\). Please retry.$/, m => "分析服务返回错误（" + m[1] + "），请重试。"],
    [/^Updated (.+) PST$/, m => "更新于 " + m[1] + " PST"],
    [/^(.+) of (.+) visits$/, m => "第 " + m[1] + " 条，共 " + m[2] + " 次访问"],
    [/^Open visit from (.+), (.+) PST$/, m => "查看来自 " + m[1] + " 的访问，" + m[2] + " PST"],
    [/^Explore (.+): (.+)$/, m => "探索" + translateText(m[1], target) + "：" + translateText(m[2], target)],
    [/^World map of visitor locations\. (\d+) locations across (\d+) countries\.$/, m => "访客位置世界地图，涵盖 " + m[2] + " 个国家的 " + m[1] + " 个位置。"],
    [/^(.+) over time\. Use left and right arrow keys to inspect dates\.$/, m => translateText(m[1], target) + "趋势。使用左右方向键查看日期。"],
    [/^Explore (.+)$/, m => "探索" + translateText(m[1], target)],
    [/^(\d+)s$/, m => m[1] + " 秒"],
    [/^(\d+)m (\d+)s$/, m => m[1] + " 分 " + m[2] + " 秒"],
  ];
  for (const [pattern, format] of templates) {
    const match = key.match(pattern);
    if (match) return format(match);
  }
  return value;
}

/**
 * Translate only React text boundaries. Objects, elements, event handlers,
 * identifiers, URLs and user-entered values are passed through unchanged.
 * A language switch performs a full navigation; the URL is the source of truth.
 */
export function localize<T>(value: T): T {
  if (!isChinese) return value;
  if (typeof value === "string") return translateText(value) as T;
  if (Array.isArray(value)) return value.map(item => localize(item)) as T;
  return value;
}
