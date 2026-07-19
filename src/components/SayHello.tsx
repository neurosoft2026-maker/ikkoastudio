"use client";

import Image from "next/image";
import { useState } from "react";
import { STUDIO_CONTACTS, whatsappUrl } from "@/lib/contacts";
import { publicText, type Locale } from "@/lib/locale";

type Channel = "email" | "whatsapp" | "social";

function replyFor(channel: Channel, locale: Locale) {
  const copy = publicText[locale].contact;
  switch (channel) {
    case "email":
      return {
        message: copy.emailMessage,
        actionLabel: copy.emailAction,
        actionHref: `mailto:${STUDIO_CONTACTS.email}?subject=Hello%20IkKOA%20Studio`,
        detail: STUDIO_CONTACTS.email,
      };
    case "whatsapp":
      return {
        message: copy.whatsappMessage,
        actionLabel: copy.whatsappAction,
        actionHref: whatsappUrl(
          locale === "es"
            ? "Hola IkKOA Studio, me gustaría comunicarme contigo."
            : "Hello IkKOA Studio, I'd like to get in touch.",
        ),
        detail: STUDIO_CONTACTS.whatsappDisplay,
      };
    case "social":
      return {
        message: copy.socialMessage,
        actionLabel: copy.socialAction,
        actionHref: STUDIO_CONTACTS.instagramUrl,
        detail: `@${STUDIO_CONTACTS.instagram}`,
      };
  }
}

export default function SayHello({ locale = "en" }: { locale?: Locale }) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const copy = publicText[locale].contact;
  const options: { id: Channel; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "social", label: copy.social },
  ];
  const reply = channel ? replyFor(channel, locale) : null;
  const selectedLabel = options.find((o) => o.id === channel)?.label;

  return (
    <section id="say-hello" className="border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
            {copy.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-title)] text-4xl font-semibold leading-none tracking-tight text-ink sm:text-6xl">
            {copy.title}
          </h2>
        </div>

        <div className="min-h-[28rem] border border-line bg-white p-5 sm:min-h-[32rem] sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center gap-3 border-b border-line pb-5">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden bg-ink/5">
              <Image
                src="/img/avatar.PNG"
                alt="Gustavo Moreno"
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            </span>
            <div>
              <p className="font-[family-name:var(--font-nav)] text-sm uppercase tracking-wide text-ink">
                Gustavo Moreno
              </p>
              <p className="text-[11px] text-muted">{copy.online}</p>
            </div>
          </div>

          <div className="flex min-h-[20rem] flex-col gap-4 sm:min-h-[22rem]">
            <div className="max-w-[min(90%,36rem)] animate-fade-up self-start rounded-2xl rounded-tl-sm bg-background px-4 py-3 text-sm leading-relaxed text-ink sm:px-5 sm:py-4 sm:text-base">
              {copy.question}
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
                      {copy.chooseAnother}
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
