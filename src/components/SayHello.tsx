"use client";

import { useState } from "react";

type Channel = "email" | "whatsapp" | "social";

const CONTACTS = {
  email: "ikkoastudio@gmail.com",
  whatsapp: "+573000000000",
  whatsappDisplay: "+57 300 000 0000",
  instagram: "ikkoastudio",
  instagramUrl: "https://instagram.com/ikkoastudio",
};

const options: { id: Channel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "social", label: "Social media" },
];

function replyFor(channel: Channel) {
  switch (channel) {
    case "email":
      return {
        message: "Perfect. Write whenever you like — I read every message with care.",
        actionLabel: "Open email",
        actionHref: `mailto:${CONTACTS.email}?subject=Hello%20IkKOA%20Studio`,
        detail: CONTACTS.email,
      };
    case "whatsapp":
      return {
        message:
          "Great. Let's talk on WhatsApp — reply whenever it works for you.",
        actionLabel: "Open WhatsApp",
        actionHref: `https://wa.me/${CONTACTS.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello IkKOA Studio, I'd like to get in touch.")}`,
        detail: CONTACTS.whatsappDisplay,
      };
    case "social":
      return {
        message:
          "Love that. Follow or message me on Instagram — that's where we share the process.",
        actionLabel: "Open Instagram",
        actionHref: CONTACTS.instagramUrl,
        detail: `@${CONTACTS.instagram}`,
      };
  }
}

export default function SayHello() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const reply = channel ? replyFor(channel) : null;
  const selectedLabel = options.find((o) => o.id === channel)?.label;

  return (
    <section id="say-hello" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            Say Hello
          </p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
            Let&apos;s talk
          </h2>
        </div>

        <div className="min-h-[28rem] border border-line bg-white p-5 sm:min-h-[32rem] sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 border-b border-line pb-5">
            <span className="flex h-9 w-9 items-center justify-center bg-ink font-[family-name:var(--font-nav)] text-[10px] uppercase tracking-wider text-white">
              IK
            </span>
            <div>
              <p className="font-[family-name:var(--font-nav)] text-sm uppercase tracking-wide text-ink">
                IkKOA Studio
              </p>
              <p className="text-[11px] text-muted">Online · replies directly</p>
            </div>
          </div>

          <div className="flex min-h-[20rem] flex-col gap-4 sm:min-h-[22rem]">
            <div className="max-w-[min(90%,36rem)] animate-fade-up self-start rounded-2xl rounded-tl-sm bg-background px-4 py-3 text-sm leading-relaxed text-ink sm:px-5 sm:py-4 sm:text-base">
              Hi. How would you like to get in touch?
            </div>

            {!channel && (
              <div className="animate-fade-up delay-1 flex flex-wrap justify-end gap-2 self-end">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setChannel(option.id)}
                    className="border border-ink bg-ink px-4 py-2.5 font-[family-name:var(--font-nav)] text-xs uppercase tracking-wide text-white transition-opacity hover:opacity-80 sm:text-sm"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {channel && reply && (
              <>
                <div className="animate-fade-up max-w-[min(85%,28rem)] self-end rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-sm text-white sm:px-5 sm:py-4 sm:text-base">
                  {selectedLabel}
                </div>

                <div className="animate-fade-up delay-1 max-w-[min(92%,40rem)] space-y-3 self-start rounded-2xl rounded-tl-sm bg-background px-4 py-4 sm:px-5 sm:py-5">
                  <p className="text-sm leading-relaxed text-ink sm:text-base">
                    {reply.message}
                  </p>
                  <p className="font-[family-name:var(--font-nav)] text-sm tracking-wide text-ink">
                    {reply.detail}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={reply.actionHref}
                      target={channel === "email" ? undefined : "_blank"}
                      rel={
                        channel === "email" ? undefined : "noopener noreferrer"
                      }
                      className="inline-flex h-11 items-center bg-ink px-5 font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-80"
                    >
                      {reply.actionLabel}
                    </a>
                    <button
                      type="button"
                      onClick={() => setChannel(null)}
                      className="font-[family-name:var(--font-nav)] text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
                    >
                      Choose another option
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
