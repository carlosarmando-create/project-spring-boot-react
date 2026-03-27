"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { AuthSession, Order, UserSummary } from "@/lib/types";

type Props = {
  session: AuthSession;
};

export function CustomerDashboard({ session }: Props) {
  const [profile, setProfile] = useState<UserSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<UserSummary>("/users/me", { token: session.token }),
      apiFetch<Order[]>("/orders/me", { token: session.token }),
    ])
      .then(([profileData, ordersData]) => {
        setProfile(profileData);
        setOrders(ordersData);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "No se pudo cargar tu panel."));
  }, [session.token]);

  return (
    <div className="grid gap-6">
      {message && <div className="glass-card px-6 py-4 text-sm text-(--primary)">{message}</div>}

      <section className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-(--primary)">Mi perfil</p>
          <h2 className="mt-2 text-2xl font-semibold">{profile?.fullName ?? session.fullName}</h2>
          <div className="mt-5 grid gap-3 text-sm text-(--muted)">
            <p>Correo: {profile?.email ?? session.email}</p>
            <p>Teléfono: {profile?.phone || "No registrado"}</p>
            <p>Tipo de cuenta: {profile?.roles.join(", ") || session.roles.join(", ")}</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-(--primary)">Estado general</p>
          <h2 className="mt-2 text-2xl font-semibold">Tus pedidos recientes</h2>
          <p className="mt-4 text-(--muted)">
            Revisa el estado de tus compras, confirma tus datos y manten el
            seguimiento de cada pedido en un solo lugar.
          </p>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-2xl font-semibold">Historial de pedidos</h2>
        <div className="mt-5 grid gap-4">
          {orders.length === 0 && <p className="text-(--muted)">Aun no tienes pedidos registrados. Cuando realices tu primera compra, la veras aqui.</p>}
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl bg-white/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Pedido #{order.id}</p>
                  <p className="text-sm text-(--muted)">{new Date(order.createdAt).toLocaleDateString("es-PE")}</p>
                </div>
                <span className="rounded-full bg-(--accent) px-4 py-2 text-sm text-(--primary)">{order.status}</span>
              </div>
              <p className="mt-3 text-sm text-(--muted)">Envío: {order.shippingAddress}</p>
              <p className="mt-2 text-sm text-(--muted)">Total: S/ {Number(order.totalAmount).toFixed(2)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
