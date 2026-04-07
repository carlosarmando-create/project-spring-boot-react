"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/api";
import { ContactMessage, Order, Plant, UserSummary, Category, AuthSession } from "@/lib/types";

type Props = {
  session: AuthSession;
};

const emptyPlant = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "",
  botanicalName: "",
  sizeLabel: "",
  categoryId: "",
  featured: false,
  active: true,
  image: null as File | null,
};

const emptyCategoryForm = {
  name: "",
  slug: "",
  description: "",
};

export function AdminDashboard({ session }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [plantForm, setPlantForm] = useState(emptyPlant);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const plantImageInputRef = useRef<HTMLInputElement | null>(null);

  async function loadData() {
    const token = session.token;
    const [plantsData, categoriesData, ordersData, contactsData, usersData] = await Promise.all([
      apiFetch<Plant[]>("/plants/admin", { token }),
      apiFetch<Category[]>("/categories", { token }),
      apiFetch<Order[]>("/orders", { token }),
      apiFetch<ContactMessage[]>("/contacts", { token }),
      apiFetch<UserSummary[]>("/users", { token }),
    ]);
    setPlants(plantsData);
    setCategories(categoriesData);
    setOrders(ordersData);
    setContacts(contactsData);
    setUsers(usersData);
  }

  useEffect(() => {
    loadData().catch((error) => {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se pudo cargar el panel.");
    });
  }, [session.token]);

  async function handlePlantSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("name", plantForm.name);
    formData.append("slug", plantForm.slug);
    formData.append("shortDescription", plantForm.shortDescription);
    formData.append("description", plantForm.description);
    formData.append("price", plantForm.price);
    formData.append("stock", plantForm.stock);
    formData.append("botanicalName", plantForm.botanicalName);
    formData.append("sizeLabel", plantForm.sizeLabel);
    formData.append("categoryId", plantForm.categoryId);
    formData.append("featured", String(plantForm.featured));
    formData.append("active", String(plantForm.active));
    if (plantForm.image) {
      formData.append("image", plantForm.image);
    }

    try {
      await apiFetch("/plants", {
        method: "POST",
        body: formData,
        token: session.token,
      });
      setPlantForm(emptyPlant);
      if (plantImageInputRef.current) {
        plantImageInputRef.current.value = "";
      }
      setMessageType("success");
      setMessage("Se creó correctamente el producto.");
      await loadData();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se creó correctamente el producto.");
    }
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      await apiFetch("/categories", {
        method: "POST",
        token: session.token,
        body: JSON.stringify({
          name: categoryForm.name,
          slug: categoryForm.slug,
          description: categoryForm.description,
          active: true,
        }),
      });
      setCategoryForm(emptyCategoryForm);
      setMessageType("success");
      setMessage("Se creó correctamente la categoría.");
      await loadData();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se creó correctamente la categoría.");
    }
  }

  async function changeOrderStatus(orderId: number, status: string) {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: "PATCH",
        token: session.token,
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el pedido.");
    }
  }

  async function updateContactStatus(contactId: number, status: string) {
    try {
      await apiFetch(`/contacts/${contactId}/status`, {
        method: "PATCH",
        token: session.token,
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el contacto.");
    }
  }

  async function updateUserRoles(userId: number, roles: string[]) {
    try {
      await apiFetch(`/users/${userId}/roles`, {
        method: "PUT",
        token: session.token,
        body: JSON.stringify({ roles }),
      });
      await loadData();
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar el usuario.");
    }
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Productos", plants.length],
          ["Categorías", categories.length],
          ["Pedidos", orders.length],
          ["Contactos", contacts.length],
        ].map(([label, value]) => (
          <div key={label} className="glass-card p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-(--muted)">{label}</p>
            <p className="mt-3 text-4xl font-semibold text-(--primary)">{value}</p>
          </div>
        ))}
      </section>

      {message && (
        <div
          className={`glass-card px-6 py-4 text-sm ${
            messageType === "error" ? "border border-red-200 bg-red-50 text-red-700" : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={handlePlantSubmit} className="glass-card grid gap-4 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-(--primary)">Nuevo producto</p>
            <h2 className="mt-2 text-2xl font-semibold">Registrar planta</h2>
          </div>
          <input value={plantForm.name} onChange={(e) => setPlantForm({ ...plantForm, name: e.target.value })} placeholder="Nombre" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <input value={plantForm.slug} onChange={(e) => setPlantForm({ ...plantForm, slug: e.target.value })} placeholder="Slug" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <input value={plantForm.shortDescription} onChange={(e) => setPlantForm({ ...plantForm, shortDescription: e.target.value })} placeholder="Descripción corta" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <textarea value={plantForm.description} onChange={(e) => setPlantForm({ ...plantForm, description: e.target.value })} placeholder="Descripción larga" className="min-h-28 rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          <div className="grid gap-4 md:grid-cols-2">
            <input value={plantForm.price} onChange={(e) => setPlantForm({ ...plantForm, price: e.target.value })} type="number" step="0.01" placeholder="Precio" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
            <input value={plantForm.stock} onChange={(e) => setPlantForm({ ...plantForm, stock: e.target.value })} type="number" placeholder="Stock" className="rounded-2xl border border-(--border) bg-white px-4 py-3" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input value={plantForm.botanicalName} onChange={(e) => setPlantForm({ ...plantForm, botanicalName: e.target.value })} placeholder="Nombre botánico" className="rounded-2xl border border-(--border) bg-white px-4 py-3" />
            <input value={plantForm.sizeLabel} onChange={(e) => setPlantForm({ ...plantForm, sizeLabel: e.target.value })} placeholder="Tamaño" className="rounded-2xl border border-(--border) bg-white px-4 py-3" />
          </div>
          <select value={plantForm.categoryId} onChange={(e) => setPlantForm({ ...plantForm, categoryId: e.target.value })} className="rounded-2xl border border-(--border) bg-white px-4 py-3" required>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input ref={plantImageInputRef} type="file" accept="image/*" onChange={(e) => setPlantForm({ ...plantForm, image: e.target.files?.[0] ?? null })} className="rounded-2xl border border-(--border) bg-white px-4 py-3" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={plantForm.featured} onChange={(e) => setPlantForm({ ...plantForm, featured: e.target.checked })} />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={plantForm.active} onChange={(e) => setPlantForm({ ...plantForm, active: e.target.checked })} />
              Activo
            </label>
          </div>
          <button className="rounded-full bg-(--primary) px-5 py-3 font-medium text-white">Guardar producto</button>
        </form>

        <form onSubmit={handleCategorySubmit} className="glass-card grid gap-4 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-(--primary)">Categorías</p>
            <h2 className="mt-2 text-2xl font-semibold">Crear categoría</h2>
          </div>
          <input
            name="name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            placeholder="Nombre de categoría"
            className="rounded-2xl border border-(--border) bg-white px-4 py-3"
            required
          />
          <input
            name="slug"
            value={categoryForm.slug}
            onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
            placeholder="Slug"
            className="rounded-2xl border border-(--border) bg-white px-4 py-3"
            required
          />
          <textarea
            name="description"
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            placeholder="Descripción"
            className="min-h-28 rounded-2xl border border-(--border) bg-white px-4 py-3"
          />
          <button className="rounded-full bg-(--secondary) px-5 py-3 font-medium text-(--foreground)">Crear categoría</button>
          <div className="mt-4 grid gap-3">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl bg-white/70 px-4 py-3">
                <p className="font-medium">{category.name}</p>
                <p className="text-sm text-(--muted)">{category.description}</p>
              </div>
            ))}
          </div>
        </form>
      </section>

      <section className="glass-card p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-(--primary)">Catalogo visible para clientes</p>
            <h2 className="mt-2 text-2xl font-semibold">Vista compacta de tus productos</h2>
          </div>
          <p className="max-w-xl text-sm text-(--muted)">
            Revisa como se presenta cada producto, su disponibilidad y la
            informacion clave antes de destacarlo o compartirlo con tus
            clientes.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {plants.map((plant) => (
            <article key={plant.id} className="rounded-3xl bg-white/70 p-4">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl">
                  <Image src={resolveAssetUrl(plant.imageUrl)} alt={plant.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold">{plant.name}</p>
                    <span className="text-sm font-medium text-(--primary)">S/ {Number(plant.price).toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-sm text-(--muted)">{plant.botanicalName || plant.categoryName}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-(--muted)">{plant.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-(--muted)">
                    <span className="rounded-full bg-white px-3 py-2">Stock {plant.stock}</span>
                    <span className="rounded-full bg-white px-3 py-2">{plant.sizeLabel || "Tamaño estándar"}</span>
                    <Link href={`/catalogo/${plant.slug}`} className="rounded-full border border-(--primary) px-3 py-2 font-medium text-(--primary)">
                      Detalle
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold">Pedidos</h2>
          <div className="mt-5 grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-3xl bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm text-(--muted)">{order.customerName} · S/ {Number(order.totalAmount).toFixed(2)}</p>
                  </div>
                  <select defaultValue={order.status} onChange={(e) => changeOrderStatus(order.id, e.target.value)} className="rounded-full border border-(--border) bg-white px-3 py-2 text-sm">
                    {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-(--muted)">
                  <p>Correo: {order.customerEmail}</p>
                  <p>Teléfono: {order.customerPhone}</p>
                  <p>Pago: {order.paymentMethod}</p>
                  <p>Envío: {order.shippingAddress}</p>
                  {order.notes && <p>Nota: {order.notes}</p>}
                </div>
                <div className="mt-4 grid gap-2">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.plantId}`} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm">
                      <span>{item.plantName} x{item.quantity}</span>
                      <span className="font-medium">S/ {Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold">Mensajes de contacto</h2>
          <div className="mt-5 grid gap-4">
            {contacts.map((contact) => (
              <article key={contact.id} className="rounded-3xl bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{contact.subject}</p>
                    <p className="text-sm text-(--muted)">{contact.fullName} · {contact.email}</p>
                  </div>
                  <select defaultValue={contact.status} onChange={(e) => updateContactStatus(contact.id, e.target.value)} className="rounded-full border border-(--border) bg-white px-3 py-2 text-sm">
                    {["NEW", "READ", "ANSWERED"].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-3 text-sm leading-6 text-(--muted)">{contact.message}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="text-2xl font-semibold">Usuarios y roles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {users.map((user) => {
            const isAdmin = user.roles.includes("ROLE_ADMIN");
            const isCustomer = user.roles.includes("ROLE_CUSTOMER");
            return (
              <article key={user.id} className="rounded-3xl bg-white/70 p-4">
                <p className="font-semibold">{user.fullName}</p>
                <p className="text-sm text-(--muted)">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) =>
                        updateUserRoles(
                          user.id,
                          [e.target.checked ? "ROLE_ADMIN" : null, isCustomer ? "ROLE_CUSTOMER" : null].filter(Boolean) as string[],
                        )
                      }
                    />
                    Administrador
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isCustomer}
                      onChange={(e) =>
                        updateUserRoles(
                          user.id,
                          [isAdmin ? "ROLE_ADMIN" : null, e.target.checked ? "ROLE_CUSTOMER" : null].filter(Boolean) as string[],
                        )
                      }
                    />
                    Cliente
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
