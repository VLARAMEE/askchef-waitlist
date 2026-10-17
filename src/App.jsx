import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { trackEvent } from "./analytics";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { trackEvent } from "./analytics";
import askChefPhoneScreen from "./assets/askchef-phone-screen.png";
import privacyPolicyMarkdown from "./legal/privacy-policy.md?raw";
import termsOfUseMarkdown from "./legal/terms-of-use.md?raw";

const SUPPORT_EMAIL = "support@ask-chef.com";
const APP_STORE_URL =
  "https://apps.apple.com/us/app/ask-chef-cooking-companion/id6761346875";

const appScreenshots = {
  recipes: { src: "cookbook", alt: "AskChef Cookbook showing saved recipes with food photos" },
  cook: { src: "cooking", alt: "AskChef cooking assistant showing shrimp taco ingredients, steps, and voice controls" },
  plan: { src: "meal-plan", alt: "AskChef Meal plan showing saved recipes organized by day" },
  shop: { src: "groceries", alt: "AskChef Grocery list showing ingredients grouped by grocery aisle and home and cart controls" },
  builder: { src: "recipe-builder", alt: "A real AskChef conversation creating a burrata recipe with ingredients and steps" },
  safari: { src: "safari-import", alt: "A recipe in Safari beside the imported recipe in AskChef’s review screen" },
};

const pageMeta = {
  home: {
    title: "AskChef | Your Recipe and Cooking Companion",
    description:
      "Save recipes from anywhere, cook with hands-free guidance, and plan meals with AskChef—the AI cooking companion for voice-first cooking."
    canonical: "https://www.ask-chef.com/",
  },
  support: {
    title: "Support | AskChef",
    description:
      "Contact AskChef for app support, privacy questions, account deletion requests, billing questions, or legal inquiries.",
    canonical: "https://www.ask-chef.com/support",
  },
  whatWeDo: {
    title: "What We Do | AskChef",
    description:
      "See how AskChef brings recipe collecting, hands-free cooking, meal planning, and grocery lists into one calm kitchen companion.",
    canonical: "https://www.ask-chef.com/what-we-do",
  },
  faq: {
    title: "FAQ | AskChef",
    description:
      "Answers to common questions about AskChef recipe imports, cooking guidance, meal plans, grocery lists, and Siri support.",
    canonical: "https://www.ask-chef.com/faq",
  },
  terms: {
    title: "Terms of Use | AskChef",
    description:
      "Read the AskChef Terms of Use for the AskChef app, website, and related services.",
    canonical: "https://www.ask-chef.com/terms",
  },
  privacy: {
    title: "Privacy Policy | AskChef",
    description:
      "Read the AskChef Privacy Policy to learn how AskChef collects, uses, discloses, and protects personal information.",
    canonical: "https://www.ask-chef.com/privacy",
  },
};

const featureTour = [
  {
    id: "recipes",
    title: "Bring every recipe home.",
    description:
      "Save the recipes you already love, wherever you find them. AskChef turns scattered links, photos, screenshots, and ideas into one clear, cookable library.",
    points: ["Import from Safari", "Scan cookbook pages", "Create with AskChef"],
  },
  {
    id: "cook",
    title: "Stay in the flow while you cook.",
    description:
      "Ask about the recipe in front of you and get a short, useful answer grounded in its ingredients, steps, timing, and your current place.",
    points: ["Ask in the app or with Siri", "Hands-free steps and timers", "Recipe-aware answers"],
  },
  {
    id: "plan",
    title: "A meal plan made from real recipes.",
    description:
      "Choose from your saved cookbook, place meals on the days ahead, and move them as life changes. Planning stays connected to what you will actually cook.",
    points: ["A rolling two-week view", "Plan saved recipes", "Move meals without rework"],
  },
  {
    id: "shop",
    title: "Turn tonight’s plan into a useful list.",
    description:
      "Select meals from your plan and AskChef gathers their ingredients into a grocery list you can review, edit, check off, and share.",
    points: ["Build from selected meals", "Add recipes or one-off items", "Track needed, home, and cart"],
  },
];

const importMethods = [
  { icon: "safari", title: "From Safari", text: "Send a recipe from the web straight to AskChef while you browse." },
  { icon: "book", title: "Cookbook photos", text: "Photograph one or more pages, mark the useful areas, and shape them into a recipe." },
  { icon: "photo", title: "Screenshots", text: "Import recipe screenshots and extract the ingredients, steps, details, and notes." },
  { icon: "sparkles", title: "Create with AskChef", text: "Describe what you want to make and build the recipe through a focused conversation." },
  { icon: "text", title: "Paste or type", text: "Bring in copied text or enter a family recipe by hand when that is the simplest path." },
];

const faqItems = [
  { question: "What is AskChef?", answer: "AskChef is a recipe and cooking companion. It brings recipe importing, a personal cookbook, hands-free cooking help, meal planning, and grocery lists into one app." },
  { question: "How can I add recipes?", answer: "You can import from Safari, cookbook photos, screenshots, pasted text, and manual entry. You can also create a new recipe with the AskChef recipe builder." },
  { question: "Can AskChef answer questions about the recipe I am cooking?", answer: "Yes. AskChef uses the active recipe and your cooking context to answer questions about ingredients, steps, timing, substitutions, and what comes next." },
  { question: "Can I use AskChef with Siri?", answer: "AskChef is designed so you can say “Hey Siri, Ask Chef” and ask short cooking questions, check ingredients, move through steps, and manage timers without opening the app." },
  { question: "How do meal plans and grocery lists work together?", answer: "Plan saved recipes on the days ahead, select the meals you want to shop for, and build a grocery list from their ingredients. You can review and edit the list before taking it to the store." },
  { question: "Does AskChef replace food-safety advice?", answer: "No. AskChef can make mistakes. Always verify allergens, doneness, appliance safety, temperatures, and other food-safety decisions." },
];

const contentSections = [
  {
    title: "A home for the recipes you actually use",
    paragraphs: [
      "AskChef helps you collect recipes from the web, cookbook photos, screenshots, copied text, and your own ideas. Each one becomes a consistent workspace with ingredients, steps, useful details, and notes.",
      "Your cookbook is not just storage. It is the starting point for cooking, meal planning, and grocery lists, so the recipe stays useful after you save it.",
    ],
  },
  {
    title: "Cooking help with the full recipe in view",
    paragraphs: [
      "Cooking gets harder at exactly the moment your hands are busiest. AskChef is built for quick questions in the app or through Siri, with answers grounded in the active recipe and your place in it.",
      "Ask what comes next, check an ingredient, clarify a technique, find a substitution, or manage a timer. The goal is a concise answer that keeps you moving rather than another page to search.",
    ],
  },
  {
    title: "From a plan to a list",
    paragraphs: [
      "Choose recipes from your cookbook and place them across the days ahead. When it is time to shop, select the planned meals you want and build a grocery list from their ingredients.",
      "The list remains yours to review: add a recipe, add one ingredient, edit an item, mark what is already at home, and check things off as they enter the cart.",
    ],
  },
];

const supportTopics = [
  "App issues or bugs", "Recipe import problems", "Voice, Siri, or microphone issues", "Timer issues",
  "Meal plan or grocery list issues", "Account access or deletion", "Privacy questions", "Billing or subscription questions, if applicable",
];

const legalLinks = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const legalDocuments = { terms: { markdown: termsOfUseMarkdown }, privacy: { markdown: privacyPolicyMarkdown } };

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    arrowUp: <path d="m6 15 6-6 6 6M12 9v10" />,
    back: <path d="m15 18-6-6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
    basket: <><path d="m6 9 3-5m9 5-3-5M4 9h16l-1.4 10H5.4L4 9Z" /><path d="M9 13v3m6-3v3" /></>,
    pot: <><path d="M5 9h14v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9ZM3 9h18M2 12h3m14 0h3M9 3v3m6-3v3" /></>,
    mic: <><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" /></>,
    timer: <><circle cx="12" cy="13" r="8" /><path d="M9 2h6M12 13l3-3" /></>,
    safari: <><circle cx="12" cy="12" r="9" /><path d="m14.5 9.5-1.7 3.3-3.3 1.7 1.7-3.3 3.3-1.7Z" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" /></>,
    photo: <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m5 18 5-5 3 3 2-2 4 4" /></>,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Zm13-2 .8 2.2L21 15l-2.2.8L18 18l-.8-2.2L15 15l2.2-.8L18 12Z" /></>,
    text: <path d="M4 6h16M8 6v13m8-13v13M5 19h6m2 0h6" />,
    list: <><path d="M10 6h10M10 12h10M10 18h10" /><circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="5" cy="18" r="1" fill="currentColor" stroke="none" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    share: <><path d="M12 3v12m0-12 4 4m-4-4L8 7" /><path d="M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8" /></>,
  };
  return <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>{paths[name] || paths.sparkles}</svg>;
}

function Brand({ compact = false, tagline = false }) {
  return <span className={`brand-lockup ${compact ? "compact" : ""}`}><img src="/askchef-logo-180.png" alt="" aria-hidden="true" /><span className="brand-text"><span>AskChef</span>{tagline ? <small>Your kitchen companion</small> : null}</span></span>;
}

function AppStoreLink({ className = "primary-button", placement, children = "Download on the App Store" }) {
  return (
    <a className={className} href={APP_STORE_URL} onClick={() => trackEvent("app_store_click", { placement })}>
      {children} <Icon name="arrow" size={17} />
    </a>
  );
}

function SiteHeader({ currentPage }) {
  const isHome = currentPage === "home";
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
    };
    updateHeaderHeight();
    const observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        <a href="/" aria-label="AskChef home"><Brand compact tagline /></a>
        <nav className="site-nav" aria-label="Primary navigation">
          {isHome ? <><a href="#recipes">Recipes</a><a href="#cook">Cook</a><a href="#plan">Meal plans</a><a href="#shop">Groceries</a></> : <><a href="/#recipes">Recipes</a><a href="/#cook">Cook</a><a href="/faq" aria-current={currentPage === "faq" ? "page" : undefined}>FAQ</a><a href="/support" aria-current={currentPage === "support" ? "page" : undefined}>Support</a></>}
        </nav>
        <AppStoreLink className="header-cta" placement="header">Get AskChef</AppStoreLink>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><Brand compact /><p>A calmer way to collect, cook, plan, and shop.</p></div>
        <div className="footer-nav-grid">
          <nav aria-label="Product"><strong>Product</strong><a href="/#recipes">Recipes</a><a href="/#cook">Cooking companion</a><a href="/#plan">Meal plans</a><a href="/#shop">Grocery lists</a></nav>
          <nav aria-label="Company"><strong>AskChef</strong><AppStoreLink className="footer-download" placement="footer">App Store</AppStoreLink><a href="/what-we-do">What we do</a><a href="/faq">FAQ</a><a href="/support">Support</a></nav>
          <nav aria-label="Legal"><strong>Legal</strong>{legalLinks.map((link) => <a href={link.href} key={link.href}>{link.label}</a>)}</nav>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Initiatives VLA inc.</span><span>Made for real kitchens.</span></div>
    </footer>
  );
}

function SiteShell({ currentPage, children }) {
  return <div className="page"><SiteHeader currentPage={currentPage} /><main>{children}</main><SiteFooter /></div>;
}

function AppScreen({ type = "recipes", className = "", label }) {
  const screenshot = appScreenshots[type];
  return (
    <div className={`phone real-app-screen capture-${type} ${className}`}>
      <div className="app-capture">
        <img src={`/app-screenshots/${screenshot.src}.webp`} alt={label || screenshot.alt} width="600" height="1298" loading={className.includes("hero-phone") ? "eager" : "lazy"} fetchPriority={className.includes("hero-phone") ? "high" : "auto"} />
      </div>
    </div>
  );
}

function LandingPage() {
const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
const [verticalTabs, setVerticalTabs] = useState(() =>
  window.matchMedia("(min-width: 1024px)").matches
);
const activeFeature = featureItems[activeFeatureIndex] ?? featureItems[0];
const featureIcon = (id) =>
  id === "recipes" ? "book" : id === "cook" ? "mic" : id === "plan" ? "calendar" : "basket";

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateOrientation = (event) => setVerticalTabs(event.matches);
    media.addEventListener("change", updateOrientation);
    return () => media.removeEventListener("change", updateOrientation);
  }, []);

  const handleAppStoreClick = () => {
    trackEvent("app_store_download_click", { placement: "hero" });
  };

  return (
    <SiteShell currentPage="home">
      <section className="hero">
        <section className="hero-copy">
          <h1>One calm place to cook.</h1>
          <p className="subtext">
            From inspiration to dinner, without stitching together four different apps.
            Bring your recipes together, plan what’s next, and get a little help while
            you cook.
          </p>

          <section className="hero-journey journey-inner" aria-label="AskChef product journey">
            <ol className="journey-steps">
              <li><span className="journey-icon"><Icon name="book" size={18} /></span><span className="journey-label">Save recipes from anywhere</span></li>
              <li><span className="journey-icon"><Icon name="calendar" size={18} /></span><span className="journey-label">Plan meals for your week</span></li>
              <li><span className="journey-icon"><Icon name="basket" size={18} /></span><span className="journey-label">Shop with a smarter list</span></li>
              <li><span className="journey-icon"><Icon name="pot" size={18} /></span><span className="journey-label">Cook with clear answers</span></li>
            </ol>
          </section>

          <div className="hero-actions">
            <section className="feature-carousel" aria-label="AskChef features">
              <article className="carousel-card">
                <h3>{activeFeature.title}</h3>
                <p>{activeFeature.description}</p>

                <div className="carousel-footer">
                  <div className="carousel-dots" aria-label="Choose a feature">
                    {featureItems.map((feature, index) => (
                      <button
                        className={`carousel-dot ${
                          index === activeFeatureIndex ? "active" : ""
                        }`}
                        type="button"
                        aria-pressed={index === activeFeatureIndex}
                        aria-label={`Show feature ${index + 1}: ${feature.title}`}
                        key={feature.title}
                        onClick={() => setActiveFeatureIndex(index)}
                      />
                    ))}
                  </div>

                  <div className="carousel-controls">
                    <button
                      className="carousel-button"
                      type="button"
                      aria-label="Previous feature"
                      onClick={() =>
                        setActiveFeatureIndex((currentIndex) => {
                          return (
                            (currentIndex - 1 + featureItems.length) %
                            featureItems.length
                          );
                        })
                      }
                    >
                      <span aria-hidden="true">&lt;</span>
                    </button>
                    <button
                      className="carousel-button"
                      type="button"
                      aria-label="Next feature"
                      onClick={() =>
                        setActiveFeatureIndex((currentIndex) => {
                          return (currentIndex + 1) % featureItems.length;
                        })
                      }
                    >
                      <span aria-hidden="true">&gt;</span>
                    </button>
                  </div>
                </div>
              </article>
            </section>

            <a
              className="button app-store-button"
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAppStoreClick}
              aria-label="Download AskChef on the App Store"
            >
              Download AskChef on the App Store
            </a>
          </div>
        </section>

        <section>
          <div className="phone-wrap">
            <div className="phone-glow"></div>

            <div className="phone-shell">
              <div className="phone-inner">
                <div className="screen">
                  <img
                    className="screen-image"
                    src={askChefPhoneScreen}
                    alt="AskChef ingredients screen"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="tour-section" id="explore" aria-labelledby="tour-heading">
      </section>

      <section className="tour-section" id="explore" aria-labelledby="tour-heading">
        <div className="tour-content section-shell">
          <div className="tour-heading">
            <h2 id="tour-heading">Meet the whole cooking loop.</h2>
            <p>Move from saved idea to finished meal without losing the recipe or your place in it.</p>
          </div>
          <div className="tour-tabs" role="tablist" aria-label="AskChef features" aria-orientation={verticalTabs ? "vertical" : "horizontal"}>
            {featureTour.map((feature, index) => (
              <button
                aria-controls="feature-panel"
                aria-selected={activeFeature === feature.id}
                className={activeFeature === feature.id ? "active" : ""}
                id={`feature-tab-${feature.id}`}
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                onKeyDown={(event) => {
                  const nextKey = verticalTabs ? "ArrowDown" : "ArrowRight";
                  const previousKey = verticalTabs ? "ArrowUp" : "ArrowLeft";
                  const nextIndex = event.key === nextKey ? (index + 1) % featureTour.length
                    : event.key === previousKey ? (index + featureTour.length - 1) % featureTour.length
                    : event.key === "Home" ? 0 : event.key === "End" ? featureTour.length - 1 : null;
                  if (nextIndex === null) return;
                  event.preventDefault();
                  setActiveFeature(featureTour[nextIndex].id);
                  event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[nextIndex].focus();
                }}
                role="tab"
                tabIndex={activeFeature === feature.id ? 0 : -1}
                type="button"
              >
                <Icon name={featureIcon(feature.id)} size={18} />
                {feature.id === "recipes" ? "Recipes" : feature.id === "cook" ? "Cook" : feature.id === "plan" ? "Meal plans" : "Groceries"}
              </button>
            ))}
          </div>
          <div aria-labelledby={`feature-tab-${active.id}`} className="tour-panel" id="feature-panel" key={active.id} role="tabpanel" tabIndex={0}>
            <div className="tour-copy"><h3>{active.title}</h3><p>{active.description}</p><ul>{active.points.map((point) => <li key={point}><span><Icon name="check" size={13} strokeWidth={2.3} /></span>{point}</li>)}</ul><a className="text-link" href={`#${active.id}`}>See how it works <Icon name="arrow" size={16} /></a></div>
            <div className={`tour-visual ${active.id}`}><div className="tour-halo" aria-hidden="true" /><AppScreen type={active.id} /></div>
          </div>
        </div>
      </section>

      <section className="import-section feature-section section-shell" id="recipes" aria-labelledby="import-heading">
        <div className="section-heading"><h2 id="import-heading">However you found it, bring it with you.</h2><p>AskChef gives every recipe the same calm, useful shape, no matter where it started.</p></div>
        <div className="import-layout">
          <div className="import-methods">{importMethods.map((method, index) => <article className={index === 0 ? "import-card featured" : "import-card"} key={method.title}><span className="method-icon"><Icon name={method.icon} size={21} /></span><div><h3>{method.title}</h3><p>{method.text}</p></div><span className="method-arrow"><Icon name="arrow" size={17} /></span></article>)}</div>
          <div className="import-screenshots">
            <figure><AppScreen type="safari" /><figcaption>Save a recipe from Safari.</figcaption></figure>
            <figure><AppScreen type="builder" /><figcaption>Build a recipe with AskChef.</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="cook-feature feature-section" id="cook" aria-labelledby="cook-heading">
        <div className="section-shell cook-grid">
          <div className="cook-visual"><AppScreen type="cook" /><div className="siri-orb"><span><Icon name="sparkles" size={24} /></span><small>Hey Siri, Ask Chef…</small></div></div>
          <div className="feature-copy"><h2 id="cook-heading">Ask the recipe.<br />Keep your hands moving.</h2><p className="feature-lede">AskChef carries the recipe context with you, so a quick question gets a quick, relevant answer—not a new search.</p><div className="question-list"><blockquote>“How much garlic goes in?”</blockquote><blockquote>“What can I use instead of cream?”</blockquote><blockquote>“Set a timer for the next step.”</blockquote></div><div className="feature-details"><article><span><Icon name="mic" size={19} /></span><div><h3>In the app or through Siri</h3><p>Ask short cooking questions without leaving the task in front of you.</p></div></article><article><span><Icon name="sparkles" size={19} /></span><div><h3>Grounded in your recipe</h3><p>Ingredients, steps, timing, notes, and current position give every answer context.</p></div></article><article><span><Icon name="timer" size={19} /></span><div><h3>Timers stay close</h3><p>Start, check, pause, and manage cooking timers as part of the same flow.</p></div></article></div></div>
        </div>
      </section>

      <section className="plan-feature feature-section section-shell" id="plan" aria-labelledby="plan-heading">
        <div className="section-heading centered narrow"><h2 id="plan-heading">Plan the meals. Build the list.</h2><p>Your cookbook does more than hold recipes. It becomes the plan for the week and the starting point for your next grocery run.</p></div>
        <div className="plan-flow" id="shop">
          <article className="flow-card plan-card"><div className="flow-card-header"><span><Icon name="calendar" size={20} /></span><div><small>Step 1</small><h3>Choose your meals</h3></div></div><AppScreen type="plan" /></article>
          <div className="flow-connector" aria-hidden="true"><span><Icon name="arrow" size={20} /></span><small>Select meals</small></div>
          <article className="flow-card grocery-card"><div className="flow-card-header"><span><Icon name="basket" size={20} /></span><div><small>Step 2</small><h3>Shop with a clear list</h3></div></div><AppScreen type="shop" /></article>
        </div>
        <div className="plan-benefits"><article><span>01</span><h3>Plan from your cookbook</h3><p>Choose the recipes you already saved instead of rebuilding dinner plans from scratch.</p></article><article><span>02</span><h3>Select what you’re shopping for</h3><p>Build a list from the exact planned meals you want—today, this weekend, or the week ahead.</p></article><article><span>03</span><h3>Make the list yours</h3><p>Add one-off items, edit wording, mark what is at home, and check groceries into the cart.</p></article></div>
      </section>

      <section className="download-section section-shell" id="download" aria-labelledby="download-heading"><div className="download-card"><div className="download-copy"><p className="eyebrow light">Available on the App Store</p><h2 id="download-heading">Bring AskChef into your kitchen.</h2><p>Save your next recipe, plan a meal, and get a little help when your hands are full.</p></div><div className="download-action"><img src="/askchef-logo-180.png" alt="" width="72" height="72" /><AppStoreLink placement="download-section" /><span>For iPhone</span></div></div></section>
    </SiteShell>
  );
}

const normalizePathname = (pathname) => pathname.replace(/\/+$/, "") || "/";
const setMetaTag = (name, content) => { let tag = document.querySelector(`meta[name="${name}"]`); if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); } tag.setAttribute("content", content); };
const setCanonicalTag = (href) => { let tag = document.querySelector('link[rel="canonical"]'); if (!tag) { tag = document.createElement("link"); tag.setAttribute("rel", "canonical"); document.head.appendChild(tag); } tag.setAttribute("href", href); };
const applyPageMeta = (meta) => { document.title = meta.title; setMetaTag("description", meta.description); setCanonicalTag(meta.canonical); };
const redirectApexToWww = () => { if (window.location.hostname !== "ask-chef.com") return false; window.location.replace(`https://www.ask-chef.com${window.location.pathname}${window.location.search}${window.location.hash}`); return true; };

const parseMarkdown = (markdown) => {
  const blocks = []; const lines = markdown.trim().split(/\r?\n/); let paragraph = []; let list = null;
  const flushParagraph = () => { if (!paragraph.length) return; blocks.push({ type: "paragraph", lines: paragraph }); paragraph = []; };
  const flushList = () => { if (!list) return; blocks.push(list); list = null; };
  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/); const unorderedMatch = line.match(/^\s*-\s+(.+)$/); const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (!line.trim()) { flushParagraph(); flushList(); return; }
    if (headingMatch) { flushParagraph(); flushList(); blocks.push({ type: "heading", level: headingMatch[1].length, text: headingMatch[2] }); return; }
    if (unorderedMatch || orderedMatch) { flushParagraph(); const ordered = Boolean(orderedMatch); const text = unorderedMatch?.[1] || orderedMatch[1]; if (!list || list.ordered !== ordered) { flushList(); list = { type: "list", ordered, items: [] }; } list.items.push(text); return; }
    flushList(); paragraph.push({ text: line.replace(/\s{2}$/, ""), hardBreak: /\s{2}$/.test(line) });
  });
  flushParagraph(); flushList(); return blocks;
};

const renderInlineLinks = (text) => text.split(/(https:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g).map((part, index) => {
  if (part.startsWith("https://") || /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) return <a key={`${part}-${index}`} href={part.startsWith("https://") ? part : `mailto:${part}`}>{part}</a>;
  return part;
});
const renderInlineMarkdown = (text) => text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**") ? <strong key={`${part}-${index}`}>{renderInlineLinks(part.slice(2, -2))}</strong> : renderInlineLinks(part));

function MarkdownDocument({ headingId, markdown }) {
  return <article className="legal-document">{parseMarkdown(markdown).map((block, index) => {
    if (block.type === "heading") { const HeadingTag = `h${block.level}`; return <HeadingTag id={index === 0 && block.level === 1 ? headingId : undefined} key={`${block.text}-${index}`}>{renderInlineMarkdown(block.text)}</HeadingTag>; }
    if (block.type === "list") { const ListTag = block.ordered ? "ol" : "ul"; return <ListTag key={`list-${index}`}>{block.items.map((item) => <li key={item}>{renderInlineMarkdown(item)}</li>)}</ListTag>; }
    return <p key={`paragraph-${index}`}>{block.lines.map((line, lineIndex) => <span key={`${line.text}-${lineIndex}`}>{renderInlineMarkdown(line.text)}{line.hardBreak ? <br /> : " "}</span>)}</p>;
  })}</article>;
}

function StandardPage({ currentPage, eyebrow, title, intro, children }) {
  return <SiteShell currentPage={currentPage}><section className="standard-page section-shell"><div className="standard-page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{intro ? <p>{intro}</p> : null}</div>{children}</section></SiteShell>;
}

function WhatWeDoPage() {
  return <StandardPage currentPage="what-we-do" eyebrow="What we do" title="One companion for the whole meal." intro="AskChef connects the parts of home cooking that usually live in separate tabs, notes, and apps."><div className="editorial-grid">{contentSections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article>)}</div><aside className="page-cta"><div><h2>Try AskChef in your kitchen.</h2><p>Available now on the App Store for iPhone.</p></div><AppStoreLink placement="what-we-do" /></aside></StandardPage>;
}

function FaqPage() {
  return <StandardPage currentPage="faq" eyebrow="Questions, answered" title="Frequently asked questions" intro="A quick guide to your AskChef kitchen companion."><div className="faq-list">{faqItems.map((item) => <details key={item.question}><summary><span>{item.question}</span><i><Icon name="plus" size={18} /></i></summary><p>{item.answer}</p></details>)}</div><aside className="page-cta"><div><h2>Ready to cook?</h2><p>Get AskChef for iPhone on the App Store.</p></div><AppStoreLink placement="faq" /></aside></StandardPage>;
}

function SupportPage() {
  return <StandardPage currentPage="support" eyebrow="Support" title="How can we help?" intro="For app support, privacy questions, account requests, billing, or legal inquiries, send us a note."><div className="support-layout"><a className="support-contact" href={`mailto:${SUPPORT_EMAIL}`}><span>@</span><div><small>Email us</small><strong>{SUPPORT_EMAIL}</strong><p>We aim to respond as soon as reasonably possible.</p></div><Icon name="arrow" size={20} /></a><section className="support-topics"><h2>What we can help with</h2><ul>{supportTopics.map((topic) => <li key={topic}><Icon name="check" size={13} />{topic}</li>)}</ul></section></div><div className="safety-note"><span>!</span><div><h2>Important safety note</h2><p>AskChef is an AI cooking assistant and may make mistakes. Always verify allergens, doneness, appliance safety, temperatures, and food-safety decisions.</p></div></div></StandardPage>;
}

function LegalDocumentPage({ documentKey }) {
  return <SiteShell currentPage={documentKey}><section className="legal-page section-shell" aria-labelledby={`${documentKey}-heading`}><MarkdownDocument headingId={`${documentKey}-heading`} markdown={legalDocuments[documentKey].markdown} /></section></SiteShell>;
}

export default function App() {
  const pathname = normalizePathname(window.location.pathname);
  const pageKey =
    {
      "/support": "support",
      "/what-we-do": "whatWeDo",
      "/faq": "faq",
      "/terms": "terms",
      "/privacy": "privacy",
    }[pathname] || "home";

  useEffect(() => {
    if (redirectApexToWww()) {
      return;
    }

    applyPageMeta(pageMeta[pageKey]);
  }, [pageKey]);

  return (
    <>
      <style>{`
        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          border: 0;
          outline: none;
          width: 100%;
          max-width: 100%;
          overflow-x: clip;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          letter-spacing: 0;
          background: #fbf3e9;
          color: #0e3b31;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          border: 0;
          outline: none;
          overflow-x: clip;
          background:
            radial-gradient(circle at top, rgba(14, 59, 49, 0.10), transparent 30%),
            radial-gradient(circle at 80% 20%, rgba(0, 60, 50, 0.08), transparent 25%),
            linear-gradient(to bottom, rgba(255,255,255,0.35), transparent);
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 24px;
          text-align: left;
        }

        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 28px;
          padding: 12px 20px;
          border-radius: 24px;
          background: #0e3b31;
          border: 1px solid rgba(251, 243, 233, 0.18);
          box-shadow: 0 16px 34px rgba(14, 59, 49, 0.16);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #fbf3e9;
          font-weight: 800;
          font-size: 19px;
          white-space: nowrap;
        }

        .brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
        }

        .site-nav {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0;
        }

        .site-nav a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
          padding: 0;
          color: rgba(251, 243, 233, 0.82);
          font-size: 14px;
          font-weight: 700;
        }

        .site-nav a:hover,
        .site-nav a[aria-current="page"] {
          color: #fbf3e9;
          text-decoration: underline;
          text-underline-offset: 5px;
        }

        .site-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 28px;
          padding: 26px 0 10px;
          color: rgba(14, 59, 49, 0.62);
          font-size: 13px;
        }

        .site-footer div {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .site-footer strong {
          color: #003c32;
          font-size: 15px;
        }

        .site-footer span {
          line-height: 1.4;
        }

        .footer-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-links a {
          color: #0e3b31;
          font-weight: 700;
        }

        .footer-placeholder {
          color: rgba(14, 59, 49, 0.46);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 44px;
          align-items: center;
          padding: 0 0 32px;
        }

        .hero-copy {
          display: grid;
          gap: 16px;
          align-content: start;
        }

        h1 {
          margin: 0;
          max-width: none;
          font-size: 48px;
          line-height: 1.04;
          letter-spacing: 0;
          color: #003c32;
        }

        h1,
        h2,
        h3 {
          text-wrap: balance;
        }

        .subtext {
          margin: 0;
          max-width: 700px;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(14, 59, 49, 0.78);
        }

        .hero-actions {
          display: grid;
          grid-template-columns: 1fr;
          width: min(100%, 340px);
          gap: 12px;
          align-items: stretch;
          margin-top: 12px;
        }

        .feature-carousel,
        .carousel-card {
          height: 100%;
          min-height: 228px;
        }

        .carousel-card {
          display: flex;
          flex-direction: column;
          padding: 16px;
          border-radius: 24px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(14, 59, 49, 0.10);
          box-shadow: 0 12px 28px rgba(14, 59, 49, 0.06);
        }

        .carousel-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
          padding-top: 16px;
        }

        .carousel-controls {
          display: flex;
          gap: 5px;
        }

        .carousel-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(14, 59, 49, 0.14);
          border-radius: 12px;
          background: transparent;
          color: #0e3b31;
          font-size: 16px;
          cursor: pointer;
        }

        .carousel-button:hover {
          background: rgba(14, 59, 49, 0.08);
        }

        .carousel-card h3 {
          margin: 0 0 8px;
          font-size: 16px;
          line-height: 1.35;
          color: #003c32;
        }

        .carousel-card p {
          margin: 0;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(14, 59, 49, 0.70);
        }

        .carousel-dots {
          display: flex;
          gap: 7px;
        }

        .carousel-dot {
          width: 24px;
          height: 5px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: rgba(14, 59, 49, 0.18);
          cursor: pointer;
        }

        .carousel-dot.active {
          background: #0e3b31;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 50px;
          padding: 0 22px;
          border: 0;
          border-radius: 18px;
          background: #0e3b31;
          color: #fbf3e9;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          cursor: pointer;
        }

        .button:hover {
          background: #003c32;
        }

        .button:disabled {
          opacity: 0.8;
          cursor: wait;
        }

        .app-store-button {
          width: 100%;
          min-height: 56px;
          background: #0e3b31;
          color: #fbf3e9;
          box-shadow: 0 16px 34px rgba(14, 59, 49, 0.16);
        }

        .app-store-button:hover {
          background: #003c32;
        }

        .page-layout {
          padding: 0 0 32px;
        }

        .section-panel,
        .faq-section,
        .support-panel,
        .legal-document {
          border-radius: 28px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(14, 59, 49, 0.10);
          box-shadow: 0 12px 28px rgba(14, 59, 49, 0.06);
        }

        .section-panel,
        .faq-section,
        .support-panel,
        .legal-document {
          padding: 24px;
        }

        .section-panel h1,
        .faq-section h1,
        .support-panel h1,
        .legal-document h1 {
          margin: 0 0 12px;
          font-size: 42px;
          line-height: 1.08;
          letter-spacing: 0;
          color: #003c32;
        }

        .legal-document h2 {
          margin: 28px 0 10px;
          padding-top: 20px;
          border-top: 1px solid rgba(14, 59, 49, 0.10);
          font-size: 24px;
          line-height: 1.25;
          color: #003c32;
        }

        .legal-document h3 {
          margin: 22px 0 8px;
          font-size: 18px;
          line-height: 1.35;
          color: #003c32;
        }

        .section-panel h2,
        .faq-section h2,
        .support-row h2 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: 0;
          color: #003c32;
        }

        .content-item,
        .faq-row,
        .support-row {
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid rgba(14, 59, 49, 0.10);
        }

        .content-item h2,
        .faq-row h2 {
          margin: 0 0 8px;
          font-size: 18px;
          line-height: 1.35;
          color: #003c32;
        }

        .content-item p,
        .faq-row p,
        .support-row p,
        .legal-document p,
        .legal-document li {
          margin: 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(14, 59, 49, 0.74);
        }

        .content-item p + p,
        .support-row p + p,
        .legal-document p + p {
          margin-top: 14px;
        }

        .legal-document ul,
        .legal-document ol {
          display: grid;
          gap: 8px;
          margin: 12px 0 0;
          padding-left: 22px;
          color: rgba(14, 59, 49, 0.74);
        }

        .legal-document strong {
          color: #003c32;
        }

        .faq-section {
          margin-top: 18px;
        }

        .phone-wrap {
          position: relative;
          width: 320px;
          margin: 0 auto;
        }

        .phone-glow {
          position: absolute;
          inset: -24px;
          background: rgba(14, 59, 49, 0.12);
          filter: blur(40px);
          border-radius: 56px;
        }

        .phone-shell {
          position: relative;
          width: 320px;
          height: 650px;
          padding: 10px;
          border-radius: 46px;
          background: linear-gradient(180deg, #173f36 0%, #0e3b31 100%);
          border: 1px solid rgba(14, 59, 49, 0.16);
          box-shadow: 0 26px 70px rgba(14, 59, 49, 0.18);
        }

        .phone-inner {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 36px;
          background: #f7efe4;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .screen {
          position: relative;
          height: 100%;
          overflow: hidden;
          background: #f7efe4;
        }

        .screen-image {
          display: block;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .support-lede {
          margin: 0 0 14px;
          max-width: 700px;
          font-size: 19px;
          line-height: 1.65;
          color: rgba(14, 59, 49, 0.78);
        }

        .support-email-inline {
          display: inline;
          color: #003c32;
          font-weight: 800;
          overflow-wrap: anywhere;
        }

        .support-email-inline:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .support-response {
          color: rgba(14, 59, 49, 0.62);
        }

        .topic-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 18px;
          margin: 16px 0 0;
          padding: 0;
          list-style: none;
        }

        .topic-list li {
          position: relative;
          min-height: 30px;
          padding-left: 18px;
          color: rgba(14, 59, 49, 0.76);
          font-size: 15px;
          line-height: 1.55;
        }

        .topic-list li::before {
          content: "";
          position: absolute;
          top: 9px;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #0e3b31;
        }

        .legal-inline {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .legal-inline a,
        .legal-placeholder {
          color: rgba(14, 59, 49, 0.70);
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
            justify-items: center;
          }

          .hero-copy {
            justify-items: center;
            text-align: center;
          }

          .subtext,
          .hero-actions {
            margin-left: auto;
            margin-right: auto;
          }

          .carousel-card {
            text-align: center;
          }

          h1 {
            font-size: 44px;
          }

          .topic-list {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 640px) {
          .container {
            padding: 18px;
          }

          .site-header {
            align-items: center;
            flex-direction: row;
            gap: 8px;
            padding: 10px 20px;
          }

          .brand {
            gap: 7px;
            font-size: 15px;
          }

          .brand-mark {
            width: 30px;
            height: 30px;
            border-radius: 10px;
          }

          .site-nav {
            flex: 1;
            justify-content: flex-end;
            width: auto;
            gap: 7px;
            padding: 0;
          }

          .site-nav a {
            flex: 0 1 auto;
            min-height: 30px;
            padding: 0;
            font-size: 11px;
            white-space: nowrap;
          }

          .site-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-links {
            justify-content: flex-start;
          }

          h1 {
            font-size: 28px;
          }

          .subtext,
          .content-item p,
          .faq-row p,
          .support-row p {
            font-size: 16px;
          }

          .section-panel,
          .faq-section,
          .support-panel,
          .legal-document {
            padding: 18px;
          }

          .section-panel h2,
          .faq-section h2,
          .support-row h2 {
            font-size: 24px;
          }

          .section-panel h1,
          .faq-section h1,
          .support-panel h1,
          .legal-document h1 {
            font-size: 32px;
          }

          .legal-document h2 {
            font-size: 22px;
          }

          .support-lede {
            font-size: 17px;
          }

          .phone-wrap,
          .phone-shell {
            width: 290px;
          }

          .phone-shell {
            height: 590px;
          }
        }

        @media (max-width: 520px) {
          h1 {
            font-size: 22px;
          }

          .hero-actions {
            grid-template-columns: 1fr;
          }

          .feature-carousel,
          .carousel-card {
            min-height: 210px;
          }
        }
      `}</style>

      {pageKey === "support" ? (
        <SupportPage />
      ) : pageKey === "whatWeDo" ? (
        <WhatWeDoPage />
      ) : pageKey === "faq" ? (
        <FaqPage />
      ) : pageKey === "terms" || pageKey === "privacy" ? (
        <LegalDocumentPage documentKey={pageKey} />
      ) : (
        <LandingPage />
      )}
    </>
  );
}
