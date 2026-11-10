import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Download, Eye, Focus, Layers, Maximize2, MousePointer2, MoveRight, RotateCcw, ScanLine, Sparkles } from "lucide-react";
import { isChinese } from "../i18n/locale";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ProjectImageLightbox } from "../components/case-study/ProjectImageLightbox";
import "../styles/guideline.css";

const t = (en: string, zh: string) => isChinese ? zh : en;
const sections = [
  ["overview", "Overview", "概览"], ["color", "Color", "色彩"],
  ["typography", "Typography", "字体排印"], ["layout", "Layout & spacing", "布局与间距"],
  ["components", "Components", "组件"], ["motion", "Motion", "动效"],
  ["patterns", "Interaction patterns", "交互模式"], ["accessibility", "Accessibility", "无障碍设计"],
] as const;
const colors = [
  { name: "Magenta", zh: "品红", value: "#BD007D", use: "Warmth in expressive headlines.", useZh: "为富有表现力的标题增添温度。" },
  { name: "Violet", zh: "紫罗兰", value: "#9600E9", use: "A vivid transition between hues.", useZh: "连接相邻色相，带来鲜明的变化。" },
  { name: "Azure", zh: "蔚蓝", value: "#0061BB", use: "A connection to the blue identity.", useZh: "与作品集的蓝色视觉语言呼应。" },
  { name: "Teal", zh: "青蓝", value: "#006986", use: "A cool, balanced resting point.", useZh: "为渐变带来冷静、平衡的落点。" },
];
// A downloadable reference, not a claim that every legacy page uses a shared token engine.
const referenceTokens = {
  name: "Mu He portfolio · design reference", version: 1,
  color: {
    light: { canvas: "#F5F6F8", text: "#172B43", textSecondary: "#2F4056", action: "#203D5C", onAction: "#FFFFFF" },
    dark: { canvas: "#0A111D", text: "#EDF2F9", textSecondary: "#C4CFE0", action: "#DCE8F7", onAction: "#132B45" },
    accents: Object.fromEntries(colors.map(color => [color.name.toLowerCase(), color.value])),
    darkHeadline: ["#F472B6", "#C084FC", "#60A5FA", "#67E8F9"],
    midnight: "#102F56",
  },
  typography: { latin: "Google Sans, sans-serif", chinese: '"PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "Microsoft YaHei", sans-serif', display: "clamp(48px, 5.6vw, 80px)", body: "clamp(16px, 1.4vw, 19px)", bodyLineHeight: 1.65, chineseBodyLineHeight: 1.8 },
  spacing: [4, 8, 12, 16, 24, 32, 48, 72],
  layout: { contentMax: 1264, mobileGutter: 24, projectImageRatio: "4 / 3", projectImageRadius: 18 },
  motion: { linkMs: 200, buttonMs: 250, imageMs: 650, imageEasing: "cubic-bezier(.2,.7,.2,1)", reducedMotion: "Disable nonessential movement" },
};

function Section({ id, label, title, description, children }: { id: string; label: string; title: string; description: string; children: ReactNode }) {
  return <section id={id} className="guide-section" aria-labelledby={`${id}-title`} tabIndex={-1}>
    <div className="guide-section-heading"><span className="guide-eyebrow">{label}</span><h2 id={`${id}-title`}>{title}</h2><p>{description}</p></div>
    {children}
  </section>;
}

function contrast(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const a = luminance(foreground), b = luminance(background);
  return (Math.floor(((Math.max(a, b) + .05) / (Math.min(a, b) + .05)) * 10) / 10).toFixed(1);
}

export function GuidelinePage() {
  const { hash } = useLocation();
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState("overview");
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);
  const [duration, setDuration] = useState(650);
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const page = useRef<HTMLElement>(null);
  const motionObject = useRef<HTMLDivElement>(null);
  const motionAnimation = useRef<Animation | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const navigation = document.querySelector(".guideline-shell nav.fixed");
    if (!navigation) return;
    const measure = () => page.current?.style.setProperty("--guide-nav-height", `${Math.ceil(navigation.getBoundingClientRect().bottom)}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(navigation);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const cutoff = window.innerWidth <= 900 ? (document.querySelector(".guide-mobile-nav")?.getBoundingClientRect().bottom ?? 170) + 30 : 190;
      const current = [...sections].reverse().find(([id]) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= cutoff);
      setActive(current?.[0] ?? "overview");
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    if (!hash || !sections.some(([id]) => `#${id}` === hash)) return;
    // The shared router resets scroll on route changes; run after that reset.
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => {
      const element = document.getElementById(hash.slice(1));
      element?.scrollIntoView({ behavior: "instant" });
      element?.focus({ preventScroll: true });
    }); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [hash]);
  useEffect(() => { if (reducedMotion) motionAnimation.current?.cancel(); }, [reducedMotion]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => () => { clearTimeout(copyTimer.current); motionAnimation.current?.cancel(); }, []);

  function jump(id: string) {
    const element = document.getElementById(id);
    // Native fragment navigation keeps the sections shareable and back/forward usable.
    if (window.location.hash !== `#${id}`) window.location.hash = id;
    else { element?.scrollIntoView({ behavior: "instant" }); element?.focus({ preventScroll: true }); }
  }
  async function copyColor(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value); setNotice(t(`Copied ${value}.`, `已复制 ${value}。`));
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(""), 2500);
    } catch { setNotice(t(`Copy unavailable. Select the visible value ${value} to copy it manually.`, `暂时无法自动复制，请选中色值 ${value} 手动复制。`)); }
  }
  function downloadTokens() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(referenceTokens, null, 2) + "\n"], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "mu-he-design-reference.json";
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(t("Reference tokens downloaded as JSON.", "设计参考变量已下载为 JSON 文件。"));
  }
  function replay() {
    if (reducedMotion || !motionObject.current) return;
    motionAnimation.current?.cancel();
    motionAnimation.current = motionObject.current.animate([
      { transform: "translateX(-90px) scale(.85)", opacity: .35 },
      { transform: "translateX(0) scale(1)", opacity: 1 },
    ], { duration, easing: "cubic-bezier(.2,.7,.2,1)" });
  }

  return <main ref={page} className="guide-page" id="guideline-main">
    <a className="guide-skip" href="#overview">{t("Skip to guidelines", "跳至指南内容")}</a>
    <aside className="guide-sidebar">
      <a href="#overview" className="guide-brand" onClick={event => { event.preventDefault(); jump("overview"); }}><span className="guide-brand-mark" aria-hidden="true"><Layers size={19} /></span>{t("Design guidelines", "设计指南")}</a>
      <p className="guide-sidebar-label">{t("In this guide", "本页目录")}</p>
      <nav aria-label={t("Guideline sections", "设计指南目录")}>{sections.map(([id, en, zh]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={event => { event.preventDefault(); jump(id); }}>{t(en, zh)}</a>)}</nav>
      <div className="guide-sidebar-note"><span className="guide-status-dot" />{t("A living reference", "持续完善的设计参考")}<p>{t("The visual language behind this portfolio.", "记录这个作品集背后的设计语言。")}</p></div>
    </aside>
    <div className="guide-mobile-nav"><label htmlFor="guide-section-select">{t("On this page", "本页目录")}</label><select id="guide-section-select" value={active} onChange={event => jump(event.target.value)}>{sections.map(([id, en, zh]) => <option key={id} value={id}>{t(en, zh)}</option>)}</select></div>
    <div className="guide-content">
      <header id="overview" className="guide-intro" tabIndex={-1} aria-labelledby="guide-title">
        <span className="guide-eyebrow">{t("Mu He / Design guidelines", "何沐 / 设计指南")}</span>
        <h1 id="guide-title">{t("Clarity, in", "让每个细节，")}<br /><span>{t("every detail.", "清晰而自然。")}</span></h1>
        <p className="guide-lede">{t("A thoughtful interface gives the work room to speak. These are the foundations and patterns that bring this portfolio together.", "好的界面，让作品自己说话。这份指南记录作品集的视觉基础与交互模式，让每一次浏览都清晰、自然且连贯。")}</p>
        <div className="guide-intro-actions"><button className="guide-button" onClick={() => jump("color")}>{t("Explore the foundations", "探索设计基础")}<ArrowDown size={17} /></button><button className="guide-text-button" onClick={downloadTokens}><Download size={17} />{t("Download reference tokens", "下载设计参考变量")}</button></div>
        <div className="guide-cover" aria-hidden="true">
          <div className="guide-cover-grid" />
          <div className="guide-cover-type"><span>{t("Aa", "沐 Aa")}</span><small>{t("Form follows clarity", "以清晰定义形式")}</small></div>
          <div className="guide-cover-orbit"><div /><span /><i /></div>
          <div className="guide-cover-palette">{colors.map(color => <span key={color.name} style={{ background: color.value }} />)}</div>
          <div className="guide-cover-caption"><span>{t("Purposeful. Calm. Connected.", "有目的 · 有留白 · 有联系")}</span><span>01—08</span></div>
        </div>
        <div className="guide-principles">{[
          [Focus, "Make the next step clear", "让下一步一目了然", "Give each view a clear purpose and each action a familiar label.", "每个页面都有明确的目的，每个操作都有易懂的名称。"],
          [Layers, "Give context room", "为上下文留出空间", "Use hierarchy and whitespace to make complex work easy to explore.", "用层级和留白组织复杂信息，让浏览与理解更轻松。"],
          [Sparkles, "Let motion support", "让动效服务于理解", "Show relationships and feedback. Keep movement gentle and optional.", "用轻柔、可关闭的动效传递关系与反馈。"],
        ].map(([Icon, en, zh, body, bodyZh]) => { const Symbol = Icon as typeof Focus; return <article key={String(en)}><Symbol size={22} aria-hidden="true" /><h3>{t(String(en), String(zh))}</h3><p>{t(String(body), String(bodyZh))}</p></article>; })}</div>
      </header>

      <Section id="color" label={t("Foundations / Color", "设计基础 / 色彩")} title={t("Quiet surfaces. Expressive accents.", "平静的底色，恰当的强调。") } description={t("Magenta, violet, azure, and teal bring the homepage headlines to life. A shared blue foundation and neutral surfaces keep the work in focus.", "品红、紫罗兰、蔚蓝与青蓝让首页标题富有生机。统一的蓝色基调与中性背景，让注意力始终回到作品。") }>
        <div className="guide-swatches">{colors.map(color => <article key={color.name} className="guide-swatch"><div className="guide-swatch-color" style={{ background: color.value }} /><div><h3>{t(color.name, color.zh)}</h3><button className="guide-copy" aria-label={t(`Copy ${color.name} ${color.value}`, `复制${color.zh} ${color.value}`)} onClick={() => copyColor(color.value)}><code>{color.value}</code>{copied === color.value ? <Check size={15} /> : <Copy size={15} />}</button><p>{t(color.use, color.useZh)}</p></div></article>)}</div>
        <div className="guide-two-up guide-theme-pair">{(["light", "dark"] as const).map(mode => <article className={`guide-theme-sample guide-theme-${mode}`} key={mode}>
          <span className="guide-eyebrow">{mode === "light" ? t("Light appearance", "浅色外观") : t("Dark appearance", "深色外观")}</span>
          <h3>{t("Let the work lead.", "让作品成为主角。")}</h3><p>{t("Clear type, a quiet canvas, one point of emphasis.", "清晰的文字，安静的背景，一个明确的重点。")}</p>
          <span className="guide-example-action">{t("Explore a project", "探索项目")}<ArrowRight size={16} /></span>
          <dl>{[[t("Canvas", "背景"), referenceTokens.color[mode].canvas], [t("Text", "文字"), referenceTokens.color[mode].text], [t("Action", "操作"), referenceTokens.color[mode].action]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </article>)}</div>
        <p className="guide-note">{t("These accents are the light-mode headline colors; dark mode uses brighter counterparts. Keep long-form copy solid, and check contrast at the weakest point of a gradient. Theme examples above are visual specimens; use the site’s theme switch to change the page.", "这些强调色用于浅色模式的大标题，深色模式采用更明亮的对应色。正文保持纯色，渐变需检查对比度最低的位置。上方展示两种主题的视觉样本；页面主题可通过顶部开关切换。")}</p>
      </Section>

      <Section id="typography" label={t("Foundations / Typography", "设计基础 / 字体排印")} title={t("A hierarchy you can feel.", "不言自明的信息层级。") } description={t("Google Sans brings a familiar, open tone to English. Chinese uses the device’s system fonts, with more breathing room between lines and natural character spacing.", "英文采用亲切、开阔的 Google Sans；中文采用设备系统字体，以更舒展的行距和自然的字间距提升阅读体验。") }>
        <div className="guide-type-specimens">
          <div><span className="guide-spec-label">{t("Display", "展示标题")}<small>48–80 px · 500</small></span><p className="guide-type-display">{t("Complexity, made clear.", "让复杂，变清晰。")}</p></div>
          <div><span className="guide-spec-label">{t("Section heading", "章节标题")}<small>28–40 px · 500</small></span><p className="guide-type-heading">{t("A little context goes a long way.", "一点上下文，让理解更进一步。")}</p></div>
          <div><span className="guide-spec-label">{t("Body", "正文")}<small>16–19 px · 400</small></span><p className="guide-type-body">{t("Start with what people need to understand. Let each sentence lead naturally to the next, and give the reader room to pause.", "从读者需要理解的内容出发，让每句话自然地衔接下一句，也为思考和停顿留出空间。")}</p></div>
          <div><span className="guide-spec-label">{t("Label", "标签")}<small>14–16 px · 500</small></span><p className="guide-type-label">{t("View the design process", "查看设计过程")}<ArrowUpRight size={16} /></p></div>
        </div>
        <div className="guide-inline-notes"><p><strong>{t("Sentence case", "自然表达")}</strong>{t("Prefer clear words over all-caps labels. Use weight and spacing for emphasis.", "用清楚自然的文字命名，通过字重与留白表达重点，避免全大写标签。")}</p><p><strong>{t("Responsive by nature", "自然适应屏幕")}</strong>{t("Let summaries use the available width and wrap naturally. Keep longer reading passages to a comfortable measure.", "简短说明充分利用可用宽度，自然换行；长段落则保持舒适的阅读行宽。")}</p></div>
      </Section>

      <Section id="layout" label={t("Foundations / Layout", "设计基础 / 布局")} title={t("Room to see the whole picture.", "留出空间，看清全貌。") } description={t("A shared rhythm keeps the page coherent. Add space between ideas, keep related details close, and let the grid adapt before the content feels squeezed.", "一致的间距让页面更有秩序。不同主题之间留白，相关信息彼此靠近；当空间不足时，优先调整布局。") }>
        <div className="guide-spacing" aria-label={t("Spacing scale in pixels", "以像素为单位的间距阶梯")}>{referenceTokens.spacing.map(space => <div key={space}><span style={{ height: space }} /><code>{space}</code></div>)}</div>
        <div className="guide-demo-toolbar"><span>{t("Responsive grid / Live example", "响应式网格 / 交互示例")}</span><div className="guide-segment" role="group" aria-label={t("Preview width", "预览宽度")}><button aria-pressed={!compact} onClick={() => setCompact(false)}>{t("Wide", "宽屏")}</button><button aria-pressed={compact} onClick={() => setCompact(true)}>{t("Compact", "窄屏")}</button></div></div>
        <div className="guide-layout-demo"><div className={`guide-mini-page${compact ? " is-compact" : ""}`}><div className="guide-mini-heading"><span /><span /></div><div className="guide-mini-grid">{[0, 1].map(index => <div key={index}><div className="guide-mini-image"><span /><i /></div><strong>{index === 0 ? t("A clear starting point", "一个清晰的起点") : t("A connected experience", "一段连贯的体验")}</strong><p>{t("A short description with room to breathe.", "用简短的说明，留出阅读的空间。")}</p></div>)}</div></div></div>
        <div className="guide-facts"><p><strong>1,264 px</strong>{t("Maximum content width", "内容最大宽度")}</p><p><strong>24 px</strong>{t("Mobile side margins", "移动端侧边距")}</p><p><strong>4:3</strong>{t("Project thumbnail ratio", "项目缩略图比例")}</p><p><strong>0°</strong>{t("Flat, bottom-aligned imagery", "平直展示，图像底部对齐")}</p></div>
      </Section>

      <Section id="components" label={t("Components / Actions & cards", "组件 / 操作与卡片")} title={t("Familiar pieces. Clear feedback.", "熟悉的组件，明确的反馈。") } description={t("Keep actions easy to recognize and their results easy to understand. A project card should invite exploration without competing with the work itself.", "让操作容易识别，让结果容易理解。项目卡片邀请用户进一步探索，同时让作品本身保持主角地位。") }>
        <div className="guide-action-demo"><span className="guide-eyebrow">{t("Button states / Try it", "按钮状态 / 试一试")}</span><div className="guide-action-row"><button className="guide-button" aria-pressed={saved} onClick={() => setSaved(value => !value)}>{saved ? <Check size={18} /> : <Copy size={18} />}{saved ? t("Example saved", "示例已保存") : t("Save example", "保存示例")}</button><button className="guide-button guide-button-secondary" onClick={() => setSaved(false)}>{t("Reset", "重置")}</button><button className="guide-button" disabled>{t("Unavailable", "暂不可用")}</button></div><p role="status">{saved ? t("Saved for this demo. Select again to undo, or reset to start over.", "已在本示例中保存。再次点击可撤销，也可重置重新开始。") : t("Try the primary action. This example does not save personal data.", "试试主要操作。此示例不会保存个人信息。")}</p></div>
        <div className="guide-card-anatomy"><button className="guide-project-card" onClick={() => setExpandedImage({ src: "/media/home/malware-prevention.png", alt: t("Malware Prevention dashboard — full image preview", "恶意软件防护仪表盘 — 完整图像预览") })} aria-label={t("Open project image example", "打开项目图像示例")}><div className="guide-project-image"><img src="/media/home/malware-prevention.png" alt="" loading="lazy" /><span className="guide-image-prompt"><Maximize2 size={18} />{t("Open image to zoom", "点击放大图片")}</span></div><div className="guide-project-caption"><span>{t("Project card / Example", "项目卡片 / 示例")}</span><h3>{t("Malware Prevention", "恶意软件防护")}</h3><p>{t("A clearer view of threats and the next step to take.", "看清安全威胁，明确下一步行动。")}</p></div></button><div className="guide-anatomy-notes"><article><ScanLine size={20} /><h3>{t("Preserve the frame", "保留完整画面")}</h3><p>{t("Use a consistent 4:3 container. Anchor the screenshot at the bottom and keep the surrounding context visible.", "统一使用 4:3 容器，截图底部对齐，保留理解画面所需的上下文。")}</p></article><article><MousePointer2 size={20} /><h3>{t("A gentle invitation", "轻轻邀请探索")}</h3><p>{t("A slight image scale and a centered prompt signal interaction. Offer the same prompt on keyboard focus and touch.", "轻微的图像缩放与居中的提示传达可交互性。键盘聚焦和触屏也能看到相同的提示。")}</p></article></div></div>
      </Section>

      <Section id="motion" label={t("Behavior / Motion", "交互行为 / 动效")} title={t("Movement with a reason.", "让每一次移动都有理由。") } description={t("A short transition confirms an action. A slower ease gives imagery a softer arrival. Keep motion bounded, avoid unnecessary zoom, and let people choose stillness.", "短暂的过渡确认操作，舒缓的缓动让图像自然出现。限制移动范围，避免不必要的放大，也允许用户选择静态体验。") }>
        <div className="guide-motion-stage"><div className="guide-motion-path" /><div ref={motionObject} className="guide-motion-object"><Layers size={34} strokeWidth={1.25} /></div><span>{t("A gentle arrival", "自然地出现")}</span></div>
        <div className="guide-demo-toolbar"><div className="guide-segment" role="group" aria-label={t("Animation duration", "动画时长")}>{[250, 650].map(value => <button key={value} aria-pressed={duration === value} onClick={() => setDuration(value)}>{value} ms</button>)}</div><button className="guide-button guide-button-secondary guide-replay" onClick={replay} disabled={reducedMotion}><RotateCcw size={16} />{t("Replay motion", "重播动效")}</button></div>
        <p className="guide-note" role="status">{reducedMotion ? t("Reduced motion is on for your device. This example stays still.", "设备已启用减少动态效果，此示例保持静止。") : t("Motion plays once, only when requested. The example respects your device’s reduced-motion preference.", "动效仅在点击后播放一次，并遵循设备的减少动态效果设置。")}</p>
        <div className="guide-inline-notes"><p><strong>{t("200–250 ms · Feedback", "200–250 毫秒 · 反馈")}</strong>{t("Links and buttons respond promptly to hover and focus.", "链接和按钮在悬停、聚焦时快速响应。")}</p><p><strong>{t("650 ms · Image reveal", "650 毫秒 · 图像展示")}</strong>{t("Project imagery eases into a modest 1.045× hover scale, with no tilt.", "项目图像平缓放大至 1.045 倍，保持平直，不做倾斜。")}</p></div>
      </Section>

      <Section id="patterns" label={t("Behavior / Interaction patterns", "交互行为 / 交互模式")} title={t("Keep people oriented.", "始终知道自己在哪里。") } description={t("Navigation, media, and language should support one continuous reading experience. Help people explore details and return without losing their place.", "导航、媒体与语言共同支持连贯的阅读体验。让用户自由查看细节，返回时也不会迷失位置。") }>
        <div className="guide-pattern-flow" aria-label={t("Explore, inspect, return", "探索、查看、返回")}>{[[Eye, "Explore", "探索", "See the context", "看清上下文"], [Maximize2, "Inspect", "查看", "Open an image in place", "在当前页面放大图片"], [MoveRight, "Return", "返回", "Keep your reading position", "保留原有阅读位置"]].map(([Icon, en, zh, body, bodyZh], index) => { const Symbol = Icon as typeof Eye; return <div key={String(en)}><Symbol size={23} /><h3>{t(String(en), String(zh))}</h3><p>{t(String(body), String(bodyZh))}</p>{index < 2 && <ArrowRight className="guide-flow-arrow" size={20} aria-hidden="true" />}</div>; })}</div>
        <div className="guide-inline-notes"><p><strong>{t("Open without leaving", "查看细节，不离开页面")}</strong>{t("Enlarge images in a dialog. Escape closes it; focus returns to the image that opened it. Try the card above.", "用弹窗放大图像。按 Escape 关闭后，焦点回到原先的图片入口。可通过上方卡片体验。")}</p><p><strong>{t("One place, two languages", "相同位置，两种语言")}</strong>{t("The language switch opens the matching page. Chinese keeps the same structure with typography suited to its reading rhythm.", "语言切换保留对应页面。中文沿用相同结构，并采用符合中文阅读节奏的字体排印。")}</p></div>
      </Section>

      <Section id="accessibility" label={t("Quality / Accessibility", "体验质量 / 无障碍设计")} title={t("Clarity should include everyone.", "让清晰的体验属于每个人。") } description={t("Design for different screens, input methods, and comfort levels. These are working standards for new patterns, with checks on the actual foreground and background pair.", "兼顾不同屏幕、输入方式与使用偏好。以下是新增模式的设计标准；对比度需基于实际的前景与背景组合检查。") }>
        <div className="guide-contrast-grid">{(["light", "dark"] as const).map(mode => <div key={mode} className={`guide-contrast guide-theme-${mode}`}><span aria-hidden="true">Aa</span><div><strong>{contrast(referenceTokens.color[mode].text, referenceTokens.color[mode].canvas)}:1</strong><p>{mode === "light" ? t("Light text / canvas pair", "浅色主题 · 文字与背景") : t("Dark text / canvas pair", "深色主题 · 文字与背景")}</p><small>{t("Meets AAA for this solid-color pair", "此纯色组合达到 AAA 文字标准")}</small></div><Check size={20} /></div>)}</div>
        <ul className="guide-checklist"><li><Check /><div><strong>{t("Readable contrast", "可读的对比度")}</strong><p>{t("Target at least 4.5:1 for normal text (AA), and 7:1 for extended reading (AAA). Large text requires 3:1 and 4.5:1 respectively.", "普通文字至少达到 4.5:1（AA），长篇阅读以 7:1（AAA）为目标。大号文字对应的要求分别为 3:1 和 4.5:1。")}</p></div></li><li><Focus /><div><strong>{t("Visible keyboard focus", "清晰的键盘焦点")}</strong><p>{t("Keep a visible focus indicator, a logical tab order, and a keyboard path to every action.", "提供可见的焦点提示、合理的 Tab 顺序，并确保每个操作都可通过键盘完成。")}</p></div></li><li><MousePointer2 /><div><strong>{t("Comfortable targets", "易于点按的操作区域")}</strong><p>{t("Aim for a 44 × 44 px touch area. Pair color with words or icons so meaning never relies on color alone.", "以 44 × 44 像素作为触控区域的设计目标。用文字或图标配合颜色，避免只靠颜色传递信息。")}</p></div></li><li><Eye /><div><strong>{t("A calm alternative", "提供静态的选择")}</strong><p>{t("Respect reduced-motion settings. Keep content and controls available when animation is disabled.", "遵循减少动态效果设置。关闭动画后，内容与操作仍应完整可用。")}</p></div></li></ul>
        <p className="guide-note">{t("Contrast values above describe two text/background pairs, not a site-wide accessibility certification. Large text means at least 24 CSS px at regular weight, or about 18.7 px in bold.", "上方数值仅代表两组文字与背景的对比度，并非全站无障碍认证。大号文字指至少 24 CSS 像素的常规字重，或约 18.7 像素的粗体文字。")}</p>
      </Section>
      <div className="guide-references"><div><span className="guide-eyebrow">{t("Further reading", "延伸阅读")}</span><h2>{t("Inspired by thoughtful systems.", "向成熟的设计体系学习。")}</h2><p>{t("This guide documents my portfolio. Its organization draws inspiration from Apple HIG and Material Design; the examples and visual language are specific to this site.", "这份指南记录我的作品集设计。内容组织借鉴 Apple HIG 与 Material Design，示例与视觉语言则来自本站。")}</p></div><div><a href="https://developer.apple.com/design/human-interface-guidelines" target="_blank" rel="noopener noreferrer">Apple Human Interface Guidelines<ArrowUpRight size={17} /></a><a href="https://m3.material.io/foundations" target="_blank" rel="noopener noreferrer">Material Design<ArrowUpRight size={17} /></a><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 · {t("Contrast", "对比度")}<ArrowUpRight size={17} /></a><a href="https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html" target="_blank" rel="noopener noreferrer">WCAG 2.2 · {t("Motion", "动效")}<ArrowUpRight size={17} /></a></div></div>
    </div>
    <div className="guide-live-notice" role="status" aria-live="polite">{notice}</div>
    <ProjectImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />
  </main>;
}
