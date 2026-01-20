import React, { useState } from "react";
import "./App.scss";

type Country = { code: string; name: string; phoneCode: string };
type RandomUserAPI = {
  nat: string;
  location: {
    street: {
      number: string;
      name: string;
    };
    state: string;
    city: string;
    postcode: string;
    timezone: {
      offset: string;
    };
  };
  phone: string;
};

type User = {
  nat: string;
  number: string;
  name: string;
  state: string;
  city: string;
  postcode: string;
  offset: string;
  phone: string;
};

const COUNTRIES: Country[] = [
  { code: "AU", name: "Australia", phoneCode: "+61" },
  { code: "BR", name: "Brazil", phoneCode: "+55" },
  { code: "CA", name: "Canada", phoneCode: "+1" },
  { code: "CH", name: "Switzerland", phoneCode: "+41" },
  { code: "DE", name: "Germany", phoneCode: "+49" },
  { code: "DK", name: "Denmark", phoneCode: "+45" },
  { code: "ES", name: "Spain", phoneCode: "+34" },
  { code: "FI", name: "Finland", phoneCode: "+358" },
  { code: "FR", name: "France", phoneCode: "+33" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44" },
  { code: "IE", name: "Ireland", phoneCode: "+353" },
  { code: "IN", name: "India", phoneCode: "+91" },
  { code: "IR", name: "Iran", phoneCode: "+98" },
  { code: "MX", name: "Mexico", phoneCode: "+52" },
  { code: "NL", name: "Netherlands", phoneCode: "+31" },
  { code: "NO", name: "Norway", phoneCode: "+47" },
  { code: "NZ", name: "New Zealand", phoneCode: "+64" },
  { code: "RS", name: "Serbia", phoneCode: "+381" },
  { code: "TR", name: "Turkey", phoneCode: "+90" },
  { code: "UA", name: "Ukraine", phoneCode: "+380" },
  { code: "US", name: "United States", phoneCode: "+1" },
];

export default function App() {
  const [country, setCountry] = useState<string>(COUNTRIES[0].code);
  const [amount, setAmount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const clamp = (n: number) => Math.max(1, Math.min(20, n));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1) {
      setError("Please enter a number greater than 0.");
      return;
    }
    setError(null);
    setUsers([]);
    setLoading(true);

    try {
      const nat = country.toLowerCase();
      const url = `https://randomuser.me/api/?results=${encodeURIComponent(
        String(amount),
      )}&nat=${encodeURIComponent(nat)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const json = (await res.json()) as { results?: RandomUserAPI[] } | null;

      if (
        !json?.results ||
        !Array.isArray(json.results) ||
        json.results.length === 0
      ) {
        setError("No users returned from API for the chosen country.");
        setUsers([]);
      } else {
        const results: User[] = json.results.map((r) => ({
          nat: r.nat,
          state: r.location.state,
          city: r.location.city,
          postcode: r.location.postcode,
          number: r.location.street.number,
          name: r.location.street.name,
          offset: r.location.timezone.offset,
          phone: r.phone,
        }));

        setUsers(results);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-holder-shortcode-custom">
        <h3>Choose a country</h3>

        <form onSubmit={handleSubmit} className="country-form" noValidate>
          <div className="field-holder">
            <div className="field">
              <label htmlFor="country-select">Country</label>
              <select
                id="country-select"
                value={country}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setCountry(e.target.value)
                }
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="quantity-input">Quantity</label>
              <input
                id="quantity-input"
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                step={1}
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const v = Number(e.target.value);
                  if (Number.isNaN(v)) return;
                  setAmount(clamp(v));
                }}
                onBlur={() => setAmount(clamp(amount))}
                aria-describedby={error ? "num-error" : undefined}
              />
            </div>
          </div>

          {error && (
            <div id="num-error" className="error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading…" : "GENERATE"}
          </button>
        </form>
      </div>
      <section
        aria-live="polite"
        aria-busy={loading}
        className="results-shortcode"
      >
        {loading && <div>Generating Data...</div>}

        {!loading && users.length > 0 && (
          <>
            <h3>
              Random address in{" "}
              {COUNTRIES.find((c) => c.code === users[0].nat)?.name ?? "—"}
            </h3>
            <ul className="user-list">
              {users.map((u, i) => {
                return (
                  <li key={i} className="user-item">
                    <h4>Address {i + 1}</h4>
                    <p>Country code: {u.nat}</p>
                    <p>State: {u.state}</p>
                    <p>City: {u.city}</p>
                    <p>Street name: {u.name}</p>
                    <p>Building Number: {u.number}</p>
                    <p>Postcode (ZIP): {u.postcode}</p>
                    <p>Timezone: {u.offset}h</p>
                    <p>
                      Phone code:{" "}
                      {COUNTRIES.find((c) => c.code === u.nat)?.phoneCode ??
                        "—"}
                    </p>
                    <p>Phone: {u.phone}</p>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
