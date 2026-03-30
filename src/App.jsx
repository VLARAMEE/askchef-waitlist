import { useState } from "react";
import { supabase } from "./supabase.Client";

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
          margin-top: 36px;
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

        .phone-notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 108px;
          height: 28px;
          border-radius: 18px;
          background: #111111;
          z-index: 2;
        }

        .screen {
          position: relative;
          height: 100%;
          padding: 64px 18px 18px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.16)),
            #f7efe4;
        }

        .screen-placeholder {
          height: 100%;
          border-radius: 28px;
          border: 1.5px dashed rgba(14, 59, 49, 0.28);
          background:
            linear-gradient(180deg, rgba(14, 59, 49, 0.03), rgba(14, 59, 49, 0.09)),
            repeating-linear-gradient(
              -45deg,
              rgba(14, 59, 49, 0.03),
              rgba(14, 59, 49, 0.03) 14px,
              rgba(255, 255, 255, 0.28) 14px,
              rgba(255, 255, 255, 0.28) 28px
            );
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px 22px;
        }

        .placeholder-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(14, 59, 49, 0.10);
          color: #003c32;
          font-size: 24px;
          font-weight: 700;
        }

        .placeholder-title {
          margin: 18px 0 8px;
          font-size: 22px;
          font-weight: 700;
          color: #003c32;
        }

        .placeholder-copy {
          margin: 0;
          max-width: 220px;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(14, 59, 49, 0.72);
        }

        .placeholder-chip {
          margin-top: 18px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(14, 59, 49, 0.12);
          font-size: 12px;
          font-weight: 600;
          color: rgba(14, 59, 49, 0.72);
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 44px;
          }

          .highlights {
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

          .subtext {
            font-size: 16px;
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

          <main className="hero">
            <section className="hero-copy">
              <h1>
                Ask Chef is your voice-first cooking companion
              </h1>

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
                    Designed for messy hands, split attention, and those moments
                    when you just need the next step fast.
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
                  <button className="button" type="submit" disabled={isSubmitting}>
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
                    <div className="phone-notch"></div>

                    <div className="screen">
                      <div className="screen-placeholder">
                        <div className="placeholder-badge">A</div>
                        <div className="placeholder-title">App screenshot</div>
                        <p className="placeholder-copy">
                          This iPhone-sized frame is ready for the real AskChef
                          screen capture once we have it.
                        </p>
                        <div className="placeholder-chip">
                          Drop in the production screenshot here
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
