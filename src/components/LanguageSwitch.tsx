import { useLocation } from "react-router-dom";
import { isChinese, languagePath } from "../i18n/locale";

/** A full navigation also reloads module-level copy in the selected language. */
export function LanguageSwitch() {
  const { pathname, search, hash } = useLocation();
  const target = isChinese ? "en" : "zh";
  return <a className="language-switch" href={languagePath(pathname, target) + search + hash}
    hrefLang={target === "zh" ? "zh-CN" : "en"} lang={target === "zh" ? "zh-CN" : "en"}
    aria-label={isChinese ? "Switch this page to English" : "将此页面切换为简体中文"}>
    {isChinese ? "EN" : "中文"}
  </a>;
}
