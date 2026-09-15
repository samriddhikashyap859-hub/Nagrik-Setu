import React, { useState } from "react";
import {
  MapPin, FileText, Search, CheckCircle2, Circle, Clock3, Wallet,
  ShieldCheck, IndianRupee, ArrowRight, Upload, ChevronRight, Star,
  Lock, RefreshCw
} from "lucide-react";

// ---------- Mock reference data ----------
const DISTRICTS = {
  "Central Delhi": { code: "CD", wards: ["Karol Bagh", "Paharganj", "Daryaganj"] },
  "New Delhi": { code: "ND", wards: ["Connaught Place", "Chanakyapuri", "Rajinder Nagar"] },
  "North Delhi": { code: "NO", wards: ["Model Town", "Sadar Bazar", "Civil Lines"] },
  "South Delhi": { code: "SO", wards: ["Hauz Khas", "Saket", "Greater Kailash"] },
  "East Delhi": { code: "EA", wards: ["Preet Vihar", "Mayur Vihar", "Laxmi Nagar"] },
  "West Delhi": { code: "WE", wards: ["Rajouri Garden", "Janakpuri", "Tilak Nagar"] },
  "North West Delhi": { code: "NW", wards: ["Rohini", "Pitampura", "Shalimar Bagh"] },
  "South West Delhi": { code: "SW", wards: ["Dwarka", "Vasant Kunj", "Najafgarh"] },
  "North East Delhi": { code: "NE", wards: ["Seelampur", "Yamuna Vihar", "Karawal Nagar"] },
  "South East Delhi": { code: "SE", wards: ["Kalkaji", "Okhla", "Sarita Vihar"] },
  Shahdara: { code: "SH", wards: ["Shahdara", "Vivek Vihar", "Dilshad Garden"] },
};

const CATEGORIES = [
  "Sanitation & Waste",
  "Water Supply",
  "Roads & Potholes",
  "Streetlights & Electricity",
  "Drainage & Sewage",
  "Encroachment",
  "Other",
];

const OFFICERS = [
  "R. Sharma — Sanitation Inspector",
  "A. Verma — PWD Junior Engineer",
  "S. Khan — Electrical Officer",
  "N. Gupta — Zonal Sanitary Officer",
  "P. Iyer — Drainage Supervisor",
];

const STAGES = ["Filed", "Assigned", "In Progress", "Resolved"];

const DISTRICT_STATS = [
  { name: "North East Delhi", count: 1842 },
  { name: "South Delhi", count: 1510 },
  { name: "West Delhi", count: 1298 },
  { name: "Central Delhi", count: 964 },
  { name: "North West Delhi", count: 887 },
];

function genComplaintId(district) {
  const code = DISTRICTS[district]?.code || "GN";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DL-${code}-${num}`;
}

function statusStyles(status) {
  switch (status) {
    case "Filed": return "bg-stone-200 text-stone-700";
    case "Assigned": return "bg-amber-100 text-amber-800";
    case "In Progress": return "bg-blue-100 text-blue-800";
    case "Resolved": return "bg-emerald-100 text-emerald-800";
    default: return "bg-stone-200 text-stone-700";
  }
}

// ---------- Shared chrome ----------
function ArchDivider() {
  return (
    <svg viewBox="0 0 400 24" className="w-full h-6 text-red-800/20" preserveAspectRatio="none">
      {Array.from({ length: 10 }).map((_, i) => (
        <path
          key={i}
          d={`M${i * 40} 24 A20 20 0 0 1 ${i * 40 + 40} 24`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function Nav({ page, setPage, wallet, setWallet }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "register", label: "Register Complaint" },
    { key: "track", label: "Track Complaint" },
  ];
  return (
    <header className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur border-b border-stone-300">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => setPage("home")}
          className="flex items-center gap-2 text-left focus:outline-none focus:ring-2 focus:ring-red-800 rounded-sm"
        >
          <ShieldCheck className="w-6 h-6 text-red-800" strokeWidth={1.75} />
          <div>
            <div className="font-serif text-lg leading-none text-slate-900">Delhi Nagrik Setu</div>
            <div className="text-[11px] text-stone-500 leading-none mt-0.5">दिल्ली नागरिक सेतु</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setPage(it.key)}
              className={`px-3 py-2 text-sm rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 ${
                page === it.key
                  ? "text-red-800 border-b-2 border-red-800 font-medium"
                  : "text-stone-600 hover:text-slate-900"
              }`}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setWallet(wallet ? null : "0x4F1a...9A2c")}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-red-800 ${
            wallet
              ? "border-emerald-700 text-emerald-800 bg-emerald-50"
              : "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-stone-50"
          }`}
        >
          <Wallet className="w-4 h-4" strokeWidth={1.75} />
          {wallet ? wallet : "Connect Wallet"}
        </button>
      </div>
      <div className="md:hidden max-w-6xl mx-auto px-5 pb-2 flex gap-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setPage(it.key)}
            className={`flex-1 text-xs py-2 rounded-sm ${
              page === it.key ? "bg-slate-900 text-stone-50" : "bg-stone-200 text-stone-700"
            }`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ---------- Home ----------
function Home({ setPage, complaintsCount }) {
  const totalFiled = 12482 + complaintsCount;
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-10 grid md:grid-cols-5 gap-8 items-end">
        <div className="md:col-span-3">
          <h1 className="font-serif text-4xl md:text-5xl leading-tight text-slate-900">
            Every complaint has an address.
            <br />Every rupee leaves a trail.
          </h1>
          <p className="mt-5 text-stone-600 text-base max-w-md leading-relaxed">
            A public record for Delhi's civic grievances and municipal spending —
            filed by citizens, tracked by ward, and settled in the open.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => setPage("register")}
              className="flex items-center gap-2 bg-red-800 text-stone-50 px-5 py-3 rounded-sm text-sm font-medium hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800"
            >
              Register a complaint <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage("track")}
              className="flex items-center gap-2 border border-slate-900 text-slate-900 px-5 py-3 rounded-sm text-sm font-medium hover:bg-slate-900 hover:text-stone-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              Track a complaint
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          <ArchDivider />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 grid sm:grid-cols-3 gap-px bg-stone-300 border border-stone-300">
        {[
          { label: "Complaints filed", value: totalFiled.toLocaleString("en-IN") },
          { label: "Resolution rate", value: "78%" },
          { label: "Funds tracked", value: "₹342 Cr" },
        ].map((s) => (
          <div key={s.label} className="bg-stone-50 p-6">
            <div className="font-serif text-3xl text-slate-900">{s.value}</div>
            <div className="text-sm text-stone-500 mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-5 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-serif text-2xl text-slate-900 mb-4">Where complaints are coming from</h2>
          <div className="space-y-3">
            {DISTRICT_STATS.map((d) => {
              const pct = Math.round((d.count / DISTRICT_STATS[0].count) * 100);
              return (
                <div key={d.name}>
                  <div className="flex justify-between text-sm text-stone-600 mb-1">
                    <span>{d.name}</span>
                    <span>{d.count.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-sm overflow-hidden">
                    <div className="h-full bg-red-800" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border border-stone-300 p-6 bg-white">
          <div className="flex items-center gap-2 text-slate-900 mb-2">
            <IndianRupee className="w-5 h-5 text-red-800" strokeWidth={1.75} />
            <h2 className="font-serif text-xl">How the money is tracked</h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Every municipal transaction is written to a public ledger, tied to the
            scheme it funds. A district only receives next month's allocation once
            it has completed its outstanding work and spent what it was already given.
          </p>
          <button
            onClick={() => setPage("track")}
            className="mt-4 text-sm text-red-800 font-medium flex items-center gap-1 hover:underline"
          >
            See a live fund ledger <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

// ---------- Register ----------
function Register({ onSubmit }) {
  const [step, setStep] = useState(1);
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [confirmedId, setConfirmedId] = useState(null);

  const wards = district ? DISTRICTS[district].wards : [];

  function next() {
    if (step === 1 && !district) return setError("Select a district to continue.");
    if (step === 1 && !ward) return setError("Select a ward or MCD zone to continue.");
    if (step === 2 && !category) return setError("Select a category to continue.");
    if (step === 2 && description.trim().length < 10) return setError("Add a few more details (10+ characters).");
    setError("");
    setStep(step + 1);
  }

  function submit() {
    if (!agreed) return setError("Confirm the on-chain record checkbox to submit.");
    const id = genComplaintId(district);
    const officer = OFFICERS[Math.floor(Math.random() * OFFICERS.length)];
    const now = new Date();
    onSubmit({
      id, district, ward, category, description,
      filedAt: now,
      officer,
      status: "Filed",
      history: [{ status: "Filed", at: now }],
    });
    setConfirmedId(id);
    setStep(4);
    setError("");
  }

  if (step === 4 && confirmedId) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto mb-4" strokeWidth={1.5} />
        <h1 className="font-serif text-2xl text-slate-900">Complaint filed</h1>
        <p className="text-stone-600 mt-2">
          Your complaint has been recorded and assigned a public tracking ID.
        </p>
        <div className="mt-6 inline-block border border-stone-300 bg-white px-6 py-4">
          <div className="text-xs text-stone-500 mb-1">Complaint ID</div>
          <div className="font-mono text-xl text-slate-900">{confirmedId}</div>
        </div>
        <p className="text-xs text-stone-500 mt-3">Save this ID — it's the only way to look up your complaint.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="font-serif text-2xl text-slate-900 mb-1">Register a complaint</h1>
      <p className="text-stone-500 text-sm mb-6">Step {step} of 3</p>

      <div className="flex gap-1 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-sm ${s <= step ? "bg-red-800" : "bg-stone-200"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <Field label="District">
            <select
              value={district}
              onChange={(e) => { setDistrict(e.target.value); setWard(""); }}
              className="w-full border border-stone-300 rounded-sm px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              <option value="">Select district</option>
              {Object.keys(DISTRICTS).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Ward / MCD Zone">
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!district}
              className="w-full border border-stone-300 rounded-sm px-3 py-2.5 text-sm bg-white disabled:bg-stone-100 disabled:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              <option value="">{district ? "Select ward" : "Select a district first"}</option>
              {wards.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-stone-300 rounded-sm px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-800"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what's wrong and where exactly it is."
              className="w-full border border-stone-300 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </Field>
          <Field label="Photo (optional)">
            <label className="flex items-center gap-2 border border-dashed border-stone-300 rounded-sm px-3 py-3 text-sm text-stone-500 cursor-pointer hover:border-red-800">
              <Upload className="w-4 h-4" />
              {fileName || "Click to attach a photo"}
              <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
            </label>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="border border-stone-300 bg-white p-5 space-y-2 text-sm">
            <Row label="District" value={district} />
            <Row label="Ward" value={ward} />
            <Row label="Category" value={category} />
            <Row label="Description" value={description} />
            {fileName && <Row label="Attachment" value={fileName} />}
          </div>
          <label className="flex items-start gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
            I confirm this complaint will be recorded on a public ledger for transparency.
          </label>
        </div>
      )}

      {error && <p className="text-sm text-red-800 mt-4">{error}</p>}

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button onClick={() => { setStep(step - 1); setError(""); }} className="text-sm text-stone-600 px-4 py-2.5 hover:text-slate-900">
            Back
          </button>
        ) : <span />}
        {step < 3 ? (
          <button onClick={next} className="bg-red-800 text-stone-50 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-red-900">
            Continue
          </button>
        ) : (
          <button onClick={submit} className="bg-red-800 text-stone-50 px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-red-900">
            Submit complaint
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-stone-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-stone-500 shrink-0">{label}</span>
      <span className="text-slate-900 text-right">{value}</span>
    </div>
  );
}

// ---------- Track ----------
function Track({ complaints, initialId }) {
  const [query, setQuery] = useState(initialId || "");
  const [selectedId, setSelectedId] = useState(initialId || null);
  const [, forceRerender] = useState(0);

  const selected = complaints.find((c) => c.id === selectedId);

  function search() {
    const found = complaints.find((c) => c.id.toLowerCase() === query.trim().toLowerCase());
    setSelectedId(found ? found.id : "__notfound__");
  }

  function advance(c) {
    const idx = STAGES.indexOf(c.status);
    if (idx < STAGES.length - 1) {
      c.status = STAGES[idx + 1];
      c.history.push({ status: c.status, at: new Date() });
      forceRerender((n) => n + 1);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-3">
        <h1 className="font-serif text-2xl text-slate-900 mb-4">Track a complaint</h1>
        <div className="flex gap-2 max-w-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Enter complaint ID, e.g. DL-CD-4821"
            className="flex-1 border border-stone-300 rounded-sm px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-800"
          />
          <button onClick={search} className="bg-slate-900 text-stone-50 px-4 rounded-sm flex items-center gap-1.5 text-sm hover:bg-slate-800">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      <div className="md:col-span-1">
        <h2 className="text-sm font-medium text-stone-500 mb-3">My complaints (this session)</h2>
        {complaints.length === 0 && (
          <p className="text-sm text-stone-400">No complaints filed yet.</p>
        )}
        <div className="space-y-2">
          {complaints.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`w-full text-left border px-3 py-2.5 rounded-sm transition-colors ${
                selectedId === c.id ? "border-red-800 bg-red-50" : "border-stone-300 bg-white hover:border-stone-400"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-slate-900">{c.id}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusStyles(c.status)}`}>{c.status}</span>
              </div>
              <div className="text-xs text-stone-500 mt-1">{c.category}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        {!selected && (
          <div className="border border-dashed border-stone-300 rounded-sm p-10 text-center text-stone-400 text-sm">
            Search a complaint ID or pick one from the list to see its status.
          </div>
        )}
        {selected === undefined && selectedId === "__notfound__" && (
          <div className="border border-dashed border-red-300 bg-red-50 rounded-sm p-6 text-center text-red-800 text-sm">
            No complaint found with that ID.
          </div>
        )}
        {selected && (
          <div className="border border-stone-300 bg-white p-6">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="font-mono text-lg text-slate-900">{selected.id}</div>
                <div className="text-sm text-stone-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selected.ward}, {selected.district}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles(selected.status)}`}>{selected.status}</span>
            </div>
            <p className="text-sm text-stone-600 mt-3 mb-6">{selected.description}</p>

            <div className="flex items-center mb-6">
              {STAGES.map((s, i) => {
                const done = STAGES.indexOf(selected.status) >= i;
                return (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1.5">
                      {done ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <Circle className="w-5 h-5 text-stone-300" />}
                      <span className={`text-[11px] ${done ? "text-slate-900" : "text-stone-400"}`}>{s}</span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`flex-1 h-px mx-1 ${STAGES.indexOf(selected.status) > i ? "bg-emerald-700" : "bg-stone-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="border border-stone-200 p-4 mb-4">
              {STAGES.indexOf(selected.status) >= 1 ? (
                <div className="flex items-center gap-2 text-sm text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-red-800" />
                  Assigned to <span className="font-medium">{selected.officer}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-stone-400">
                  <Lock className="w-4 h-4" /> Officer will be shown once assigned
                </div>
              )}
            </div>

            {selected.status === "Resolved" && (
              <div className="border border-stone-200 p-4 mb-4">
                <div className="text-sm text-stone-600 mb-2">Rate how this was resolved</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                </div>
              </div>
            )}

            <div className="border border-dashed border-stone-300 p-3 flex items-center justify-between">
              <span className="text-xs text-stone-500">Demo control — simulates the officer updating this complaint</span>
              <button
                onClick={() => advance(selected)}
                disabled={selected.status === "Resolved"}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-stone-400 rounded-sm text-stone-700 hover:border-slate-900 disabled:opacity-40 disabled:hover:border-stone-400"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Advance status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [page, setPage] = useState("home");
  const [wallet, setWallet] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [lastFiledId, setLastFiledId] = useState(null);

  function handleFile(c) {
    setComplaints((prev) => [c, ...prev]);
    setLastFiledId(c.id);
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900">
      <Nav page={page} setPage={setPage} wallet={wallet} setWallet={setWallet} />
      {page === "home" && <Home setPage={setPage} complaintsCount={complaints.length} />}
      {page === "register" && <Register onSubmit={handleFile} />}
      {page === "track" && <Track complaints={complaints} initialId={page === "track" ? null : lastFiledId} />}
      <footer className="border-t border-stone-300 mt-10">
        <div className="max-w-6xl mx-auto px-5 py-6 text-xs text-stone-400 flex justify-between">
          <span>Delhi Nagrik Setu — prototype build</span>
          <span>Not affiliated with the Government of Delhi</span>
        </div>
      </footer>
    </div>
  );
}
