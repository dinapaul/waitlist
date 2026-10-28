import "./App.css";
import WaitlistForm from "./WaitlistForm.jsx";

const TEAM = [
  {
    name: "The Glasshouse",
    detail: "Venue · Ceremony and reception",
    price: "$9,500",
    image: "/images/venue.jpg",
    position: "center 45%",
    alt: "A ceremony aisle lined with peach and white flowers",
  },
  {
    name: "Laurel & Rye",
    detail: "Florist · Bouquet and centerpieces",
    price: "$2,400",
    image: "/images/flowers.jpg",
    position: "center 60%",
    alt: "A peach rose bouquet with baby's breath",
  },
  {
    name: "June Studio",
    detail: "Photography · 8 hours",
    price: "$3,400",
    image: "/images/photo.jpg",
    position: "center 22%",
    alt: "A couple walking together after the ceremony",
  },
];

const PLAN_ROWS = [
  { label: "Budget", value: "Floral quote · $2,400" },
  { label: "Payment", value: "$600 due June 1", emphasis: true },
  { label: "Next", value: "Confirm the design by May 20", emphasis: true },
];

const VENDOR_POINTS = [
  [
    "Relevant inquiries",
    "Date, budget, location, guest count, and service needs arrive with the first message.",
  ],
  [
    "Conversion insights",
    "Follow the path from profile views and saves to inquiries and bookings.",
  ],
  [
    "Local demand",
    "See the services, styles, budgets, and dates couples are searching for.",
  ],
];

const FLOW = [
  { label: "Views", value: "240", width: "100%" },
  { label: "Saves", value: "86", width: "36%" },
  { label: "Inquiries", value: "31", width: "13%" },
  { label: "Bookings", value: "9", width: "4%" },
];

export default function App() {
  return (
    <>
      <header className="hero">
        <div className="hero-inner">
          <p className="wordmark">Everly</p>
          <p className="eyebrow">Early access</p>
          <h1>
            <span className="line">The right vendors.</span>
            <span className="line line-italic">Every detail connected.</span>
          </h1>
          <p className="lede">
            Find a vendor team that fits your vision and budget, then keep
            every conversation, payment, and deadline connected as your wedding
            takes shape.
          </p>
          <p className="vendor-intro">
            <span>For wedding vendors:</span> relevant inquiries and insights
            into what drives bookings.
          </p>
          <WaitlistForm />
        </div>
      </header>

      <section className="band band-white" aria-labelledby="team-title">
        <div className="split">
          <div className="split-copy">
            <p className="eyebrow eyebrow-ink">For couples</p>
            <h2 id="team-title">Build a vendor team around your wedding.</h2>
            <p>
              Everly considers your budget, style, guest count, location, and
              existing bookings to recommend vendors that work together.
              Compare total costs, package inclusions, and tradeoffs before you
              decide.
            </p>
          </div>
          <article className="panel" aria-label="Example vendor team">
            <img
              className="panel-photo"
              src="/images/wedding.jpg"
              alt="A couple photographed in warm evening light, the bride holding a bouquet"
            />
            <div className="panel-body">
              <p className="panel-kicker">Your vendor team</p>
              <p className="panel-meta">June 2027 · Philadelphia · 120 guests</p>
              <ul className="team">
                {TEAM.map((vendor) => (
                  <li key={vendor.name}>
                    <img src={vendor.image} alt={vendor.alt} style={{ objectPosition: vendor.position }} />
                    <div>
                      <strong>{vendor.name}</strong>
                      <span>{vendor.detail}</span>
                    </div>
                    <b>{vendor.price}</b>
                  </li>
                ))}
              </ul>
              <dl className="budget">
                <div>
                  <dt>Selected</dt>
                  <dd>$15,300</dd>
                </div>
                <div>
                  <dt>Budget</dt>
                  <dd>$20,000</dd>
                </div>
                <div className="budget-remain">
                  <dt>Remaining</dt>
                  <dd>$4,700</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </section>

      <section className="band" aria-labelledby="sync-title">
        <div className="split split-reverse">
          <div className="split-copy">
            <h2 id="sync-title">Keep the details in sync.</h2>
            <p>
              With your inbox connected, Everly helps track important replies
              and upcoming payments. Quotes, tasks, and timelines stay linked,
              with suggested updates for you to review.
            </p>
            <p className="trust">
              You approve outgoing messages and changes to your plan.
            </p>
          </div>
          <article className="panel" aria-label="Example of a reply becoming plan updates">
            <div className="panel-body">
              <p className="panel-kicker">Florist</p>
              <p className="mail">
                The floral package is $2,400. A $600 deposit is due June 1.
                Please confirm the final design by May 20.
              </p>
              <ul className="plan-rows">
                {PLAN_ROWS.map((row) => (
                  <li key={row.label} className={row.emphasis ? "is-emphasis" : undefined}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="band band-blush" aria-labelledby="vendors-title">
        <div className="split">
          <div className="split-copy">
            <p className="eyebrow eyebrow-ink">For vendors</p>
            <h2 id="vendors-title">
              Better inquiries. A clearer view of your business.
            </h2>
            <p>
              Connect with couples whose plans fit your services. Understand
              what they’re looking for, which inquiries become bookings, and
              where opportunities are being lost.
            </p>
            <ul className="points">
              {VENDOR_POINTS.map(([title, detail]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <article className="panel" aria-label="Sample vendor dashboard">
            <div className="panel-body">
              <p className="panel-kicker">Sample data</p>
              <div className="inquiry">
                <strong>New inquiry</strong>
                <p>Garden ceremony · 120 guests</p>
                <p>June 2027 · Philadelphia · $18,000–$24,000</p>
              </div>
              <ol className="flow">
                {FLOW.map((step) => (
                  <li key={step.label}>
                    <span>{step.label}</span>
                    <span className="bar" style={{ "--w": step.width }} />
                    <strong>{step.value}</strong>
                  </li>
                ))}
              </ol>
              <p className="demand">
                <strong>Local demand.</strong> Garden ceremonies in June are the
                dates couples save most.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="closing" aria-labelledby="closing-title">
        <div className="hero-inner">
          <p className="eyebrow">Early access</p>
          <h2 id="closing-title">Be part of Everly from the beginning.</h2>
          <p className="lede">Opening first in Philadelphia.</p>
          <WaitlistForm labelledBy="closing-title" />
        </div>
      </section>

      <footer className="footer">
        <p className="footer-mark">Everly</p>
        <p>Early access · Philadelphia</p>
      </footer>
    </>
  );
}
