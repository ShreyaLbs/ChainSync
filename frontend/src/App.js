import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API = "https://chainsync-api.up.railway.app/api";

const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap";
document.head.appendChild(fontLink);

const globalStyle = document.createElement("style");
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --g1: #6c3fd5; --g2: #e040c8; --g3: #ff6b6b; --g4: #4fd1c5; --g5: #f6ad55;
    --glass-bg: rgba(255,255,255,0.07);
    --glass-border: rgba(255,255,255,0.15);
    --glass-shadow: 0 8px 32px rgba(0,0,0,0.3);
    --text: #f0f0ff; --muted: rgba(240,240,255,0.5);
    --font-head: 'Clash Display', sans-serif;
    --font-body: 'Cabinet Grotesk', sans-serif;
  }
  body { background:#0a0015; color:var(--text); font-family:var(--font-body); min-height:100vh; overflow-x:hidden; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:4px; }
  .mesh-bg {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 80% 60% at 10% 10%, rgba(108,63,213,0.35) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 90% 20%, rgba(224,64,200,0.3) 0%, transparent 70%),
      radial-gradient(ellipse 70% 60% at 80% 80%, rgba(255,107,107,0.2) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 10% 80%, rgba(79,209,197,0.2) 0%, transparent 70%),
      #0a0015;
  }
  .orb { position:fixed; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; animation:float 12s ease-in-out infinite alternate; }
  .orb1 { width:400px; height:400px; top:-100px; left:-100px; background:rgba(108,63,213,0.4); animation-duration:10s; }
  .orb2 { width:350px; height:350px; top:40%; right:-80px; background:rgba(224,64,200,0.35); animation-duration:14s; }
  .orb3 { width:300px; height:300px; bottom:-80px; left:30%; background:rgba(79,209,197,0.25); animation-duration:11s; }
  @keyframes float { 0%{transform:translate(0,0) scale(1);} 100%{transform:translate(30px,40px) scale(1.1);} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes pulse  { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
  @keyframes spin   { to{transform:rotate(360deg);} }
  @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
  .fade-up { animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
  .blink   { animation:pulse 2s infinite; }
  .glass {
    background:var(--glass-bg);
    backdrop-filter:blur(20px) saturate(180%);
    -webkit-backdrop-filter:blur(20px) saturate(180%);
    border:1px solid var(--glass-border);
    border-radius:16px;
    box-shadow:var(--glass-shadow);
  }
  /* 3D hover card */
  .card-3d {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s;
    transform-style: preserve-3d;
    cursor: pointer;
  }
  .card-3d:hover {
    transform: translateY(-8px) rotateX(4deg) rotateY(-4deg) scale(1.03);
    box-shadow: 0 30px 60px rgba(108,63,213,0.35), 0 0 40px rgba(224,64,200,0.2);
  }
  .glass-input {
    background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12);
    border-radius:10px; color:var(--text); font-family:var(--font-body);
    font-size:14px; padding:10px 14px; outline:none; width:100%;
    transition:border-color 0.2s, background 0.2s;
  }
  .glass-input:focus { border-color:rgba(108,63,213,0.6); background:rgba(255,255,255,0.1); }
  .glass-input::placeholder { color:var(--muted); }
  select.glass-input option { background:#1a0035; color:#fff; }
  .trow:hover { background:rgba(255,255,255,0.05) !important; }
  .nav-item {
    width:100%; display:flex; align-items:center; gap:10px;
    padding:10px 14px; border-radius:12px; margin-bottom:4px;
    background:transparent; color:var(--muted); border:1px solid transparent;
    cursor:pointer; font-family:var(--font-body); font-size:14px; font-weight:500;
    text-align:left; transition:all 0.2s;
  }
  .nav-item:hover { background:rgba(255,255,255,0.06); color:var(--text); }
  .nav-item.active { background:linear-gradient(135deg,rgba(108,63,213,0.3),rgba(224,64,200,0.2)); border-color:rgba(255,255,255,0.15); color:#fff; }
  .btn-primary { background:linear-gradient(135deg,#6c3fd5,#e040c8); border:none; border-radius:10px; color:#fff; font-family:var(--font-body); font-size:14px; font-weight:600; padding:10px 20px; cursor:pointer; box-shadow:0 4px 20px rgba(108,63,213,0.4); transition:opacity 0.2s,transform 0.1s; }
  .btn-primary:hover { opacity:0.9; transform:translateY(-1px); }
  .btn-ghost { background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:10px; color:var(--muted); font-family:var(--font-body); font-size:13px; font-weight:500; padding:8px 16px; cursor:pointer; transition:all 0.2s; }
  .btn-ghost:hover { background:rgba(255,255,255,0.12); color:var(--text); }
  .btn-danger { background:rgba(255,107,107,0.15); border:1px solid rgba(255,107,107,0.3); border-radius:10px; color:#ff6b6b; font-family:var(--font-body); font-size:13px; font-weight:500; padding:8px 16px; cursor:pointer; transition:all 0.2s; }
  .btn-danger:hover { background:rgba(255,107,107,0.25); }
  .prog-bar { height:6px; border-radius:3px; background:rgba(255,255,255,0.1); overflow:hidden; }
  .prog-fill { height:100%; border-radius:3px; transition:width 1s cubic-bezier(0.22,1,0.36,1); }
  .spinner { width:32px; height:32px; border:3px solid rgba(255,255,255,0.1); border-top-color:#6c3fd5; border-radius:50%; animation:spin 0.8s linear infinite; margin:40px auto; }
  .skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.05) 25%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.05) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:10px; }

  /* Recharts custom */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background:rgba(20,0,40,0.95) !important;
    border:1px solid rgba(255,255,255,0.15) !important;
    border-radius:10px !important;
    color:#f0f0ff !important;
    font-family:'Cabinet Grotesk',sans-serif !important;
    font-size:13px !important;
  }
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line { stroke:rgba(255,255,255,0.06) !important; }
  .recharts-text { fill:rgba(240,240,255,0.5) !important; font-family:'Cabinet Grotesk',sans-serif !important; font-size:11px !important; }
`;
document.head.appendChild(globalStyle);

// ── API ───────────────────────────────────────────────────────────────────────
const apiFetch = (path) => fetch(`${API}${path}`).then(r => r.json());
const apiPost  = (path, body) => fetch(`${API}${path}`, { method:"POST",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.json());
const apiPut   = (path, body) => fetch(`${API}${path}`, { method:"PUT",   headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.json());
const apiDel   = (path)       => fetch(`${API}${path}`, { method:"DELETE" }).then(r => r.json());

// ── UI Helpers ────────────────────────────────────────────────────────────────
const GlassCard   = ({ children, style:s={}, gradient }) => (
  <div className="glass" style={{ padding:24, position:"relative", overflow:"hidden", ...s }}>
    {gradient && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${gradient})`, borderRadius:"16px 16px 0 0" }} />}
    {children}
  </div>
);
const Card3D = ({ children, style:s={}, gradient }) => (
  <div className="glass card-3d" style={{ padding:24, position:"relative", overflow:"hidden", ...s }}>
    {gradient && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${gradient})`, borderRadius:"16px 16px 0 0" }} />}
    {children}
  </div>
);
const GlassInput  = (props) => <input className="glass-input" {...props} />;
const GlassSelect = ({ children, ...props }) => <select className="glass-input" {...props}>{children}</select>;
const Label       = ({ children }) => <label style={{ fontSize:11, color:"var(--muted)", letterSpacing:1.5, display:"block", marginBottom:6, fontWeight:600 }}>{children}</label>;
const IdBadge     = ({ id }) => <span style={{ background:"rgba(108,63,213,0.2)", color:"#b794f4", border:"1px solid rgba(108,63,213,0.3)", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{id}</span>;
const Spinner     = () => <div className="spinner" />;

const StatCard = ({ label, value, sub, gradient, icon }) => (
  <Card3D gradient={gradient} style={{ padding:22 }}>
    <div style={{ fontSize:26, marginBottom:10 }}>{icon}</div>
    <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>{label}</div>
    <div style={{ fontFamily:"var(--font-head)", fontSize:34, fontWeight:700, background:`linear-gradient(135deg,${gradient})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{value}</div>
    <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>{sub}</div>
  </Card3D>
);

const TableHeader = ({ cols }) => (
  <thead>
    <tr style={{ background:"rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
      {cols.map(h => <th key={h} style={{ padding:"14px 18px", textAlign:"left", fontSize:10, letterSpacing:2, color:"var(--muted)", fontWeight:600 }}>{h}</th>)}
    </tr>
  </thead>
);

const Modal = ({ title, onClose, children }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
    <div className="glass fade-up" style={{ padding:28, width:500, maxWidth:"95vw", borderRadius:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:22 }}>
        <span style={{ fontFamily:"var(--font-head)", fontSize:20, fontWeight:600 }}>{title}</span>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", color:"var(--muted)", cursor:"pointer", borderRadius:8, width:32, height:32, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(20,0,40,0.95)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"10px 14px", fontFamily:"var(--font-body)" }}>
      <div style={{ color:"var(--muted)", fontSize:11, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color, fontSize:13, fontWeight:600 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

// ══ LOGIN ══════════════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ username:"", password:"" });
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);
  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      if (form.username==="admin" && form.password==="admin123") onLogin();
      else { setErr("Invalid credentials. Try admin / admin123"); setLoading(false); }
    }, 700);
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", zIndex:1 }}>
      <div className="fade-up" style={{ width:400 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:72, height:72, margin:"0 auto 16px", background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, boxShadow:"0 0 40px rgba(108,63,213,0.6)" }}>⬡</div>
          <div style={{ fontFamily:"var(--font-head)", fontSize:32, fontWeight:700, letterSpacing:-1 }}>
            Chain<span style={{ background:"linear-gradient(135deg,#e040c8,#ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sync</span>
          </div>
          <div style={{ color:"var(--muted)", fontSize:12, letterSpacing:3, marginTop:4 }}>SUPPLY CHAIN MANAGEMENT</div>
        </div>
        <div className="glass" style={{ padding:32, borderRadius:24, position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#6c3fd5,#e040c8,#ff6b6b)", borderRadius:"24px 24px 0 0" }} />
          <div style={{ marginBottom:18 }}><Label>USERNAME</Label><GlassInput placeholder="admin" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} /></div>
          <div style={{ marginBottom:22 }}><Label>PASSWORD</Label><GlassInput type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&handle()} /></div>
          {err && <div style={{ background:"rgba(255,107,107,0.12)", border:"1px solid rgba(255,107,107,0.25)", borderRadius:10, padding:"10px 14px", color:"#ff6b6b", fontSize:13, marginBottom:16 }}>{err}</div>}
          <button className="btn-primary" onClick={handle} style={{ width:"100%", padding:"13px", fontSize:15, borderRadius:12 }}>{loading?"Signing in...":"Sign In →"}</button>
          <div style={{ textAlign:"center", marginTop:14, color:"var(--muted)", fontSize:12 }}>Demo: admin / admin123</div>
        </div>
      </div>
    </div>
  );
};

// ══ DASHBOARD ══════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [all, setAll]     = useState({ s:[], p:[], c:[], o:[], inv:[], wh:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/suppliers'), apiFetch('/products'), apiFetch('/customers'),
      apiFetch('/orders'),    apiFetch('/inventory'), apiFetch('/warehouses')
    ]).then(([s,p,c,o,inv,wh]) => { setAll({s,p,c,o,inv,wh}); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;
  const { s, p, c, o, inv, wh } = all;
  const totalBill = o.reduce((a,x) => a + parseFloat(x.Bill), 0);

  // Chart data
  const catData = p.reduce((acc,x) => { acc[x.Category]=(acc[x.Category]||0)+1; return acc; }, {});
  const pieData = Object.entries(catData).map(([name,value]) => ({name,value}));
  const pieColors = ["#6c3fd5","#e040c8","#4fd1c5","#f6ad55","#ff6b6b"];

  const invData = inv.map(i => {
    const prod = p.find(x => x.ProductID===i.ProductID);
    return { name: prod?.ProductName?.split(" ").slice(0,2).join(" ") || i.ProductID, qty: i.QuantityAvailable };
  });

  const whData = wh.map(w => {
    const used = inv.filter(i=>i.WarehouseID===w.WarehouseID).reduce((a,i)=>a+i.QuantityAvailable,0);
    return { name: w.WarehouseName.split(" ")[0], used, capacity: w.Capacity };
  });

  return (
    <div className="fade-up">
      <div style={{ marginBottom:30 }}>
        <div style={{ fontFamily:"var(--font-head)", fontSize:30, fontWeight:700 }}>Dashboard</div>
        <div style={{ color:"var(--muted)", fontSize:13, marginTop:6 }}>
          <span className="blink" style={{ color:"#4fd1c5", marginRight:8 }}>●</span>
          Live · {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stat Cards — 3D hover */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Suppliers"   value={s.length} sub="registered"          gradient="#6c3fd5,#e040c8" icon="🏭" />
        <StatCard label="Products"    value={p.length} sub="in catalog"          gradient="#e040c8,#ff6b6b" icon="📦" />
        <StatCard label="Customers"   value={c.length} sub="registered"          gradient="#4fd1c5,#6c3fd5" icon="👥" />
        <StatCard label="Total Bills" value={`₹${(totalBill/1000).toFixed(0)}K`} sub="across all orders" gradient="#f6ad55,#e040c8" icon="💰" />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        {/* Bar chart — Inventory */}
        <GlassCard gradient="#6c3fd5,#4fd1c5">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:18 }}>📊 Inventory Levels</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={invData} margin={{top:0,right:0,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" name="Quantity" radius={[6,6,0,0]}>
                {invData.map((_,i) => <Cell key={i} fill={pieColors[i%5]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Pie chart — Product categories */}
        <GlassCard gradient="#e040c8,#f6ad55">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:18 }}>🍩 Product Categories</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={1000}>
                {pieData.map((_,i) => <Cell key={i} fill={pieColors[i]} stroke="none" />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginTop:8 }}>
            {pieData.map((d,i) => (
              <div key={d.name} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:pieColors[i] }} />
                <span style={{ fontSize:11, color:"var(--muted)" }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Warehouse bar chart */}
        <GlassCard gradient="#4fd1c5,#6c3fd5">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:18 }}>🏗 Warehouse Utilization</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={whData} margin={{top:0,right:0,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="used"     name="Stock"    fill="#4fd1c5" radius={[4,4,0,0]} />
              <Bar dataKey="capacity" name="Capacity" fill="rgba(108,63,213,0.4)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Recent orders */}
        <GlassCard gradient="#f6ad55,#ff6b6b">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:16 }}>🛒 Recent Orders</div>
          {o.slice().reverse().slice(0,5).map(x => (
            <div key={x.OrderID} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{x.OrderID}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{x.CustomerID} · {x.OrderDate}</div>
              </div>
              <span style={{ fontWeight:700, color:"#f6ad55", fontSize:14 }}>₹{parseFloat(x.Bill).toLocaleString()}</span>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
};

// ══ SUPPLIERS ══════════════════════════════════════════════════════════════════
const Suppliers = () => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({});
  const [delId, setDelId]   = useState(null);

  const load = useCallback(() => { setLoading(true); apiFetch('/suppliers').then(d=>{setData(d);setLoading(false);}); },[]);
  useEffect(()=>{load();},[load]);

  const blank = { SupplierID:"", SupplierName:"", ContactNumber:"", Location:"" };
  const save = async () => {
    if (modal==="add") await apiPost('/suppliers', form);
    else await apiPut(`/suppliers/${form.SupplierID}`, form);
    setModal(null); load();
  };
  const filtered = data.filter(s => s.SupplierName.toLowerCase().includes(search.toLowerCase()) || s.SupplierID.includes(search));

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Suppliers</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} registered suppliers</div></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Supplier</button>
      </div>
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? <Spinner /> : (
        <GlassCard style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <TableHeader cols={["SupplierID","SupplierName","ContactNumber","Location","Actions"]} />
            <tbody>
              {filtered.map(s => (
                <tr key={s.SupplierID} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding:"13px 18px" }}><IdBadge id={s.SupplierID} /></td>
                  <td style={{ padding:"13px 18px", fontWeight:600 }}>{s.SupplierName}</td>
                  <td style={{ padding:"13px 18px", color:"var(--muted)" }}>{s.ContactNumber}</td>
                  <td style={{ padding:"13px 18px", color:"var(--muted)" }}>{s.Location}</td>
                  <td style={{ padding:"13px 18px" }}>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="btn-ghost" onClick={()=>{setForm({...s});setModal("edit");}} style={{ padding:"5px 12px", fontSize:12 }}>Edit</button>
                      <button className="btn-danger" onClick={()=>setDelId(s.SupplierID)} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
      {modal && (
        <Modal title={modal==="add"?"Add Supplier":"Edit Supplier"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>SUPPLIER ID</Label><GlassInput value={form.SupplierID||""} onChange={e=>setForm({...form,SupplierID:e.target.value})} placeholder="e.g. S006" /></div>}
            <div><Label>SUPPLIER NAME</Label><GlassInput value={form.SupplierName||""} onChange={e=>setForm({...form,SupplierName:e.target.value})} /></div>
            <div><Label>CONTACT NUMBER</Label><GlassInput value={form.ContactNumber||""} onChange={e=>setForm({...form,ContactNumber:e.target.value})} /></div>
            <div><Label>LOCATION</Label><GlassInput value={form.Location||""} onChange={e=>setForm({...form,Location:e.target.value})} /></div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      {delId && (
        <Modal title="Confirm Delete" onClose={()=>setDelId(null)}>
          <div style={{ color:"var(--muted)", marginBottom:20 }}>Delete this supplier?</div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-danger" onClick={async()=>{await apiDel(`/suppliers/${delId}`);setDelId(null);load();}}>Delete</button>
            <button className="btn-ghost" onClick={()=>setDelId(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ PRODUCTS ══════════════════════════════════════════════════════════════════
const Products = () => {
  const [data, setData]         = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});
  const [search, setSearch]     = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/products'), apiFetch('/suppliers')]).then(([p,s])=>{setData(p);setSuppliers(s);setLoading(false);});
  },[]);
  useEffect(()=>{load();},[load]);

  const blank = { ProductID:"", ProductName:"", Category:"Machinery", UnitPrice:0, SupplierID:"" };
  const save = async () => {
    if (modal==="add") await apiPost('/products', form);
    else await apiPut(`/products/${form.ProductID}`, form);
    setModal(null); load();
  };

  const catGrad = { Machinery:"#6c3fd5,#4fd1c5", "Raw Materials":"#4fd1c5,#6c3fd5", Components:"#e040c8,#6c3fd5", Packaging:"#f6ad55,#e040c8" };
  const filtered = data.filter(p => p.ProductName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Products</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} products in catalog</div></div>
        <button className="btn-primary" onClick={()=>{setForm({...blank,SupplierID:suppliers[0]?.SupplierID||""});setModal("add");}}>+ Add Product</button>
      </div>
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? <Spinner /> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {filtered.map(p => {
            const sup  = suppliers.find(s=>s.SupplierID===p.SupplierID);
            const grad = catGrad[p.Category]||"#6c3fd5,#e040c8";
            return (
              <Card3D key={p.ProductID} gradient={grad} style={{ padding:22 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                  <IdBadge id={p.ProductID} />
                  <span style={{ background:"rgba(255,255,255,0.1)", color:"var(--muted)", border:"1px solid rgba(255,255,255,0.15)", padding:"3px 10px", borderRadius:20, fontSize:11 }}>{p.Category}</span>
                </div>
                <div style={{ fontFamily:"var(--font-head)", fontSize:17, fontWeight:600, marginBottom:6 }}>{p.ProductName}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:16 }}>🏭 {sup?.SupplierName || p.SupplierID}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"var(--font-head)", fontSize:22, fontWeight:700, background:`linear-gradient(135deg,${grad})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>₹{parseFloat(p.UnitPrice).toLocaleString()}</span>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="btn-ghost" onClick={()=>{setForm({...p});setModal("edit");}} style={{ fontSize:12, padding:"5px 12px" }}>Edit</button>
                    <button className="btn-danger" onClick={async()=>{await apiDel(`/products/${p.ProductID}`);load();}} style={{ fontSize:12, padding:"5px 12px" }}>Del</button>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={modal==="add"?"Add Product":"Edit Product"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>PRODUCT ID</Label><GlassInput value={form.ProductID||""} onChange={e=>setForm({...form,ProductID:e.target.value})} placeholder="e.g. P007" /></div>}
            <div><Label>PRODUCT NAME</Label><GlassInput value={form.ProductName||""} onChange={e=>setForm({...form,ProductName:e.target.value})} /></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><Label>CATEGORY</Label>
                <GlassSelect value={form.Category} onChange={e=>setForm({...form,Category:e.target.value})} style={{width:"100%"}}>
                  {["Machinery","Raw Materials","Components","Packaging"].map(c=><option key={c}>{c}</option>)}
                </GlassSelect>
              </div>
              <div><Label>UNIT PRICE (₹)</Label><GlassInput type="number" value={form.UnitPrice||0} onChange={e=>setForm({...form,UnitPrice:+e.target.value})} /></div>
              <div><Label>SUPPLIER</Label>
                <GlassSelect value={form.SupplierID} onChange={e=>setForm({...form,SupplierID:e.target.value})} style={{width:"100%"}}>
                  {suppliers.map(s=><option key={s.SupplierID} value={s.SupplierID}>{s.SupplierName}</option>)}
                </GlassSelect>
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ WAREHOUSES ════════════════════════════════════════════════════════════════
const Warehouses = () => {
  const [data, setData]       = useState([]);
  const [inv, setInv]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({});

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/warehouses'), apiFetch('/inventory')]).then(([w,i])=>{setData(w);setInv(i);setLoading(false);});
  },[]);
  useEffect(()=>{load();},[load]);

  const blank = { WarehouseID:"", WarehouseName:"", Location:"", Capacity:5000 };
  const save = async () => {
    if (modal==="add") await apiPost('/warehouses', form);
    else await apiPut(`/warehouses/${form.WarehouseID}`, form);
    setModal(null); load();
  };
  const grads = ["#6c3fd5,#4fd1c5","#e040c8,#6c3fd5","#ff6b6b,#e040c8","#4fd1c5,#f6ad55"];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Warehouses</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} locations</div></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Warehouse</button>
      </div>
      {loading ? <Spinner /> : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {data.map((w,i) => {
            const used = inv.filter(x=>x.WarehouseID===w.WarehouseID).reduce((a,x)=>a+x.QuantityAvailable,0);
            const pct  = Math.min(100, Math.round((used/w.Capacity)*100));
            const c    = pct>85?"#ff6b6b":pct>60?"#f6ad55":"#4fd1c5";
            const grad = grads[i%4];
            return (
              <Card3D key={w.WarehouseID} gradient={grad}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                      <IdBadge id={w.WarehouseID} />
                      <span style={{ fontFamily:"var(--font-head)", fontSize:18, fontWeight:700 }}>{w.WarehouseName}</span>
                    </div>
                    <div style={{ color:"var(--muted)", fontSize:12 }}>📍 {w.Location}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700, color:c }}>{pct}%</div>
                    <div style={{ fontSize:10, color:"var(--muted)" }}>utilized</div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  {[["Capacity",`${w.Capacity.toLocaleString()} u`],["Stock",`${used.toLocaleString()} u`]].map(([l,v])=>(
                    <div key={l} className="glass" style={{ padding:"10px 12px", borderRadius:10 }}>
                      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:1, marginBottom:4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="prog-bar" style={{ height:8, marginBottom:14 }}>
                  <div className="prog-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${c}88,${c})` }} />
                </div>
                <button className="btn-ghost" onClick={()=>{setForm({...w});setModal("edit");}} style={{ fontSize:12 }}>Edit Warehouse</button>
              </Card3D>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={modal==="add"?"Add Warehouse":"Edit Warehouse"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>WAREHOUSE ID</Label><GlassInput value={form.WarehouseID||""} onChange={e=>setForm({...form,WarehouseID:e.target.value})} placeholder="e.g. W005" /></div>}
            <div><Label>WAREHOUSE NAME</Label><GlassInput value={form.WarehouseName||""} onChange={e=>setForm({...form,WarehouseName:e.target.value})} /></div>
            <div><Label>LOCATION</Label><GlassInput value={form.Location||""} onChange={e=>setForm({...form,Location:e.target.value})} /></div>
            <div><Label>CAPACITY</Label><GlassInput type="number" value={form.Capacity||0} onChange={e=>setForm({...form,Capacity:+e.target.value})} /></div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ INVENTORY ════════════════════════════════════════════════════════════════
const Inventory = () => {
  const [data, setData]         = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});
  const [search, setSearch]     = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/inventory'), apiFetch('/products'), apiFetch('/warehouses')]).then(([i,p,w])=>{
      setData(i); setProducts(p); setWarehouses(w); setLoading(false);
    });
  },[]);
  useEffect(()=>{load();},[load]);

  const blank = { InventoryID:"", QuantityAvailable:0, ProductID:"", WarehouseID:"" };
  const save = async () => {
    if (modal==="add") await apiPost('/inventory', form);
    else await apiPut(`/inventory/${form.InventoryID}`, form);
    setModal(null); load();
  };
  const filtered = data.filter(i => {
    const p = products.find(x=>x.ProductID===i.ProductID);
    return p?.ProductName.toLowerCase().includes(search.toLowerCase()) || i.InventoryID.includes(search);
  });

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Inventory</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} stock records</div></div>
        <button className="btn-primary" onClick={()=>{setForm({...blank,ProductID:products[0]?.ProductID||"",WarehouseID:warehouses[0]?.WarehouseID||""});setModal("add");}}>+ Add Stock</button>
      </div>
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search inventory..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? <Spinner /> : (
        <GlassCard style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <TableHeader cols={["InventoryID","Product","Warehouse","Qty Available","Actions"]} />
            <tbody>
              {filtered.map(i => {
                const prod = products.find(p=>p.ProductID===i.ProductID);
                const wh   = warehouses.find(w=>w.WarehouseID===i.WarehouseID);
                const c    = i.QuantityAvailable<100?"#ff6b6b":i.QuantityAvailable<500?"#f6ad55":"#4fd1c5";
                return (
                  <tr key={i.InventoryID} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding:"13px 18px" }}><IdBadge id={i.InventoryID} /></td>
                    <td style={{ padding:"13px 18px", fontWeight:600 }}>{prod?.ProductName||i.ProductID}</td>
                    <td style={{ padding:"13px 18px", color:"var(--muted)" }}>{wh?.WarehouseName||i.WarehouseID}</td>
                    <td style={{ padding:"13px 18px", fontWeight:700, color:c }}>{i.QuantityAvailable}</td>
                    <td style={{ padding:"13px 18px" }}>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="btn-ghost" onClick={()=>{setForm({...i});setModal("edit");}} style={{ padding:"5px 12px", fontSize:12 }}>Edit</button>
                        <button className="btn-danger" onClick={async()=>{await apiDel(`/inventory/${i.InventoryID}`);load();}} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}
      {modal && (
        <Modal title={modal==="add"?"Add Stock":"Edit Stock"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>INVENTORY ID</Label><GlassInput value={form.InventoryID||""} onChange={e=>setForm({...form,InventoryID:e.target.value})} placeholder="e.g. I007" /></div>}
            <div><Label>PRODUCT</Label>
              <GlassSelect value={form.ProductID} onChange={e=>setForm({...form,ProductID:e.target.value})} style={{width:"100%"}}>
                {products.map(p=><option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>WAREHOUSE</Label>
              <GlassSelect value={form.WarehouseID} onChange={e=>setForm({...form,WarehouseID:e.target.value})} style={{width:"100%"}}>
                {warehouses.map(w=><option key={w.WarehouseID} value={w.WarehouseID}>{w.WarehouseName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>QUANTITY AVAILABLE</Label><GlassInput type="number" value={form.QuantityAvailable||0} onChange={e=>setForm({...form,QuantityAvailable:+e.target.value})} /></div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ CUSTOMERS ════════════════════════════════════════════════════════════════
const Customers = () => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState({});
  const [search, setSearch] = useState("");
  const [delId, setDelId]   = useState(null);

  const load = useCallback(() => { setLoading(true); apiFetch('/customers').then(d=>{setData(d);setLoading(false);}); },[]);
  useEffect(()=>{load();},[load]);

  const blank = { CustomerID:"", CustomerName:"", ContactNumber:"", Address:"" };
  const save = async () => {
    if (modal==="add") await apiPost('/customers', form);
    else await apiPut(`/customers/${form.CustomerID}`, form);
    setModal(null); load();
  };
  const filtered = data.filter(c => c.CustomerName.toLowerCase().includes(search.toLowerCase()));
  const grads = ["#6c3fd5,#e040c8","#e040c8,#4fd1c5","#4fd1c5,#f6ad55","#f6ad55,#6c3fd5","#ff6b6b,#e040c8"];

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Customers</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} registered customers</div></div>
        <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Customer</button>
      </div>
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search customers..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? <Spinner /> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
          {filtered.map((c,i) => {
            const grad = grads[i%5];
            return (
              <Card3D key={c.CustomerID} gradient={grad} style={{ padding:22 }}>
                <div style={{ marginBottom:14 }}><IdBadge id={c.CustomerID} /></div>
                <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${grad})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>{c.CustomerName.charAt(0)}</div>
                <div style={{ fontFamily:"var(--font-head)", fontSize:17, fontWeight:600, marginBottom:6 }}>{c.CustomerName}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>📞 {c.ContactNumber}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:16 }}>📍 {c.Address}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-ghost" onClick={()=>{setForm({...c});setModal("edit");}} style={{ fontSize:12, padding:"5px 12px" }}>Edit</button>
                  <button className="btn-danger" onClick={()=>setDelId(c.CustomerID)} style={{ fontSize:12, padding:"5px 12px" }}>Del</button>
                </div>
              </Card3D>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={modal==="add"?"Add Customer":"Edit Customer"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>CUSTOMER ID</Label><GlassInput value={form.CustomerID||""} onChange={e=>setForm({...form,CustomerID:e.target.value})} placeholder="e.g. C006" /></div>}
            <div><Label>CUSTOMER NAME</Label><GlassInput value={form.CustomerName||""} onChange={e=>setForm({...form,CustomerName:e.target.value})} /></div>
            <div><Label>CONTACT NUMBER</Label><GlassInput value={form.ContactNumber||""} onChange={e=>setForm({...form,ContactNumber:e.target.value})} /></div>
            <div><Label>ADDRESS</Label><GlassInput value={form.Address||""} onChange={e=>setForm({...form,Address:e.target.value})} /></div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      {delId && (
        <Modal title="Confirm Delete" onClose={()=>setDelId(null)}>
          <div style={{ color:"var(--muted)", marginBottom:20 }}>Delete this customer?</div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-danger" onClick={async()=>{await apiDel(`/customers/${delId}`);setDelId(null);load();}}>Delete</button>
            <button className="btn-ghost" onClick={()=>setDelId(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ ORDERS ════════════════════════════════════════════════════════════════════
// ══ ORDERS - Replace this entire component in your App.js ════════════════════
const Orders = () => {
  const [data, setData]         = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});
  const [search, setSearch]     = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/orders'), apiFetch('/customers'), apiFetch('/products')]).then(([o,c,p])=>{
      setData(o); setCustomers(c); setProducts(p); setLoading(false);
    });
  },[]);
  useEffect(()=>{load();},[load]);

  const blank = { OrderID:"", OrderDate:new Date().toISOString().split("T")[0], Bill:0, CustomerID:"", ProductID:"" };
  const save = async () => {
    if (modal==="add") await apiPost('/orders', form);
    else await apiPut(`/orders/${form.OrderID}`, form);
    setModal(null); load();
  };
  const filtered = data.filter(o => {
    const c = customers.find(x=>x.CustomerID===o.CustomerID);
    return c?.CustomerName.toLowerCase().includes(search.toLowerCase()) || o.OrderID.includes(search);
  });

  return (
    <div className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
        <div><div style={{ fontFamily:"var(--font-head)", fontSize:28, fontWeight:700 }}>Orders</div><div style={{ color:"var(--muted)", fontSize:13 }}>{data.length} total orders</div></div>
        <button className="btn-primary" onClick={()=>{setForm({...blank, CustomerID:customers[0]?.CustomerID||"", ProductID:products[0]?.ProductID||""});setModal("add");}}>+ New Order</button>
      </div>
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search by customer or order ID..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? <Spinner /> : (
        <GlassCard style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <TableHeader cols={["OrderID","Date","Bill","Customer","Product","Actions"]} />
            <tbody>
              {filtered.map(o => {
                const cust = customers.find(c=>c.CustomerID===o.CustomerID);
                const prod = products.find(p=>p.ProductID===o.ProductID);
                return (
                  <tr key={o.OrderID} className="trow" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding:"13px 16px" }}><IdBadge id={o.OrderID} /></td>
                    <td style={{ padding:"13px 16px", color:"var(--muted)" }}>{o.OrderDate}</td>
                    <td style={{ padding:"13px 16px", fontWeight:700, background:"linear-gradient(135deg,#e040c8,#f6ad55)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>₹{parseFloat(o.Bill).toLocaleString()}</td>
                    <td style={{ padding:"13px 16px", fontWeight:600 }}>{cust?.CustomerName||o.CustomerID}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ background:"rgba(108,63,213,0.15)", color:"#b794f4", border:"1px solid rgba(108,63,213,0.3)", padding:"3px 10px", borderRadius:20, fontSize:11 }}>
                        {prod?.ProductName||o.ProductID||"—"}
                      </span>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", gap:8 }}>
                        <button className="btn-ghost" onClick={()=>{setForm({...o});setModal("edit");}} style={{ padding:"5px 12px", fontSize:12 }}>Edit</button>
                        <button className="btn-danger" onClick={async()=>{await apiDel(`/orders/${o.OrderID}`);load();}} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}
      {modal && (
        <Modal title={modal==="add"?"New Order":"Edit Order"} onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            {modal==="add" && <div><Label>ORDER ID</Label><GlassInput value={form.OrderID||""} onChange={e=>setForm({...form,OrderID:e.target.value})} placeholder="e.g. ORD007" /></div>}
            <div><Label>CUSTOMER</Label>
              <GlassSelect value={form.CustomerID} onChange={e=>setForm({...form,CustomerID:e.target.value})} style={{width:"100%"}}>
                {customers.map(c=><option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>PRODUCT</Label>
              <GlassSelect value={form.ProductID} onChange={e=>setForm({...form,ProductID:e.target.value})} style={{width:"100%"}}>
                {products.map(p=><option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>ORDER DATE</Label><GlassInput type="date" value={form.OrderDate||""} onChange={e=>setForm({...form,OrderDate:e.target.value})} /></div>
            <div><Label>BILL (₹)</Label><GlassInput type="number" value={form.Bill||0} onChange={e=>setForm({...form,Bill:+e.target.value})} /></div>
            <div style={{ display:"flex", gap:10, marginTop:4 }}>
              <button className="btn-primary" onClick={save}>Save Order</button>
              <button className="btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ APP ═══════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard", icon:"◈",  label:"Dashboard"  },
  { id:"suppliers", icon:"🏭", label:"Suppliers"  },
  { id:"products",  icon:"📦", label:"Products"   },
  { id:"warehouses",icon:"🏗", label:"Warehouses" },
  { id:"inventory", icon:"📋", label:"Inventory"  },
  { id:"customers", icon:"👥", label:"Customers"  },
  { id:"orders",    icon:"🛒", label:"Orders"     },
];
const PAGES = { dashboard:Dashboard, suppliers:Suppliers, products:Products, warehouses:Warehouses, inventory:Inventory, customers:Customers, orders:Orders };

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState("dashboard");
  const Bg = () => <><div className="mesh-bg"/><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></>;
  if (!loggedIn) return <><Bg/><LoginPage onLogin={()=>setLoggedIn(true)}/></>;
  const Page = PAGES[page];
  return (
    <>
      <Bg/>
      <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>
        {/* Sidebar */}
        <div className="glass" style={{ width:230, borderRadius:0, borderTop:"none", borderLeft:"none", borderBottom:"none", display:"flex", flexDirection:"column", position:"fixed", height:"100vh", left:0, top:0, backdropFilter:"blur(30px)", zIndex:10 }}>
          <div style={{ padding:"28px 22px 22px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, boxShadow:"0 0 20px rgba(108,63,213,0.5)" }}>⬡</div>
              <div>
                <div style={{ fontFamily:"var(--font-head)", fontSize:18, fontWeight:700 }}>Chain<span style={{ background:"linear-gradient(135deg,#e040c8,#ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sync</span></div>
                <div style={{ fontSize:9, color:"var(--muted)", letterSpacing:2 }}>SUPPLY CHAIN</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1, padding:"14px 12px", overflowY:"auto" }}>
            <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:2, padding:"0 10px", marginBottom:10 }}>NAVIGATION</div>
            {NAV.map(n => (
              <button key={n.id} onClick={()=>setPage(n.id)} className={`nav-item ${page===n.id?"active":""}`}>
                <span style={{ fontSize:16 }}>{n.icon}</span><span>{n.label}</span>
                {page===n.id && <span style={{ marginLeft:"auto", background:"linear-gradient(135deg,#6c3fd5,#e040c8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:700 }}>›</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"16px 18px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
            <div><div style={{ fontSize:14, fontWeight:600 }}>Admin</div><div style={{ fontSize:10, color:"var(--muted)" }}>admin@chainsync.in</div></div>
            <button onClick={()=>setLoggedIn(false)} style={{ marginLeft:"auto", background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.2)", color:"#ff6b6b", cursor:"pointer", borderRadius:8, width:30, height:30, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>⏻</button>
          </div>
        </div>
        {/* Main */}
        <div style={{ marginLeft:230, flex:1, padding:36, maxWidth:"calc(100vw - 230px)", minHeight:"100vh" }}>
          <Page key={page}/>
        </div>
      </div>
    </>
  );
}