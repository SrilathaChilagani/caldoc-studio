import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { loadLabCart, saveLabCart, type LabCartItem } from "@/lib/labCart";

const LAB_TEST_OPTIONS = [
  "Complete Blood Count", "Lipid Profile", "Thyroid Panel (T3/T4/TSH)", "HbA1c",
  "Blood Sugar Fasting", "Liver Function Test", "Kidney Function Test", "Vitamin D3",
  "Vitamin B12", "Iron Studies", "Urine Routine & Microscopy", "Dengue NS1 Antigen",
  "COVID-19 RT-PCR", "ECG (12-Lead)", "Chest X-Ray", "CRP (C-Reactive Protein)",
  "Beta HCG (Pregnancy)", "PSA (Prostate Specific Antigen)", "ESR", "Widal Test",
  "Blood Grouping & Rh Typing", "Serum Creatinine", "Serum Uric Acid",
  "Calcium (Serum)", "Phosphorus (Serum)", "Electrolytes Panel",
  "Prothrombin Time (PT/INR)", "D-Dimer", "Ferritin", "Troponin I",
  "BNP / NT-proBNP", "Anti-TPO Antibodies", "Testosterone (Total)",
  "Prolactin", "Cortisol (Morning)", "FSH & LH", "Estradiol",
  "AMH (Anti-Mullerian Hormone)", "Semen Analysis", "Stool Routine",
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "blood-tests": ["blood", "cbc", "metabolic", "lipid", "hba1c", "thyroid", "vitamin", "liver", "kidney", "crp", "ferritin"],
  imaging: ["imaging", "scan", "ct", "mri"],
  pathology: ["pathology", "urinalysis", "crp", "ferritin"],
  ultrasound: ["ultrasound"],
  ecg: ["ecg"],
  "x-ray": ["x-ray", "xray", "chest"],
  allergy: ["allergy"],
  "covid-19": ["covid", "rt-pcr"],
};

const PAGE_SIZE = 12;

function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

export default function LabsSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [cart, setCart] = useState<LabCartItem[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, number>>({});
  const [draftVisible, setDraftVisible] = useState<Record<string, boolean>>({});
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => { setCart(loadLabCart()); }, []);
  useEffect(() => { saveLabCart(cart); }, [cart]);
  useEffect(() => { setLocalQuery(query); }, [query]);

  const filtered = useMemo(() => {
    let base = LAB_TEST_OPTIONS;
    const keywords = CATEGORY_KEYWORDS[category] || [];
    if (keywords.length) {
      base = base.filter((t) => keywords.some((kw) => t.toLowerCase().includes(kw)));
    }
    if (query) {
      const lower = query.toLowerCase();
      base = base.filter((t) => t.toLowerCase().includes(lower));
    }
    return base;
  }, [query, category]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const tests = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cartMap = useMemo(() => {
    const map = new Map<string, LabCartItem>();
    cart.forEach((item) => map.set(normalizeName(item.name), item));
    return map;
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + Math.max(1, item.qty || 0), 0);

  const updateCartItem = (name: string, qty: number) => {
    const normalized = normalizeName(name);
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => normalizeName(item.name) !== normalized));
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      const idx = next.findIndex((item) => normalizeName(item.name) === normalized);
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty };
      } else {
        next.push({ name, qty });
      }
      return next;
    });
  };

  const submitSearch = (value: string) => {
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    if (category) params.set("category", category);
    setSearchParams(params);
  };

  const suggestions = filtered.slice(0, 10);

  return (
    <Layout>
      <section className="relative pb-12 pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-6 lg:px-12">
          <Button variant="ghost" size="sm" className="mb-4 gap-1.5 text-muted-foreground" onClick={() => navigate("/labs")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">Search lab tests</h1>
            <p className="mt-3 text-sm text-muted-foreground">Find lab tests and packages. Add them to your order in one click.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); submitSearch(localQuery); }}
            className="mt-8 flex flex-col gap-2 glass rounded-2xl p-2 shadow-elevated sm:flex-row sm:items-center sm:gap-3 max-w-3xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search tests, packages..."
                className="h-12 pl-10 bg-background/50 border-0 rounded-xl focus-visible:ring-1"
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-xl">Search</Button>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-foreground">{query ? "Suggested Tests" : "Popular tests"}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {query ? <span>Showing results for "{query}".</span> : <span>Start typing to see more precise results.</span>}
              {category && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                  {category.replace(/-/g, " ")}
                  <Link to={`/labs/search${query ? `?q=${encodeURIComponent(query)}` : ""}`} className="text-primary hover:text-primary/80">Clear</Link>
                </span>
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Showing {tests.length} of {total}</span>
        </div>

        {total > PAGE_SIZE && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Page {page} of {totalPages}</span>
            <div className="flex flex-wrap gap-3">
              {page > 1 && (
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => {
                  const p = new URLSearchParams(searchParams); p.set("page", String(page - 1)); setSearchParams(p);
                }}>Previous</Button>
              )}
              {page < totalPages && (
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => {
                  const p = new URLSearchParams(searchParams); p.set("page", String(page + 1)); setSearchParams(p);
                }}>Next</Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="glass rounded-[28px] p-4 shadow-elevated">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-sm text-muted-foreground">
                {totalItems > 0 ? `${totalItems} test${totalItems === 1 ? "" : "s"} added` : "No tests added yet"}
              </div>
              <Button size="sm" className="rounded-full" disabled={cart.length === 0} onClick={() => navigate("/labs/review")}>
                Review Order
              </Button>
            </div>

            {tests.length === 0 ? (
              <div className="py-8 text-sm text-muted-foreground text-center">No tests found. Try another name or keyword.</div>
            ) : (
              <div className="divide-y divide-border">
                {tests.map((test) => {
                  const cartItem = cartMap.get(normalizeName(test));
                  const isDraft = draftVisible[normalizeName(test)] && !cartItem;
                  return (
                    <div key={test} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-foreground">{test}</p>
                        <p className="text-xs text-muted-foreground">Home collection available</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {cartItem ? (
                          <>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm text-foreground">
                              <button type="button" onClick={() => updateCartItem(test, Math.max(1, cartItem.qty - 1))} className="h-7 w-7 rounded-full border border-border text-muted-foreground hover:bg-muted">-</button>
                              <input type="number" min={1} max={99} value={cartItem.qty} onChange={(e) => updateCartItem(test, Number(e.target.value) || 1)} className="w-12 bg-transparent text-center text-sm outline-none" />
                              <button type="button" onClick={() => updateCartItem(test, cartItem.qty + 1)} className="h-7 w-7 rounded-full border border-border text-muted-foreground hover:bg-muted">+</button>
                            </div>
                            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">Added</span>
                            <button type="button" onClick={() => updateCartItem(test, 0)} className="text-xs font-semibold text-destructive hover:text-destructive/80">Remove</button>
                          </>
                        ) : isDraft ? (
                          <>
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1 text-sm text-foreground">
                              <span className="text-xs text-muted-foreground">Qty</span>
                              <input type="number" min={1} max={99} value={draftQty[normalizeName(test)] ?? 1}
                                onChange={(e) => setDraftQty((prev) => ({ ...prev, [normalizeName(test)]: Math.max(1, Number(e.target.value) || 1) }))}
                                className="w-12 bg-transparent text-center text-sm outline-none" />
                            </div>
                            <Button size="sm" className="rounded-full" onClick={() => {
                              updateCartItem(test, draftQty[normalizeName(test)] ?? 1);
                              setDraftVisible((prev) => ({ ...prev, [normalizeName(test)]: false }));
                            }}>Add to order</Button>
                          </>
                        ) : (
                          <Button size="sm" className="rounded-full" onClick={() => {
                            const key = normalizeName(test);
                            setDraftVisible((prev) => ({ ...prev, [key]: true }));
                            setDraftQty((prev) => ({ ...prev, [key]: prev[key] ?? 1 }));
                          }}>Add to order</Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="glass rounded-[28px] p-6 shadow-elevated">
            <h3 className="font-serif text-lg text-foreground">Suggested Tests</h3>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {suggestions.length === 0 ? (
                <p>Search to see related tests.</p>
              ) : (
                suggestions.map((item) => (
                  <Link
                    key={item}
                    to={`/labs/search?q=${encodeURIComponent(item)}`}
                    className="block w-full rounded-xl border border-border bg-background/70 px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:text-primary"
                  >
                    {item}
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
