import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useId, useRef, useState } from "react";
import { FORMSPREE_FORM_ID } from "./formspree.js";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const START_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, index) => String(START_YEAR + index));

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function weddingTiming({ month, year, undecided }) {
  if (undecided) return "Undecided";
  if (month && year) return `${month} ${year}`;
  return "Not provided";
}

function validate({ audience, firstName, email, month, year, undecided }) {
  const errors = {};

  if (!firstName.trim()) {
    errors.firstName = "Enter your first name.";
  } else if (firstName.trim().length > 80) {
    errors.firstName = "Use 80 characters or fewer.";
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = "Enter your email address.";
  } else if (trimmedEmail.length > 254 || !EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter an email address like name@example.com.";
  }

  if (
    audience === "couple" &&
    !undecided &&
    ((month && !year) || (!month && year))
  ) {
    errors.date = "Choose both a month and a year, or mark the date as undecided.";
  }

  return errors;
}

function clearError(setErrors, key) {
  setErrors((current) => {
    if (!current[key]) return current;
    const next = { ...current };
    delete next[key];
    return next;
  });
}

function serverFieldMessage(errors, field) {
  if (!errors) return "";
  return errors
    .getFieldErrors(field)
    .map((error) => error.message)
    .filter(Boolean)
    .join(" ");
}

function serverFormMessage(errors) {
  if (!errors) return "";
  const message = errors
    .getFormErrors()
    .map((error) => error.message)
    .filter(Boolean)
    .join(" ");

  if (!message) return "";
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return "We couldn’t reach the waitlist. Check your connection and try again.";
  }
  return message;
}

export default function WaitlistForm({ labelledBy }) {
  const baseId = useId();
  const titleId = useId();
  const firstNameRef = useRef(null);
  const emailRef = useRef(null);
  const monthRef = useRef(null);
  const successRef = useRef(null);

  const [audience, setAudience] = useState("couple");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [undecided, setUndecided] = useState(false);
  const [gotcha, setGotcha] = useState("");
  const [errors, setErrors] = useState({});
  const [state, submit, reset] = useForm(FORMSPREE_FORM_ID);

  const submitting = state.submitting;
  const isCouple = audience === "couple";
  const formMessage = serverFormMessage(state.errors);
  const emailServerMessage = errors.email ? "" : serverFieldMessage(state.errors, "email");
  const nameServerMessage = errors.firstName
    ? ""
    : serverFieldMessage(state.errors, "first_name");
  const audienceLabel = isCouple ? "Planning a wedding" : "Wedding vendor";
  const firstNameId = `${baseId}-first-name`;
  const emailId = `${baseId}-email`;
  const locationId = `${baseId}-location`;
  const businessId = `${baseId}-business`;
  const serviceId = `${baseId}-service`;
  const monthId = `${baseId}-month`;
  const yearId = `${baseId}-year`;

  useEffect(() => {
    if (!state.succeeded) return;
    successRef.current?.focus();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    successRef.current?.scrollIntoView({
      block: "center",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [state.succeeded]);

  function focusFirstError(nextErrors) {
    if (nextErrors.firstName) firstNameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.date) monthRef.current?.focus();
  }

  function clearField(key) {
    clearError(setErrors, key);
    if (state.errors) reset();
  }

  async function handleSubmit(event) {
    if (submitting) {
      event.preventDefault();
      return;
    }

    const nextErrors = validate({ audience, firstName, email, month, year, undecided });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      focusFirstError(nextErrors);
      return;
    }

    await submit(event);
  }

  if (state.succeeded) {
    return (
      <div className="confirmation" role="status">
        <h3 ref={successRef} tabIndex={-1}>
          You’re on the list.
        </h3>
        <p>
          Thank you, {firstName.trim()}. We’ll email {email.trim()} when early access
          opens.
        </p>
      </div>
    );
  }

  return (
    <form
      className="signup"
      aria-labelledby={labelledBy || titleId}
      noValidate
      onSubmit={handleSubmit}
    >
      {labelledBy ? null : (
        <h2 id={titleId} className="visually-hidden">
          Join the waitlist
        </h2>
      )}

      <div className="audience" role="radiogroup" aria-label="I am joining as">
        <label className="choice">
          <input
            type="radio"
            name="audience"
            value="Planning a wedding"
            checked={isCouple}
            onChange={() => setAudience("couple")}
          />
          Planning a wedding
        </label>
        <label className="choice">
          <input
            type="radio"
            name="audience"
            value="Wedding vendor"
            checked={!isCouple}
            onChange={() => setAudience("vendor")}
          />
          Wedding vendor
        </label>
      </div>

      <input type="hidden" name="_subject" value={`New Everly waitlist signup — ${audienceLabel}`} />
      <input type="hidden" name="_replyto" value={email.trim()} />
      <input
        type="hidden"
        name="wedding_timing"
        value={isCouple ? weddingTiming({ month, year, undecided }) : "Not provided"}
      />
      {isCouple ? (
        <input
          type="hidden"
          name="wedding_location"
          value={location.trim() || "Not provided"}
        />
      ) : (
        <>
          <input
            type="hidden"
            name="business_name"
            value={businessName.trim() || "Not provided"}
          />
          <input
            type="hidden"
            name="service_area"
            value={serviceArea.trim() || "Not provided"}
          />
        </>
      )}

      <div className="fields">
        <div className="field">
          <label htmlFor={firstNameId}>
            First name <span className="required">Required</span>
          </label>
          <input
            ref={firstNameRef}
            id={firstNameId}
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            value={firstName}
            disabled={submitting}
            aria-invalid={errors.firstName || nameServerMessage ? "true" : undefined}
            aria-describedby={
              errors.firstName
                ? `${baseId}-first-name-error`
                : nameServerMessage
                  ? `${baseId}-first-name-server-error`
                  : undefined
            }
            onChange={(event) => {
              setFirstName(event.target.value);
              clearField("firstName");
            }}
          />
          {errors.firstName && (
            <p id={`${baseId}-first-name-error`} className="field-error" role="alert">
              {errors.firstName}
            </p>
          )}
          <ValidationError
            id={`${baseId}-first-name-server-error`}
            field="first_name"
            errors={errors.firstName ? null : state.errors}
            className="field-error"
            role="alert"
          />
        </div>

        <div className="field">
          <label htmlFor={emailId}>
            Email <span className="required">Required</span>
          </label>
          <input
            ref={emailRef}
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            disabled={submitting}
            aria-invalid={errors.email || emailServerMessage ? "true" : undefined}
            aria-describedby={
              errors.email
                ? `${baseId}-email-error`
                : emailServerMessage
                  ? `${baseId}-email-server-error`
                  : undefined
            }
            onChange={(event) => {
              setEmail(event.target.value);
              clearField("email");
            }}
          />
          {errors.email && (
            <p id={`${baseId}-email-error`} className="field-error" role="alert">
              {errors.email}
            </p>
          )}
          <ValidationError
            id={`${baseId}-email-server-error`}
            field="email"
            errors={errors.email ? null : state.errors}
            className="field-error"
            role="alert"
          />
        </div>

        {isCouple ? (
          <>
            <div className="field field-optional">
              <label htmlFor={locationId}>
                Wedding location <span className="optional">Optional</span>
              </label>
              <input
                id={locationId}
                type="text"
                autoComplete="off"
                maxLength={120}
                placeholder="City or venue"
                value={location}
                disabled={submitting}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>

            <fieldset className="field field-optional" disabled={submitting}>
              <legend>
                Wedding date <span className="optional">Optional</span>
              </legend>
              <div className="date-row">
                <select
                  ref={monthRef}
                  id={monthId}
                  name="wedding_month"
                  value={month}
                  disabled={undecided}
                  className={month ? undefined : "is-placeholder"}
                  aria-label="Wedding month"
                  aria-invalid={errors.date ? "true" : undefined}
                  aria-describedby={errors.date ? `${baseId}-date-error` : undefined}
                  onChange={(event) => {
                    setMonth(event.target.value);
                    clearField("date");
                  }}
                >
                  <option value="">Month</option>
                  {MONTHS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  id={yearId}
                  name="wedding_year"
                  value={year}
                  disabled={undecided}
                  className={year ? undefined : "is-placeholder"}
                  aria-label="Wedding year"
                  aria-invalid={errors.date ? "true" : undefined}
                  aria-describedby={errors.date ? `${baseId}-date-error` : undefined}
                  onChange={(event) => {
                    setYear(event.target.value);
                    clearField("date");
                  }}
                >
                  <option value="">Year</option>
                  {YEARS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <label className="check">
                <input
                  type="checkbox"
                  name="wedding_date_undecided"
                  value="Yes"
                  checked={undecided}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setUndecided(checked);
                    if (checked) {
                      setMonth("");
                      setYear("");
                    }
                    clearField("date");
                  }}
                />
                <span>We haven’t decided yet</span>
              </label>
              {errors.date && (
                <p id={`${baseId}-date-error`} className="field-error" role="alert">
                  {errors.date}
                </p>
              )}
            </fieldset>
          </>
        ) : (
          <>
            <div className="field field-optional">
              <label htmlFor={businessId}>
                Business name <span className="optional">Optional</span>
              </label>
              <input
                id={businessId}
                type="text"
                autoComplete="organization"
                maxLength={80}
                placeholder="Studio or company"
                value={businessName}
                disabled={submitting}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
            <div className="field field-optional">
              <label htmlFor={serviceId}>
                Service area <span className="optional">Optional</span>
              </label>
              <input
                id={serviceId}
                type="text"
                autoComplete="off"
                maxLength={120}
                placeholder="City or region"
                value={serviceArea}
                disabled={submitting}
                onChange={(event) => setServiceArea(event.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="gotcha" aria-hidden="true">
        <label>
          Leave this field empty
          <input
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            value={gotcha}
            onChange={(event) => setGotcha(event.target.value)}
          />
        </label>
      </div>

      {formMessage && (
        <p className="form-error" role="alert">
          {formMessage}
        </p>
      )}

      <button className="button" type="submit" disabled={submitting}>
        {submitting && <span className="spinner" aria-hidden="true" />}
        {submitting ? "Joining…" : "Join the waitlist"}
      </button>

      <p className="fine-print">
        Subscribers receive Everly launch and early access updates.
      </p>
    </form>
  );
}
