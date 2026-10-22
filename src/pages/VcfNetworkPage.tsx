import { LanguageSwitch } from "../components/LanguageSwitch";
import { localize } from "../i18n/locale";
import { ProjectImageLightbox, activateImageOnKey } from "../components/case-study/ProjectImageLightbox";
import { ProjectHero } from "../components/case-study/ProjectHero";
import { ProjectNavigation } from "../components/case-study/ProjectNavigation";
import { Network } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ExternalLink, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// Case study assets, exported from the NetOps deck.
// The previous hero import pointed at src/assets/501379d3….png, which is not a
// PNG at all — it is an ASCII file containing base64 — so it could never render.
import netopsOverviewImg from "../assets/netops/netops-overview.png";
import netopsContextImg from "../assets/netops/netops-context.png";
import netopsProcessImg from "../assets/netops/netops-process.png";
import netopsIaImg from "../assets/netops/netops-ia.png";
import netopsFirstVersionImg from "../assets/netops/netops-first-version.png";
import netopsFinalImg from "../assets/netops/netops-final.png";
import netopsClarityFlowsImg from "../assets/netops/netops-clarity-flows.png";
import netopsClarityAppsImg from "../assets/netops/netops-clarity-applications.png";
import netopsLearningsImg from "../assets/netops/netops-learnings.png";
import netopsAffinityImg from "../assets/netops/netops-affinity.svg";

export function VcfNetworkPage() {
  const reduceMotion = useReducedMotion();
  // `cropped` mirrors the 1% trim the two product screenshots get in the page,
  // so the expanded view shows the same framing rather than the raw capture.
  const [expandedImage, setExpandedImage] = useState<
    { src: string; alt: string; cropped?: boolean } | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  // Access code for this case study, supplied at build time (see .env.example
  // and the VITE_VCF_PROJECT_PASSWORD secret in the deploy workflow).
  //
  // Be clear about what this is and is not. Any check that runs in the browser
  // ships its comparison value in the bundle, so this is a courtesy gate — it
  // keeps the work off search results and away from casual browsing, and it is
  // not a security control. Anything genuinely covered by an NDA should not be
  // published here at all. Moving the value out of source keeps it from sitting
  // in a public repository; it does not make the gate unbreakable.
  //
  // The page content itself is not rendered until this passes, so it is not
  // sitting in the DOM behind the overlay.
  const PROJECT_PASSWORD = import.meta.env.VITE_VCF_PROJECT_PASSWORD ?? "";
  const isAccessConfigured = PROJECT_PASSWORD.length > 0;

  const tableOfContents = [
    { id: "brief", label: "Brief" },
    { id: "problem", label: "Problem" },
    { id: "my-role", label: "My Role" },
    { id: "process", label: "Process" },
    { id: "research-synthesis", label: "Research Synthesis" },
    { id: "solution-overview", label: "Integration of Information Architecture" },
    { id: "design-challenge", label: "Network Operations 1st Version" },
    { id: "scope-change", label: "Scope Change" },
    { id: "approach-strategy", label: "Convert Customized Patterns to Design Library" },
    // { id: "final-implementation", label: "Final Implementation" },  // FINAL IMPLEMENTATION
    // { id: "impact", label: "Impact" },  // IMPACT: re-enable with the section
    { id: "continuous-collaboration", label: "Continuous Collaboration across Components" },
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAccessConfigured && passwordInput === PROJECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="case-study pt-20 pb-24 vcf-body">
      {/* Password Protection Overlay */}
      {localize(!isAuthenticated && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className="project-gate-language"><LanguageSwitch /></div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="max-w-md w-full mx-4"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8 sm:p-12" style={{ borderRadius: '20px' }}>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 mb-6 shadow-lg" style={{ borderRadius: '16px' }}>
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl text-center mb-2 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Password Protected")}</h2>
              </div>

              {/* If the build had no access code, say so plainly rather than
                  showing a field that can never succeed. Missing the secret in
                  CI would otherwise look like the visitor's password is wrong. */}
              {localize(!isAccessConfigured ? (
                <p className="text-center text-gray-700 dark:text-gray-200">{localize("Access for this case study isn't set up right now. Please get in touch and I'll share it with you directly.")}</p>
              ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setError(false);
                    }}
                    placeholder={localize("Enter password")}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    style={{ borderRadius: '10px' }}
                    autoFocus
                  />
                  {localize(error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >{localize("Incorrect password. Please try again.")}</motion.p>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg"
                  size="lg"
                  style={{ borderRadius: '10px' }}
                >{localize("Unlock Project")}</Button>
              </form>
              ))}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">{localize("Don't have access? Please email:")}{localize(" ")}
                  <a 
                    href="mailto:bannyhe@umich.edu" 
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                  >{localize("bannyhe@umich.edu")}</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ))}

      {/* Original Content - Only visible when authenticated */}
      {localize(isAuthenticated && (
        <>
          <ProjectHero
            title={localize("VCF Network Operations")}
            description={localize("Integrating advanced network capabilities into cloud-infra monitoring, addressing uncertainties in real business environment.")}
            icon={Network}
            image={{ src: netopsOverviewImg, alt: "Network Operations dashboard with network inventory, alert trends, and traffic summary widgets.", width: 1867, height: 905, crop: { x: 1031, y: 154, width: 722, height: 622 } }}
          />
          <ProjectNavigation sections={tableOfContents} />

          <div className="container mx-auto px-4">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <div className="mb-16">

                {/* Project Metadata in 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Project Type")}</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{localize("UX/UI Design, UX Research")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("My Role")}</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{localize("Lead UX Designer")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Team")}</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{localize("1 Product Manager, 1 IX, 1 Accessibility, 10+ Engineers")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Timeline")}</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{localize("June 2024 - December 2024")}</p>
                  </div>
                </div>
              </div>

              {/* Brief */}
              <div className="mb-16" id="brief">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Brief")}</h2>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>{localize("VCF Network Insights (vRNI) provides real-time visibility and analytics of network traffic, performance, and security, enabling proactive issue detection, efficient management, and enhanced network optimization.")}</p>
                  <p>{localize("VCF Operations simplifies IT operations management by providing comprehensive monitoring, analytics, and optimization for applications, infrastructure, and cloud environments. With vRNI integrated, VI admins will experience a next level VCF Operations which is enhanced with network optimization.")}</p>
                </div>
              </div>

              {/* Problem */}
              <div className="mb-16" id="problem">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Problem")}</h2>
                {/* items-start, not items-center: the copy is now taller than the
                    diagram, and centering left the image floating mid-column. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>{localize("Our main persona, Anita, is a VI Admin. She monitors her infrastructure from VCF Operations, while Compute and Storage are already established as core capabilities, Network is the missing piece for bringing VMware's core products together under VCF Operations.")}</p>
                    <p>{localize("Our goal was to integrate the core Network Insights (vRNI) capabilities into the existing Operations branch, which set the constraint behind every decision that followed: preserve the workflows admins already depend on. Network had to arrive as a natural extension of the navigation Anita already knows, widening what she can see rather than changing how she works.")}</p>
                  </div>
                  <div>
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsContextImg, alt: "Anita, a VI Admin, looking at VCF Operations. Compute, Storage and Network are listed as capabilities, with Network highlighted and mapped to Network Insights (vRNI) Operations for Network." })}
                      src={netopsContextImg}
                      alt={localize("Anita, a VI Admin, looking at VCF Operations. Compute, Storage and Network are listed as capabilities, with Network highlighted and mapped to Network Insights (vRNI) Operations for Network.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>
              </div>

              {/* My Role. Facts here are all already on the page: role, team and
                  dates from the metadata block, and each responsibility is
                  evidenced by a section below. */}
              <div className="mb-16" id="my-role">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("My Role")}</h2>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>{localize("I led the design for this 6-month integration project, working with one product manager, an information experience writer, an accessibility specialist, and a team of more than ten engineers across the vRNI, NSX and Operations groups.")}</p>
                  <p>{localize("What I owned:")}</p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>{localize("Taking inventory of everything vRNI shipped, and regrouping it by what each feature is for rather than where it had historically lived.")}</li>
                    <li>{localize("Deciding where each group belonged in navigation VCF Operations already had, instead of giving Network a branch of its own.")}</li>
                    <li>{localize("The first integration proposal, and the rework when the direction changed halfway through.")}</li>
                    <li>{localize("Moving vRNI's custom patterns onto the Clarity design system, sequenced so the work could ship in stages.")}</li>
                    <li>{localize("Holding the design consistent across four groups that had not previously shared a surface.")}</li>
                  </ul>
                </div>
              </div>

              {/* Process */}
              <div className="mb-16" id="process">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Process")}</h2>
                {/* 4:3 image-to-text, graphic first. items-center keeps the
                    short summary level with the graphic rather than hanging off
                    its top edge. */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-8 items-center">
                  <figure className="md:col-span-4">
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsProcessImg, alt: "Project timeline across five milestones. 01, June to July 2024: Integration of Information Architecture. 02, July to August 2024: Network Operations 1st Version. 03, August to October 2024: Scope Change for Network Operations. 04, September 2024: Convert Customized Patterns to Clarity. 05, October to December 2024: Continuous Collaboration across Components." })}
                      src={netopsProcessImg}
                      alt={localize("Project timeline across five milestones. 01, June to July 2024: Integration of Information Architecture. 02, July to August 2024: Network Operations 1st Version. 03, August to October 2024: Scope Change for Network Operations. 04, September 2024: Convert Customized Patterns to Clarity. 05, October to December 2024: Continuous Collaboration across Components.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto bg-white"
                      style={{ borderRadius: '10px' }}
                    />
                  </figure>

                  <div className="md:col-span-3 space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>{localize("The project ran from June to December 2024. It moved from structure, to a first proposal, through a change of direction halfway in, and finished on system-level alignment, which is a paradigm for real-world product integration.")}</p>
                  </div>
                </div>
              </div>

              {/* Integration of Information Architecture.
                  The id stays "solution-overview" so any link already shared
                  against this anchor keeps working; only the label changed. */}
              {/* Research Synthesis. Sits after Process because each cluster
                  names the section of the work that answers it. */}
              <div className="mb-16" id="research-synthesis">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Research Synthesis")}</h2>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>{localize("Across those milestones the same complaints kept surfacing. I clustered what admins said about working across the two consoles until the groupings stopped moving. Four themes held, and each one set up a decision further down this page.")}</p>
                  <figure>
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsAffinityImg, alt: "Affinity diagram with four clusters of admin observations. Where does this live, discoverability: capability cannot be reached from Operations. Two consoles one task, context switching: reaching it means leaving. Too much too flat, feature overload: everything offered at the same weight. Don't make me relearn it, pattern consistency: the two halves behave differently." })}
                      src={netopsAffinityImg}
                      alt={localize("Affinity diagram with four clusters of admin observations. Where does this live, discoverability: capability cannot be reached from Operations. Two consoles one task, context switching: reaching it means leaving. Too much too flat, feature overload: everything offered at the same weight. Don't make me relearn it, pattern consistency: the two halves behave differently.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto mt-2 bg-white"
                      style={{ borderRadius: '10px' }}
                    />
                  </figure>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Where does this live?")}</span>{localize(" Admins could not reach vRNI capability from Operations at all. That is the question ")}<span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Integration of Information Architecture")}</span>{localize(" answers below — regrouping features by what they are for, then placing them in navigation Operations already had rather than giving Network its own branch.")}</li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Two consoles, one task.")}</span>{localize(" Even when a feature could be reached, getting to it meant leaving.")}{localize(" ")}
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Network Operations 1st Version")}</span>{localize(" tested whether surfacing everything in one place was enough. It was not: most of it arrived as links that sent people straight back out, which is exactly what the")}{localize(" ")}
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Scope Change")}</span>{localize(" responded to.")}</li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Too much, too flat.")}</span>{localize(" Everything vRNI shipped was offered at the same weight. The")}{localize(" ")}
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Scope Change")}</span>{localize(" is where that got resolved — mapping a smaller set properly instead of carrying the whole catalog across.")}</li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Don’t make me relearn it.")}</span>{localize(" The two halves did not behave like one product.")}{localize(" ")}
                      <span className="text-gray-900 dark:text-gray-100 font-bold">{localize("Convert Customized Patterns to Design Library")}</span>{localize(" is the answer, moving vRNI’s custom patterns onto Clarity so the same idea uses the same control on both sides.")}</li>
                  </ul>
                  <p>{localize("Read in that order the clusters give a sequence rather than a list: find it, stop the round trips, cut what isn’t load-bearing, then make it feel like one product. That is the order the rest of this page follows.")}</p>
                </div>
              </div>

              <div className="mb-16" id="solution-overview">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Integration of Information Architecture")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>{localize("To begin with, I broke down the Information Architecture by a few major steps. The starting point was an inventory: everything vRNI shipped, as a flat list of features like dashboards, alerts, flow insights, etc.")}</p>
                    <p>{localize("Then, I focused on grouping vRNI features into similar categories, and synthesized the workflows on how each category may fit under existing Ops Navigation.")}</p>
                  </div>

                  {/* The diagram carries a lot of small type; at half a column
                      the feature names are legible but tight. */}
                  <figure>
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsIaImg, alt: "Information architecture diagram. Stage 1 groups vRNI features such as Flow Analysis, Network Path, Network Map, Applications and Security Planning. Stage 2 maps each group into VCF Ops navigation under Infrastructure Operations, Security and Administration." })}
                      src={netopsIaImg}
                      alt={localize("Information architecture diagram. Stage 1 groups vRNI features such as Flow Analysis, Network Path, Network Map, Applications and Security Planning. Stage 2 maps each group into VCF Ops navigation under Infrastructure Operations, Security and Administration.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                  </figure>
                </div>
              </div>

              {/* Network Operations 1st Version.
                  The id stays "design-challenge" so links already shared against
                  this anchor keep working; only the label changed. */}
              <div className="mb-16" id="design-challenge">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Network Operations 1st Version")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* 1% trimmed off every edge. The wrapper clips and the image
                      is scaled by 100/98, so the visible frame still fills the
                      column rather than sitting inside a transparent margin. */}
                  <figure
                    className="md:sticky md:top-28 overflow-hidden"
                    style={{ borderRadius: '10px' }}
                  >
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsFirstVersionImg, alt: "The first Network Operations proposal inside VCF Ops: an Overview tab alongside three custom boards, with Network Alerts, Top Network Insights, NSX Enabled, Traffic Summary and Top Anomalies widgets.", cropped: true })}
                      src={netopsFirstVersionImg}
                      alt={localize("The first Network Operations proposal inside VCF Ops: an Overview tab alongside three custom boards, with Network Alerts, Top Network Insights, NSX Enabled, Traffic Summary and Top Anomalies widgets.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto block"
                      style={{ transform: 'scale(1.0204)' }}
                    />
                  </figure>

                  <div className="space-y-4 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>{localize("For the first vRNI integration proposal, Network Operations only includes and shows vRNI data:")}</p>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>{localize("All vRNI features are available on VCF Ops;")}</li>
                      <li>{localize("Most of the vRNI features are quick links;")}</li>
                      <li>{localize("Those features are not embedded with VCF Ops navigation, and one of the reasons is because the search technologies between vRNI and Ops are different, which will not happen for 9.0.")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scope Change — promoted from a sub-heading to its own section.
                  Key Constraints and Research Insights sit under it, which is the
                  order they appear in the deck. */}
              <div className="mb-16" id="scope-change">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Scope Change")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <div className="space-y-4">
                      <p>{localize("The first version answered whether everything could be surfaced in one place. It could — but mostly as links that sent people back out to vRNI, which is not the same as being integrated. That result shaped what came next.")}</p>
                      <p>{localize("The direction of vRNI integration changed, so the scope and requirements changed accordingly:")}</p>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>{localize("Network Operations is a home for both NSX and vRNI;")}</li>
                        <li>{localize("Instead of bringing all features to Ops without mapping them to Ops navigation properly, only focus on the top 2–3 features;")}</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl text-gray-900 dark:text-gray-100">{localize("Research Insights")}</h3>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>{localize("Refer to product managers guideline between VCF and NSX to determine what data to be included in NetOps;")}</li>
                        <li>{localize("Research sessions are planned as the reference for 9.1;")}</li>
                      </ul>
                    </div>
                  </div>

                  {/* The revised design, moved up from Final Implementation: it
                      is the outcome of this scope change, so it belongs beside
                      the copy describing it. Sticky so it stays in view while
                      reading the research notes. */}
                  {/* 1% trimmed off every edge, matching the 1st Version
                      screenshot: the figure clips and the image is scaled by
                      100/98, so the trimmed frame still fills the column. */}
                  <figure
                    className="md:sticky md:top-28 overflow-hidden"
                    style={{ borderRadius: '10px' }}
                  >
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsFinalImg, alt: "The revised Network Operations page: a single Network Inventory summary across NSX instances, transport nodes, edge clusters, logical routers and switches, above Network Alerts Trend, VPC Enabled NSX Managers, Diagnostics Findings, NSX Health, Traffic Summary and Business Applications with Flows.", cropped: true })}
                      src={netopsFinalImg}
                      alt={localize("The revised Network Operations page: a single Network Inventory summary across NSX instances, transport nodes, edge clusters, logical routers and switches, above Network Alerts Trend, VPC Enabled NSX Managers, Diagnostics Findings, NSX Health, Traffic Summary and Business Applications with Flows.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto block"
                      style={{ transform: 'scale(1.0204)' }}
                    />
                  </figure>
                </div>
              </div>

              {/* Convert Customized Patterns to Design Library — promoted from a
                  sub-heading. The id stays "approach-strategy" so links already
                  shared against this anchor keep working. */}
              <div className="mb-16" id="approach-strategy">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Convert Customized Patterns to Design Library")}</h2>
                <div className="space-y-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <div className="space-y-4">
                    <p>{localize("As a major step of the integration process, I broke the pattern conversion down into three phases, based on the time and effort each takes.")}</p>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Phase 1:")}</span>{localize(" ")}{localize("Documented vRNI customized patterns and looked for the equivalent Clarity Design patterns;")}</li>
                      <li>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Phase 2:")}</span>{localize(" ")}{localize("Started from simple components like fonts, links and buttons;")}</li>
                      <li>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Phase 3:")}</span>{localize(" ")}{localize("Continued to align on complex patterns like widgets and list views.")}</li>
                    </ul>
                  </div>

                  {/* Converted patterns in place. These two are cropped in the
                      files themselves — 1% off the sides and top, 20% off the
                      bottom, where the capture had a band of empty canvas — so
                      the page and the expanded view agree without any CSS to
                      keep in step. Clickable, since interface type is small at
                      half a column. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localize([
                      {
                        src: netopsClarityFlowsImg,
                        alt: "Analyze, Flows tab in VCF Operations: a network performance view of flows by TCP round trip time, with deviation sliders and a Sankey diagram splitting traffic into abnormal and normal.",
                        expandedAlt: "Analyze — Flows, rebuilt on Clarity patterns",
                      },
                      {
                        src: netopsClarityAppsImg,
                        alt: "Business Applications in VCF Operations: flow-based discovery showing a hexagonal application topology beside a table of discovered applications with confidence, tiers and save actions.",
                        expandedAlt: "Business Applications — flow based discovery, rebuilt on Clarity patterns",
                      },
                    ].map((shot) => (
                      <figure key={shot.src}>
                        <img
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                          onClick={() => setExpandedImage({ src: shot.src, alt: shot.alt })}
                          src={shot.src}
                          alt={localize(shot.alt)}
                          className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto block"
                          style={{ borderRadius: '10px' }}
                        />
                      </figure>
                    )))}
                  </div>
                </div>
              </div>

              {/*
                FINAL IMPLEMENTATION — removed, not hidden.

                Its only content was the revised-design screenshot, which now
                sits beside the Scope Change copy that explains it. A heading
                with nothing under it reads as a broken page, so the section is
                gone rather than empty.

                To bring it back: re-add the markup here, and uncomment the two
                entries marked FINAL IMPLEMENTATION in the scroll-spy list and
                in tableOfContents.
              */}

              {/*
                IMPACT — not rendered yet, on purpose.

                The metrics and visuals are coming separately. Rendering the
                template's "[Impact Item 1] - [Description]" bullets and gray
                "Placeholder Image" boxes would put visible filler on a live
                page, so the whole section is omitted until there is something
                real to show.

                To restore, do all three:
                  1. Re-add the section markup here, between Final
                     Implementation and Learnings & Reflections. The original
                     is in git history — `git show <this commit>^:src/pages/VcfNetworkPage.tsx`.
                  2. Uncomment "impact" in the `sections` array used by the
                     scroll-spy (search: IMPACT).
                  3. Uncomment the Impact entry in `tableOfContents`.
              */}

              {/* Continuous Collaboration across Components — milestone 5 on the
                  Process timeline. Takes the illustration that briefly sat in
                  Learnings; it suits collaboration better than reflection. */}
              <div className="mb-16" id="continuous-collaboration">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Continuous Collaboration across Components")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>{localize("Complete Network Operations for VCF Ops 9.0 is never the end of the journey:")}</p>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>{localize("Continue to engage UX and Clarity teams to ensure the consistency;")}</li>
                      <li>{localize("Connect the dots for any vRNI related work streams like security planning, migration, adoption, vRNI console etc to increase the visibility of outstanding tasks;")}</li>
                      <li>{localize("Collaborate with stakeholders not only from vRNI, but also from NSX and Ops teams to overview any features scale to grow the products.")}</li>
                    </ul>
                  </div>

                  {/* Conceptual illustration, not a screen capture: no 1% trim
                      and no click-to-expand, since there is no detail to read.

                      Held below the column width and centered in its cell. At full
                      width it stood taller than the copy beside it, and the
                      artwork's own generous margins made it read larger still. */}
                  <figure
                    style={{
                      maxWidth: '460px',
                      marginInline: 'auto',
                      alignSelf: 'center',
                    }}
                  >
                    <img
                      role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey}
                      onClick={() => setExpandedImage({ src: netopsLearningsImg, alt: "Illustration of five people fitting four large jigsaw pieces together." })}
                      src={netopsLearningsImg}
                      alt={localize("Illustration of five people fitting four large jigsaw pieces together.")}
                      className="cursor-pointer hover:opacity-90 transition-opacity w-full h-auto block"
                      style={{ borderRadius: '10px' }}
                    />
                  </figure>
                </div>
              </div>

              {/* Learnings & Reflections */}
              <div className="mb-16" id="learnings-reflections">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Learnings & Reflections")}</h2>
                <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <ul className="list-disc pl-6 space-y-4">
                    <li>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Break down large projects into manageable steps:")}</span>{localize(" ")}{localize("It's common to feel overwhelmed by the scope while working on a complex project. By dividing the overall objective into small, digestible tasks.")}</li>
                    <li>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Ambiguity is opportunity, not barrier:")}</span>{localize(" ")}{localize("As a designer, while dealing with user scenarios with no clarity or prior experience, I view it as a time for innovation rather than a roadblock, and find aspects to explore and break through with creativity.")}</li>
                    <li>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Strategic thinking is embedded in design decisions:")}</span>{localize(" ")}{localize("A product designer should not only create beautiful interfaces, but also think holistically and strategically about every design decision before implementing.")}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          <ProjectImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />

        </>
      ))}
    </main>
  );
}