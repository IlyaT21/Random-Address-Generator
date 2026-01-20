// src/App.tsx
import React, { useState } from "react";
import "./App.scss";

type Country = { code: string; name: string };

const COUNTRIES: Country[] = [
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CH", name: "Switzerland" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "IE", name: "Ireland" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "NZ", name: "New Zealand" },
  { code: "RS", name: "Serbia" },
  { code: "TR", name: "Turkey" },
  { code: "UA", name: "Ukraine" },
  { code: "US", name: "United States" },
];

export default function App() {
  const [country, setCountry] = useState<string>(COUNTRIES[0].code);
  const [amount, setAmount] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1) {
      setError("Please enter a number greater than 0.");
      return;
    }
    setError(null);
    // replace with whatever you need to do with the data
    alert(`Country: ${country}\nNumber: ${amount}`);
  };

  return (
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
              step={1}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
              aria-describedby={error ? "num-error" : undefined}
            />
          </div>
        </div>

        {error && (
          <div id="num-error" className="error" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn">
          GENERATE
        </button>
      </form>
    </div>
  );
}
