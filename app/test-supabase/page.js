import { addMessage } from "./actions";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="mb-6 text-3xl font-bold">
        Contact Form
      </h1>

      <form action={addMessage} className="space-y-4">
        <input
          name="name"
          placeholder="Nama"
          required
          className="w-full rounded border p-3"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border p-3"
        />

        <textarea
          name="message"
          placeholder="Pesan"
          required
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Kirim
        </button>
      </form>
    </main>
  );
}