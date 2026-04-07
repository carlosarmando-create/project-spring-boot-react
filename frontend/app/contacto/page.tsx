"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      await apiFetch("/contacts", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessageType("success");
      setMessage("Se creó correctamente el mensaje de contacto.");
      form.reset();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se creó correctamente el mensaje de contacto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell py-12 md:py-16">
      <section className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-(--primary)">Contacto</p>
          <h1 className="mt-3 text-4xl font-semibold">Conversemos sobre tu próximo espacio verde</h1>
          <p className="mt-4 text-(--muted)">
            Cuentanos que ambiente quieres crear y te ayudaremos a elegir las
            plantas, macetas y combinaciones ideales para tu espacio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card grid gap-4 p-8">
          <input name="fullName" placeholder="Nombre completo" className="rounded-2xl border border-(--border) bg-white px-4 py-3 outline-none" required />
          <input name="email" type="email" placeholder="Correo electrónico" className="rounded-2xl border border-(--border) bg-white px-4 py-3 outline-none" required />
          <input name="phone" placeholder="Teléfono" className="rounded-2xl border border-(--border) bg-white px-4 py-3 outline-none" />
          <input name="subject" placeholder="Asunto" className="rounded-2xl border border-(--border) bg-white px-4 py-3 outline-none" required />
          <textarea name="message" placeholder="Escribe tu mensaje" className="min-h-40 rounded-2xl border border-(--border) bg-white px-4 py-3 outline-none" required />
          <button disabled={loading} className="rounded-full bg-(--primary) px-5 py-3 font-medium text-white disabled:opacity-70">
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>
          {message && (
            <p className={`text-sm ${messageType === "error" ? "text-red-700" : "text-emerald-700"}`}>
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
