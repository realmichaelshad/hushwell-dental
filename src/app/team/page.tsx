import type { Metadata } from "next";
import { FinalCta } from "@/components/home/Sections";
import { PageIntro } from "@/components/layout/PageIntro";
import { Photo } from "@/components/photo/Photo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TEAM } from "@/content/people";
import { rv } from "@/components/motion/Words";
import { RevealHeading } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Our team",
  description: "Meet the dentists, hygienist and coordinator at Hushwell Dental: a small team, so you see the same faces every visit.",
  alternates: { canonical: "/team" },
};

const PROMISES: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: "chat",
    title: "Nothing without asking",
    body: "We explain each step before we do it, and we stop the moment you raise your hand.",
  },
  {
    icon: "tag",
    title: "Prices before treatment",
    body: "You get a written estimate, with your insurance worked out, before anything is booked.",
  },
  {
    icon: "users",
    title: "The same faces every time",
    body: "A small team, so the people who know your history are the ones who see you.",
  },
];

export default function TeamPage() {
  return (
    <>
      <PageIntro
        current="Our team"
        title="The people you'll meet"
        lead="Four of us, one calm practice. We'd rather take a few extra minutes to explain than have you leave unsure."
      />

      <section aria-label="Team members" className="container-page">
        <ul className="grid gap-6 lg:grid-cols-2">
          {TEAM.map((person, i) => (
            <li
              key={person.name}
              className="zoom lift grid overflow-hidden rounded-pebble bg-white shadow-soft sm:grid-cols-[minmax(0,15rem)_1fr]"
              {...rv("up", i % 2)}
            >
              <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[19rem]">
                <Photo slot={person.photo} fill sizes="(min-width: 40rem) 15rem, 100vw" alt="" />
              </div>
              <div className="flex flex-col p-7 sm:p-8">
                <h2 className="text-h3">
                  {person.name}
                  {person.credentials && <span className="font-normal text-ink-soft">, {person.credentials}</span>}
                </h2>
                <p className="mt-1 font-bold text-tide">{person.role}</p>
                <p className="mt-4 text-ink-soft">{person.bio}</p>
                <p className="mt-auto pt-6 text-small">
                  <span className="font-bold">Outside the office: </span>
                  <span className="text-ink-soft">{person.outside}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="promises-title" className="container-page py-20 lg:py-28">
        <RevealHeading id="promises-title" text="Three things we promise" />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {PROMISES.map((p, i) => (
            <li key={p.title} className="lift rounded-panel border border-line bg-white p-8" {...rv("up", i + 1)}>
              <span className="grid size-12 place-items-center rounded-full bg-seaglass text-tide">
                <Icon name={p.icon} size={24} />
              </span>
              <h3 className="mt-5 text-[1.3rem]">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta />
    </>
  );
}
