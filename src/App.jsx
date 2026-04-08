import { useState } from "react";
import { trackEvent } from "./analytics";
import { supabase } from "./supabase.Client";
import askChefPhoneScreen from "./assets/askchef-phone-screen.png";

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

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

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
          letter-spacing: -0.04em;
          color: #003c32;
        }

        .subtext {
          margin: 0;
          max-width: 700px;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(14, 59, 49, 0.78);
        }

        .accent {
          display: block;
          color: #0e3b31;
        }

        .form-card {
          margin-top: 8px;
          padding: 16px;
          border-radius: 28px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(14, 59, 49, 0.10);
          box-shadow: 0 18px 40px rgba(14, 59, 49, 0.08);
          backdrop-filter: blur(10px);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 12px;
        }

        .input {
          height: 50px;
          padding: 0 16px;
          border-radius: 18px;
          border: 0;
          background: #fbf3e9;
          color: #0e3b31;
          font-size: 14px;
          outline: none;
          box-shadow: inset 0 0 0 1px rgba(14, 59, 49, 0.02);
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

        .highlights {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .highlight {
          padding: 16px;
          border-radius: 24px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(14, 59, 49, 0.10);
          box-shadow: 0 12px 28px rgba(14, 59, 49, 0.06);
        }

        .highlight h3 {
          margin: 0 0 8px;
          font-size: 15px;
          color: #003c32;
        }

        .highlight p {
          margin: 0;
          font-size: 14px;
          line-height: 1.65;
          color: rgba(14, 59, 49, 0.70);
        }

        .content-sections {
          display: grid;
          gap: 18px;
          margin-top: 12px;
        }

        .section-card,
        .faq-section,
        .faq-item {
          border-radius: 28px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(14, 59, 49, 0.10);
          box-shadow: 0 12px 28px rgba(14, 59, 49, 0.06);
        }

        .section-card,
        .faq-section {
          padding: 24px;
        }

        .section-card h2,
        .faq-section h2 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #003c32;
        }

        .section-card p,
        .faq-item p {
          margin: 0;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(14, 59, 49, 0.74);
        }

        .section-card p + p {
          margin-top: 14px;
        }

        .faq-section {
          margin-top: 18px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .faq-item {
          padding: 18px;
        }

        .faq-item h3 {
          margin: 0 0 8px;
          font-size: 18px;
          line-height: 1.35;
          color: #003c32;
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

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 44px;
          }

          .highlights,
          .faq-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .container {
            padding: 18px;
          }

          h1 {
            font-size: 36px;
          }

          .subtext,
          .section-card p,
          .faq-item p {
            font-size: 16px;
          }

          .section-card,
          .faq-section,
          .faq-item {
            padding: 18px;
          }

          .section-card h2,
          .faq-section h2 {
            font-size: 24px;
          }

          .phone-wrap,
          .phone-shell {
            width: 290px;
          }

          .phone-shell {
            height: 590px;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <main>
            <section className="hero">
              <section className="hero-copy">
                <h1>
                  AskChef is your AI cooking assistant for hands-free, voice-first
                  support
                </h1>

                <p className="subtext">
                  Ask your questions while you work. AskChef will help you move
                  through ingredients, steps, and timing without constantly
                  touching your phone.
                </p>

                <div className="highlights">
                  <div className="highlight">
                    <h3>
                      Cook
                      <br />
                      hands-free
                    </h3>
                    <p>
                      Ask questions while cooking and get quick answers without
                      touching your phone every minute.
                    </p>
                  </div>

                  <div className="highlight">
                    <h3>Turn any recipe into a guided session</h3>
                    <p>
                      AskChef helps you move through ingredients, steps, and
                      timing more naturally.
                    </p>
                  </div>

                  <div className="highlight">
                    <h3>Built for real kitchens</h3>
                    <p>
                      Designed for messy hands, split attention, and those
                      moments when you just need the next step fast.
                    </p>
                  </div>
                </div>

                <form className="form-card" onSubmit={handleSubmit}>
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
                    <button
                      className="button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Joining..." : "Notify me"}
                    </button>
                  </div>

                  <div className="fine-print">
                    Be the first to know when AskChef launches.
                    <br />
                    No spam, just launch updates and early access news.
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

            <section className="content-sections">
              {contentSections.map((section, index) => (
                <article className="section-card" key={section.title}>
                  <h2 id={index === 0 ? "askchef-overview-heading" : undefined}>
                    {section.title}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </article>
              ))}
            </section>

            <section className="faq-section" aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently asked questions</h2>

              <div className="faq-grid">
                {faqItems.map((item) => (
                  <article className="faq-item" key={item.question}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
