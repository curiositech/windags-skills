type SwissHeroProps = {
  eyebrow?: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
  proof?: string[];
};

export function SwissModernHero(props: SwissHeroProps) {
  return (
    <section className="swiss-shell py-16 md:py-24">
      <div className="swiss-grid items-start">
        <div className="col-span-12 md:col-span-7">
          {props.eyebrow ? (
            <p className="mb-4 text-xs uppercase tracking-[0.18em] text-neutral-600">
              {props.eyebrow}
            </p>
          ) : null}

          <h1 className="max-w-[11ch] text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.98] tracking-[-0.045em]">
            {props.title}
          </h1>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <p className="max-w-[34ch] text-base leading-7 text-neutral-800">
            {props.body}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="border border-black bg-black px-4 py-2 text-sm text-white" href="#">
              {props.primaryCta}
            </a>
            {props.secondaryCta ? (
              <a className="border border-black px-4 py-2 text-sm text-black" href="#">
                {props.secondaryCta}
              </a>
            ) : null}
          </div>

          {props.proof?.length ? (
            <ul className="mt-8 space-y-2 border-t border-neutral-300 pt-4 text-sm text-neutral-700">
              {props.proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
