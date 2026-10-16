"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy, LoaderCircle, Mail } from "lucide-react";
import { contact, contactLimits, validateContact, type ContactField } from "@/data/site";
import { DURATION, EASING, fadeUp } from "@/lib/motion";

const COPY_RESET_MS = 2500;
const UNDERLINE_LENGTH = 1;
const fieldClass = "mt-2 w-full rounded-md border border-hairline bg-bg/40 px-4 py-4 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
export default function Contact() {
  const reduced = useReducedMotion();
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  async function copyEmail() {
    try { await navigator.clipboard.writeText(contact.email); setCopyStatus(contact.copied); }
    catch { setCopyStatus(contact.copyFailure); }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(""), COPY_RESET_MS);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const validation = validateContact(payload);
    setErrors(validation);
    setFeedback("");
    if (Object.keys(validation).length) {
      setStatus("idle");
      form.querySelector<HTMLElement>(`[name="${Object.keys(validation)[0]}"]`)?.focus();
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setErrors(result.errors ?? {});
        throw new Error(result.error || contact.failure);
      }
      setStatus("success"); setFeedback(contact.success); form.reset();
    } catch (error) { setStatus("error"); setFeedback(error instanceof Error && !(error instanceof TypeError) ? error.message : contact.failure); }
  }
  return <section id="contact" aria-labelledby="contact-heading" className="relative scroll-mt-24 overflow-hidden py-24">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(99,102,241,0.06),transparent_60%)]" />
    <motion.div className="content-shell relative" variants={fadeUp} initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
      <div className="mb-10 flex items-center justify-between gap-6 font-mono text-xs uppercase tracking-widest text-muted"><p>{contact.label}</p><p className="hidden sm:block">{contact.eyebrow}</p></div>
      <div className="grid items-start gap-12 min-[900px]:grid-cols-[1.2fr_1fr]">
        <div className="py-4">
          <h2 id="contact-heading" className="text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-heading">
            {contact.headline[0]}<br />{contact.headline[1]}{" "}<span className="relative inline-block font-handwriting text-[1.2em] font-normal text-accent">{contact.headline[2]}<svg aria-hidden="true" viewBox="0 0 180 20" className="absolute -bottom-2 left-0 w-full overflow-visible fill-none stroke-current"><motion.path d="M3 16 Q78 1 177 5" pathLength={UNDERLINE_LENGTH} strokeWidth="3" strokeLinecap="round" strokeDasharray={UNDERLINE_LENGTH} initial={reduced ? false : { strokeDashoffset: UNDERLINE_LENGTH }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true }} transition={{ duration: reduced ? 0 : DURATION.reveal, ease: EASING }} /></svg></span><br />{contact.headline[3]}
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{contact.description}</p>
          <div className="mt-8 flex items-center gap-4 rounded-md border border-hairline bg-surface-1/40 px-4 py-4 sm:px-6">
            <Mail aria-hidden="true" className="hidden shrink-0 sm:block" size={24} />
            <a href={`mailto:${contact.email}`} className="min-w-0 flex-1 break-all text-lg font-semibold tracking-heading sm:text-2xl">{contact.email}</a>
            <button type="button" onClick={copyEmail} aria-label={contact.copy} className="shrink-0 rounded-md p-2 text-muted transition-colors hover:text-text">{copyStatus === contact.copied ? <Check size={20} /> : <Copy size={20} />}</button>
          </div>
          <p role="status" className="mt-2 min-h-6 text-xs text-muted">{copyStatus}</p>
          <a href={contact.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 rounded-md border border-hairline px-6 py-4 text-sm transition-colors hover:border-accent hover:text-accent">{contact.callLabel}<ArrowUpRight size={18} aria-hidden="true" /></a>
          <p className="mt-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#00dd88] motion-safe:animate-pulse" />{contact.availability}<span className="text-muted">· {contact.availabilityDate}</span></p>
        </div>
        <form onSubmit={submit} noValidate className="rounded-lg border border-hairline bg-surface-1/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8" aria-label={contact.formTitle} aria-busy={status === "loading"}>
          <div className="mb-6 flex justify-between font-mono text-xs uppercase"><h3>{contact.formTitle}</h3><span aria-hidden="true" className="text-muted">{"// 01"}</span></div>
          <div className="space-y-4">
            {(["name", "email", "projectType", "message"] as const).map(field => <div key={field}>
              <label htmlFor={`contact-${field}`} className="text-xs text-muted">{contact.fields[field]}</label>
              {field === "projectType" ? <select id={`contact-${field}`} name={field} required defaultValue="" aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} className={fieldClass}><option value="" disabled>{contact.placeholders[field]}</option>{contact.projectTypes.map(type => <option key={type} value={type} className="bg-surface-1">{type}</option>)}</select>
                : field === "message" ? <textarea id={`contact-${field}`} name={field} required rows={4} minLength={contactLimits.minMessage} maxLength={contactLimits.message} placeholder={contact.placeholders[field]} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} className={`${fieldClass} resize-y`} />
                : <input id={`contact-${field}`} name={field} type={field === "email" ? "email" : "text"} autoComplete={field} required maxLength={contactLimits[field]} placeholder={contact.placeholders[field]} aria-invalid={!!errors[field]} aria-describedby={errors[field] ? `${field}-error` : undefined} className={fieldClass} />}
              {errors[field] && <p id={`${field}-error`} className="mt-2 text-xs text-[#fca5a5]">{errors[field]}</p>}
            </div>)}
          </div>
          <div aria-hidden="true" className="hidden"><label htmlFor="contact-website">{contact.fields.website}</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
          <button type="submit" disabled={status === "loading"} className="mt-4 flex w-full items-center justify-center gap-4 rounded-md bg-text px-6 py-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60">{status === "loading" ? contact.sending : contact.submit}{status === "loading" ? <LoaderCircle aria-hidden="true" size={18} className="motion-safe:animate-spin" /> : <ArrowRight aria-hidden="true" size={18} />}</button>
          <p className="mt-4 text-center text-xs text-muted">{contact.response}</p>
          <div aria-live="polite" aria-atomic="true">{feedback && <p role={status === "error" ? "alert" : "status"} className={`mt-4 text-sm ${status === "error" ? "text-[#fca5a5]" : "text-text"}`}>{feedback}</p>}</div>
        </form>
      </div>
    </motion.div>
  </section>;
}
