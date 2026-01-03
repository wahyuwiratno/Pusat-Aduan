import { useState } from "react";

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const CATEGORIES = [
  { value: "network", label: "Network" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

export default function TicketForm({ initialValues, onSubmit, submitLabel = "Submit" }) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "other");
  const [priority, setPriority] = useState(initialValues?.priority ?? "medium");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (title.trim().length < 3) return setErr("Title minimal 3 karakter");
    if (description.trim().length < 10) return setErr("Description minimal 10 karakter");

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
    };

    // Debug cepat: pastikan priority yang terkirim benar
    console.log("CREATE TICKET PAYLOAD:", payload);

    try {
      setLoading(true);
      await onSubmit(payload);
    } catch (e) {
      setErr(e?.response?.data?.message || "Gagal submit ticket");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
      <div>
        <label className="text-sm">Title</label>
        <input
          className="w-full border rounded-lg p-2 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Description</label>
        <textarea
          className="w-full border rounded-lg p-2 mt-1 min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Category</label>
          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Priority</label>
          <select
            className="w-full border rounded-lg p-2 mt-1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {err}
        </div>
      )}

      <button disabled={loading} className="w-full bg-black text-white rounded-lg p-2 disabled:opacity-50">
        {loading ? "Mengirim..." : submitLabel}
      </button>
    </form>
  );
}
