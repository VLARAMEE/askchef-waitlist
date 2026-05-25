import { useEffect, useState } from "react";
import { trackEvent } from "./analytics";
import { supabase } from "./supabase.Client";
import askChefPhoneScreen from "./assets/askchef-phone-screen.png";
import privacyPolicyMarkdown from "./legal/privacy-policy.md?raw";
import termsOfUseMarkdown from "./legal/terms-of-use.md?raw";

const SUPPORT_EMAIL = "support@ask-chef.com";

const pageMeta = {
  home: {
    title: "AskChef | AI Cooking Assistant for Hands-Free, Voice-First Cooking",
    description:
      "AskChef is an AI cooking assistant for hands-free, voice-first cooking. Ask recipe questions, get step-by-step guidance, and cook with less phone touching.",
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
      "Learn how AskChef helps home cooks with hands-free, voice-first recipe guidance, timing, substitutions, and cooking questions.",
    canonical: "https://www.ask-chef.com/what-we-do",
  },
  faq: {
    title: "FAQ | AskChef",
    description:
      "Answers to common questions about AskChef, the AI cooking assistant for hands-free, voice-first cooking support.",
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

const contentSections = [
  {
    title: "What is AskChef?",
    paragraphs: [
      "AskChef is an AI cooking assistant built for home cooks who want help in the moment. The Ask Chef app is designed to answer recipe questions, explain techniques, and guide you through a dish while your attention stays on the stove.",
      "Think of the AskChef as an assistant for cooking that can help with ingredients, timing, substitutions, and next steps. It is made for the moments when you need clear guidance fast without breaking your flow in the kitchen.",
    ],
  },
  {
    title: "Why use an AI cooking assistant?",
    paragraphs: [
      "Cooking usually gets harder right when your hands are busy and you need one quick answer. An AI cooking assistant can keep you moving by helping with timing, ingredient swaps, unfamiliar terms, and step-by-step clarification exactly when you need it.",
      "Instead of stopping to search, scroll, and reread, a voice-first cooking assistant helps you stay focused on the meal in front of you. That means less friction, more confidence, and a smoother way to learn while you cook.",
    ],
  },
  {
    title: "Cook hands-free with AskChef",
    paragraphs: [
      "AskChef is built as a hands-free cooking assistant for real kitchens, where you are stirring, chopping, or carrying a pan when questions pop up. You can ask recipe questions while cooking and get practical guidance without constantly touching your phone.",
      "If you want a voice-first cooking assistant that feels useful from prep through plating, AskChef keeps the next step close at hand. It turns recipes into a more natural guided session so you can keep cooking instead of hunting for answers.",
    ],
  },
];

const faqItems = [
  {
    question: "What is AskChef?",
    answer:
      "AskChef is a cooking companion that helps you move through recipes, ingredients, and timing with quick answers while you cook.",
  },
  {
    question: "Is AskChef an AI cooking assistant?",
    answer:
      "Yes. AskChef is an AI cooking assistant designed to answer recipe questions, clarify steps, and support cooks in real time.",
  },
  {
    question: "How does AskChef support voice-first cooking?",
    answer:
      "AskChef is built around voice-first cooking so you can ask for the next step, ingredient details, or timing help without stopping what you are doing.",
  },
  {
    question: "Can AskChef help me cook hands-free?",
    answer:
      "Yes. AskChef is meant for hands-free cooking moments when your hands are messy, occupied, or you simply do not want to keep tapping your phone.",
  },
  {
    question: "Can I ask recipe questions while cooking?",
    answer:
      "That is the core idea. AskChef is meant for in-the-moment recipe questions such as substitutions, technique help, timing, or what to do next.",
  },
];

const featureItems = [
  {
    title: "Cook hands-free",
    description:
      "Ask questions while cooking and get quick answers without touching your phone every minute.",
  },
  {
    title: "Turn any recipe into a guided session",
    description:
      "AskChef helps you move through ingredients, steps, and timing more naturally.",
  },
  {
    title: "Built for real kitchens",
    description:
      "Designed for messy hands, split attention, and those moments when you just need the next step fast.",
  },
];

const supportTopics = [
  "App issues or bugs",
  "Recipe import problems",
  "Voice or microphone issues",
  "Timer issues",
  "Account access or deletion",
  "Privacy questions",
  "Billing or subscription questions, if applicable",
  "Legal or Terms of Use questions",
];

const legalLinks = [
  {
    label: "Terms of Use",
    href: "/terms",
    isLive: true,
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    isLive: true,
  },
];

const legalDocuments = {
  terms: {
    markdown: termsOfUseMarkdown,
  },
  privacy: {
    markdown: privacyPolicyMarkdown,
  },
};

const normalizePathname = (pathname) => {
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned || "/";
};

const setMetaTag = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const setCanonicalTag = (href) => {
  let tag = document.querySelector('link[rel="canonical"]');

  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }

  tag.setAttribute("href", href);
};

const applyPageMeta = (meta) => {
  document.title = meta.title;
  setMetaTag("description", meta.description);
  setCanonicalTag(meta.canonical);
};

const redirectApexToWww = () => {
  if (window.location.hostname !== "ask-chef.com") {
    return false;
  }

  window.location.replace(
    `https://www.ask-chef.com${window.location.pathname}${window.location.search}${window.location.hash}`,
  );
  return true;
};

const parseMarkdown = (markdown) => {
  const blocks = [];
  const lines = markdown.trim().split(/\r?\n/);
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    blocks.push({
      type: "paragraph",
      lines: paragraph,
    });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) {
      return;
    }

    blocks.push(list);
    list = null;
  };

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    const unorderedMatch = line.match(/^\s*-\s+(.+)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      return;
    }

    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      return;
    }

    if (unorderedMatch || orderedMatch) {
      flushParagraph();

      const ordered = Boolean(orderedMatch);
      const text = unorderedMatch?.[1] || orderedMatch[1];

      if (!list || list.ordered !== ordered) {
        flushList();
        list = {
          type: "list",
          ordered,
          items: [],
        };
      }

      list.items.push(text);
      return;
    }

    flushList();
    paragraph.push({
      text: line.replace(/\s{2}$/, ""),
      hardBreak: /\s{2}$/.test(line),
    });
  });

  flushParagraph();
  flushList();

  return blocks;
};

const renderInlineMarkdown = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return part;
  });

function MarkdownDocument({ headingId, markdown }) {
  return (
    <article className="legal-document">
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = `h${block.level}`;

          return (
            <HeadingTag
              id={index === 0 && block.level === 1 ? headingId : undefined}
              key={`${block.text}-${index}`}
            >
              {renderInlineMarkdown(block.text)}
            </HeadingTag>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";

          return (
            <ListTag key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={`paragraph-${index}`}>
            {block.lines.map((line, lineIndex) => (
              <span key={`${line.text}-${lineIndex}`}>
                {renderInlineMarkdown(line.text)}
                {line.hardBreak ? <br /> : " "}
              </span>
            ))}
          </p>
        );
      })}
    </article>
  );
}

function SiteHeader({ currentPage }) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        aria-current={currentPage === "home" ? "page" : undefined}
        aria-label="AskChef home"
      >
        <img
          className="brand-mark"
          src="/askchef-logo-180.png"
          alt=""
          aria-hidden="true"
        />
        <span>AskChef</span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        <a
          href="/what-we-do"
          aria-current={currentPage === "what-we-do" ? "page" : undefined}
        >
          What we do
        </a>
        <a href="/faq" aria-current={currentPage === "faq" ? "page" : undefined}>
          FAQ
        </a>
        <a
          href="/support"
          aria-current={currentPage === "support" ? "page" : undefined}
        >
          Support
        </a>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>AskChef</strong>
        <span>AI cooking support for real kitchens by Initiatives VLA inc.</span>
      </div>

      <nav className="footer-links" aria-label="Footer navigation">
        <a href="/what-we-do">What we do</a>
        <a href="/faq">FAQ</a>
        <a href="/support">Support</a>
        {legalLinks.map((link) =>
          link.isLive ? (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ) : (
            <span
              className="footer-placeholder"
              data-href={link.href}
              key={link.label}
            >
              {link.label}
            </span>
          ),
        )}
      </nav>
    </footer>
  );
}

function SiteShell({ currentPage, children }) {
  return (
    <div className="page">
      <div className="container">
        <SiteHeader currentPage={currentPage} />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}

function LandingPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const activeFeature = featureItems[activeFeatureIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFeatureIndex((currentIndex) => {
        return (currentIndex + 1) % featureItems.length;
      });
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanFirstName = firstName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanEmail) {
      setSubmitMessage({
        type: "error",
        text: "Please enter both your first name and email.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const { error } = await supabase.from("waitlist_signups").insert([
        { first_name: cleanFirstName, email: cleanEmail },
      ]);

      if (error) {
        setSubmitMessage({
          type: "error",
          text: "Something went wrong. Please try again.",
        });
        return;
      }

      setFirstName("");
      setEmail("");
      trackEvent("waitlist_signup", { method: "waitlist_form" });
      setSubmitMessage({
        type: "success",
        text: "You are on the waitlist. We will be in touch soon.",
      });
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteShell currentPage="home">
      <section className="hero">
        <section className="hero-copy">
          <h1>
            AskChef is your AI cooking assistant for hands-free, voice-first
            support
          </h1>

          <p className="subtext">
            Ask your questions while you work. AskChef will help you move
            through ingredients, steps, and timing without constantly touching
            your phone.
          </p>

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

            <form className="signup-form" onSubmit={handleSubmit}>
              <p className="fine-print signup-prompt">
                Be the first to know when we launch.
              </p>

              <div className="form-grid">
                <input
                  className="input"
                  disabled={isSubmitting}
                  type="text"
                  value={firstName}
                  placeholder="First name"
                  onChange={(event) => setFirstName(event.target.value)}
                />
                <input
                  className="input"
                  disabled={isSubmitting}
                  type="email"
                  value={email}
                  placeholder="Email address"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="button" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Joining..." : "Notify me"}
                </button>
              </div>

              {submitMessage ? (
                <div
                  className={`submit-message ${submitMessage.type}`}
                  aria-live="polite"
                >
                  {submitMessage.text}
                </div>
              ) : null}
            </form>
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
    </SiteShell>
  );
}

function WhatWeDoPage() {
  return (
    <SiteShell currentPage="what-we-do">
      <section
        className="page-layout"
        id="what-we-do"
        aria-labelledby="what-we-do-heading"
      >
        <article className="section-panel">
          <h1 id="what-we-do-heading">What we do</h1>

          {contentSections.map((section) => (
            <section className="content-item" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </section>
    </SiteShell>
  );
}

function FaqPage() {
  return (
    <SiteShell currentPage="faq">
      <section className="page-layout" id="faq" aria-labelledby="faq-heading">
        <article className="faq-section">
          <h1 id="faq-heading">Frequently asked questions</h1>

          {faqItems.map((item) => (
            <section className="faq-row" key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </section>
          ))}
        </article>
      </section>
    </SiteShell>
  );
}

function EmailLink({ className = "" }) {
  return (
    <a className={className} href={`mailto:${SUPPORT_EMAIL}`}>
      {SUPPORT_EMAIL}
    </a>
  );
}

function SupportPage() {
  return (
    <SiteShell currentPage="support">
      <section className="page-layout" aria-labelledby="support-heading">
        <article className="support-panel">
          <h1 id="support-heading">Support</h1>

          <section className="support-row">
            <p className="support-lede">
              Need help with AskChef? We're here to help.
            </p>
            <p>
              For app support, privacy questions, account deletion requests,
              billing questions, or legal inquiries, contact us at{" "}
              <EmailLink className="support-email-inline" />.
            </p>
            <p className="support-response">
              We aim to respond as soon as reasonably possible.
            </p>
          </section>

          <section className="support-row">
            <h2>What we can help with</h2>
            <ul className="topic-list">
              {supportTopics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </section>

          <section className="support-row">
            <h2>Account deletion and privacy requests</h2>
            <p>
              To request account deletion or ask a privacy-related question,
              email <EmailLink className="support-email-inline" />.
            </p>
            <p>
              Please include the email address associated with your AskChef
              account so we can locate your account.
            </p>
          </section>

          <section className="support-row">
            <h2>Important safety note</h2>
            <p>
              AskChef is an AI cooking assistant and may make mistakes. Always
              verify allergens, doneness, appliance safety, temperatures, and
              food-safety decisions before relying on any recipe or answer.
            </p>
          </section>

          <section className="support-row">
            <h2>Terms of Use and Privacy Policy</h2>
            <p>
              You can review our Terms of Use and Privacy Policy here. For
              legal, Terms of Use, or privacy questions, contact us at{" "}
              <EmailLink className="support-email-inline" />.
            </p>

            <p className="legal-inline">
              {legalLinks.map((link) =>
                link.isLive ? (
                  <a href={link.href} key={link.label}>
                    {link.label}
                  </a>
                ) : (
                  <span
                    className="legal-placeholder"
                    data-href={link.href}
                    key={link.label}
                  >
                    {link.label} coming soon
                  </span>
                ),
              )}
            </p>
          </section>
        </article>
      </section>
    </SiteShell>
  );
}

function LegalDocumentPage({ documentKey }) {
  return (
    <SiteShell currentPage={documentKey}>
      <section className="page-layout" aria-labelledby={`${documentKey}-heading`}>
        <MarkdownDocument
          headingId={`${documentKey}-heading`}
          markdown={legalDocuments[documentKey].markdown}
        />
      </section>
    </SiteShell>
  );
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
        h3,
        .signup-prompt {
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
          grid-template-columns: repeat(2, minmax(0, 1fr));
          width: 100%;
          gap: 16px;
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

        .signup-form {
          margin-top: 0;
          padding-top: 17px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .input {
          height: 50px;
          padding: 0 16px;
          border-radius: 18px;
          border: 1px solid rgba(14, 59, 49, 0.12);
          background: rgba(255,255,255,0.68);
          color: #0e3b31;
          font-size: 14px;
          text-align: center;
          outline: none;
          box-shadow: 0 8px 20px rgba(14, 59, 49, 0.04);
        }

        .input::placeholder {
          color: rgba(14, 59, 49, 0.72);
        }

        .button {
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

        .fine-print {
          margin: 14px 4px 0;
          max-width: 520px;
          font-size: 12px;
          line-height: 1.5;
          color: rgba(14, 59, 49, 0.56);
        }

        .signup-prompt {
          margin: 0 0 12px;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.35;
          text-align: center;
          color: #003c32;
        }

        .submit-message {
          margin: 12px 4px 0;
          font-size: 13px;
          line-height: 1.5;
        }

        .submit-message.success {
          color: #0e3b31;
        }

        .submit-message.error {
          color: #8a2c2c;
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

          .signup-form {
            padding-top: 0;
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
