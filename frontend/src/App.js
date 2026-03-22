import { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const API = "https://chainsync-lgzh.onrender.com/api";

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

const apiFetch = (path) => fetch(`${API}${path}`).then(r => r.json());
const apiPost  = (path, body) => fetch(`${API}${path}`, { method:"POST",  headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.json());
const apiPut   = (path, body) => fetch(`${API}${path}`, { method:"PUT",   headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) }).then(r => r.json());
const apiDel   = (path)       => fetch(`${API}${path}`, { method:"DELETE" }).then(r => r.json());

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

const _toastRef = { fn: null };
const showToast = (msg, type = 'success') => _toastRef.fn?.(msg, type);
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  _toastRef.fn = (msg, type) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  if (!toasts.length) return null;
  return (
    <div style={{ position:'fixed', top:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="glass fade-up" style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'13px 20px', borderRadius:14, minWidth:270,
          background: t.type==='success' ? 'rgba(79,209,197,0.12)' : 'rgba(255,107,107,0.12)',
          border: `1px solid ${t.type==='success' ? 'rgba(79,209,197,0.4)' : 'rgba(255,107,107,0.4)'}`,
          boxShadow: t.type==='success' ? '0 8px 32px rgba(79,209,197,0.2)' : '0 8px 32px rgba(255,107,107,0.2)',
        }}>
          <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            background: t.type==='success' ? 'rgba(79,209,197,0.25)' : 'rgba(255,107,107,0.25)',
            color: t.type==='success' ? '#4fd1c5' : '#ff6b6b', fontSize:14, fontWeight:700 }}>
            {t.type==='success' ? '✓' : '✕'}
          </div>
          <span style={{ fontSize:13, fontWeight:500 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ icon='📭', title='Nothing here', sub='', action, actionLabel='Add one' }) => (
  <div style={{ padding:'56px 20px', textAlign:'center' }}>
    <div style={{ fontSize:44, marginBottom:14, opacity:0.5 }}>{icon}</div>
    <div style={{ fontFamily:'var(--font-head)', fontSize:17, fontWeight:600, marginBottom:8 }}>{title}</div>
    {sub && <div style={{ color:'var(--muted)', fontSize:13, marginBottom:22, maxWidth:300, margin:'0 auto 22px' }}>{sub}</div>}
    {action && <button className="btn-primary" onClick={action} style={{ padding:'9px 22px', fontSize:13 }}>{actionLabel}</button>}
  </div>
);

const PageHeader = ({ crumb, title, sub, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
    <div>
      <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:2.5, marginBottom:8 }}>SUPPLY CHAIN › {crumb}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:28, fontWeight:700 }}>{title}</div>
      {sub && <div style={{ color:'var(--muted)', fontSize:13, marginTop:4 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

const SkeletonRow = () => (
  <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
    {[180,140,110,80,90].map((w,i) => (
      <td key={i} style={{ padding:'14px 18px' }}>
        <div className="skeleton" style={{ height:14, width:w, borderRadius:6 }} />
      </td>
    ))}
  </tr>
);
const SkeletonCard = ({ h=160 }) => <div className="skeleton" style={{ height:h, borderRadius:16 }} />;

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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(20,0,40,0.95)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:10, padding:"10px 14px", fontFamily:"var(--font-body)" }}>
      <div style={{ color:"var(--muted)", fontSize:11, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color, fontSize:13, fontWeight:600 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

// ── Status Badge helper ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = status || "Accepted";
  const styles = {
    Accepted: { bg:"rgba(79,209,197,0.15)",  color:"#4fd1c5", border:"1px solid rgba(79,209,197,0.3)"  },
    Pending:  { bg:"rgba(246,173,85,0.15)",  color:"#f6ad55", border:"1px solid rgba(246,173,85,0.3)"  },
    Rejected: { bg:"rgba(255,107,107,0.15)", color:"#ff6b6b", border:"1px solid rgba(255,107,107,0.3)" },
  };
  const st = styles[s] || styles.Accepted;
  return (
    <span style={{ background:st.bg, color:st.color, border:st.border, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600 }}>{s}</span>
  );
};

// ══ LANDING PAGE ════════════════════════════════════════════════════════════════
const LANDING_TARGETS = { suppliers: 6, products: 6, orders: 20, warehouses: 4 };
const LandingPage = ({ onEnter }) => {
  const [count, setCount] = useState({ suppliers: 0, products: 0, orders: 0, warehouses: 0 });

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount({
        suppliers:  Math.floor(LANDING_TARGETS.suppliers  * ease),
        products:   Math.floor(LANDING_TARGETS.products   * ease),
        orders:     Math.floor(LANDING_TARGETS.orders     * ease),
        warehouses: Math.floor(LANDING_TARGETS.warehouses * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: "🏭", title: "Supplier Management", desc: "Track and manage all your suppliers in one place — contacts, locations, and product relationships.", grad: "#6c3fd5,#e040c8" },
    { icon: "📦", title: "Product Catalog",      desc: "Maintain a rich product catalog with categories, pricing, and supplier linkages.",              grad: "#e040c8,#ff6b6b" },
    { icon: "🏗",  title: "Warehouse Control",   desc: "Monitor warehouse utilization, capacity, and stock levels across multiple locations.",          grad: "#4fd1c5,#6c3fd5" },
    { icon: "📋", title: "Inventory Tracking",   desc: "Real-time inventory visibility with low-stock alerts and warehouse-to-product mapping.",         grad: "#f6ad55,#e040c8" },
    { icon: "👥", title: "Customer Database",    desc: "Keep every customer's details, contacts, and order history organized and searchable.",          grad: "#6c3fd5,#4fd1c5" },
    { icon: "🛒", title: "Order Management",     desc: "Place, edit, and track orders seamlessly with live billing and customer linkage.",              grad: "#ff6b6b,#f6ad55" },
  ];

  const steps = [
    { num: "01", title: "Add Suppliers & Products",  desc: "Onboard your suppliers and build your product catalog with categories and pricing." },
    { num: "02", title: "Setup Warehouses & Stock",  desc: "Register your warehouses and map inventory to track utilization in real time." },
    { num: "03", title: "Register Customers",        desc: "Build your customer database and keep contact details organised." },
    { num: "04", title: "Manage Orders & Analytics", desc: "Place orders and watch the dashboard fill up with live charts and KPIs." },
  ];

  return (
    <div style={{ minHeight:"100vh", position:"relative", zIndex:1, overflowX:"hidden" }}>
      <nav style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"22px 60px", position:"sticky", top:0, zIndex:100, background:"rgba(10,0,21,0.6)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 0 24px rgba(108,63,213,0.55)" }}>⬡</div>
          <div style={{ fontFamily:"var(--font-head)", fontSize:22, fontWeight:700, letterSpacing:-0.5 }}>
            Chain<span style={{ background:"linear-gradient(135deg,#e040c8,#ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sync</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, color:"var(--muted)", letterSpacing:2 }}>SUPPLY CHAIN MANAGEMENT</span>
          <button className="btn-primary" onClick={onEnter} style={{ marginLeft:20, padding:"10px 24px", fontSize:14 }}>Sign In →</button>
        </div>
      </nav>

      <section style={{ textAlign:"center", padding:"110px 24px 80px", maxWidth:900, margin:"0 auto" }} className="fade-up">
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(108,63,213,0.18)", border:"1px solid rgba(108,63,213,0.4)", borderRadius:999, padding:"7px 20px", marginBottom:32, fontSize:12, color:"#b794f4", letterSpacing:1.5 }}>
          <span className="blink" style={{ color:"#4fd1c5" }}>●</span>
          LIVE SUPPLY CHAIN DASHBOARD
        </div>
        <h1 style={{ fontFamily:"var(--font-head)", fontSize:"clamp(42px, 7vw, 78px)", fontWeight:700, lineHeight:1.08, letterSpacing:-2, marginBottom:26 }}>
          Orchestrate Your
          <span style={{ display:"block", background:"linear-gradient(135deg,#6c3fd5 0%,#e040c8 50%,#ff6b6b 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}> Supply Chain</span>
          with Precision.
        </h1>
        <p style={{ fontSize:18, color:"var(--muted)", maxWidth:580, margin:"0 auto 44px", lineHeight:1.7 }}>
          ChainSync gives you a unified, real-time view of suppliers, products, warehouses, inventory, customers, and orders — all in one stunning dashboard.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={onEnter} style={{ padding:"14px 36px", fontSize:16, borderRadius:14, boxShadow:"0 0 40px rgba(108,63,213,0.5)" }}>Get Started Free →</button>
          <button className="btn-ghost" style={{ padding:"14px 28px", fontSize:15, borderRadius:14 }} onClick={() => document.getElementById('features-section').scrollIntoView({behavior:'smooth'})}>Explore Features</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, marginTop:72, background:"rgba(255,255,255,0.06)", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", overflow:"hidden" }}>
          {[
            { label:"Suppliers",  val: count.suppliers,  suffix:"+", sub:"Registered",  icon:"🏭", grad:"#6c3fd5,#e040c8" },
            { label:"Products",   val: count.products,   suffix:"+", sub:"In Catalog",  icon:"📦", grad:"#e040c8,#ff6b6b" },
            { label:"Orders",     val: count.orders,     suffix:"+", sub:"Processed",   icon:"🛒", grad:"#4fd1c5,#6c3fd5" },
            { label:"Warehouses", val: count.warehouses, suffix:"+", sub:"Locations",   icon:"🏗",  grad:"#f6ad55,#e040c8" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding:"28px 20px", textAlign:"center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontFamily:"var(--font-head)", fontSize:42, fontWeight:700, background:`linear-gradient(135deg,${s.grad})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>{s.val}{s.suffix}</div>
              <div style={{ fontSize:13, fontWeight:600, marginTop:8 }}>{s.label}</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:3, letterSpacing:0.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features-section" style={{ padding:"80px 60px", maxWidth:1200, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:11, color:"#b794f4", letterSpacing:3, marginBottom:14 }}>EVERYTHING YOU NEED</div>
          <h2 style={{ fontFamily:"var(--font-head)", fontSize:"clamp(28px,4vw,46px)", fontWeight:700 }}>Built for Modern Supply Chains</h2>
          <p style={{ color:"var(--muted)", marginTop:12, fontSize:15, maxWidth:500, margin:"12px auto 0" }}>Six powerful modules that cover every node in your supply chain.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {features.map((f, i) => (
            <div key={f.title} className="glass card-3d" style={{ padding:28, position:"relative", overflow:"hidden", animationDelay:`${i*0.07}s` }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${f.grad})`, borderRadius:"16px 16px 0 0" }} />
              <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${f.grad})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:16, boxShadow:`0 8px 24px ${f.grad.split(',')[0]}44` }}>{f.icon}</div>
              <div style={{ fontFamily:"var(--font-head)", fontSize:17, fontWeight:600, marginBottom:10 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:"80px 60px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div style={{ fontSize:11, color:"#b794f4", letterSpacing:3, marginBottom:14 }}>SIMPLE WORKFLOW</div>
          <h2 style={{ fontFamily:"var(--font-head)", fontSize:"clamp(28px,4vw,46px)", fontWeight:700 }}>Up and running in minutes</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18, position:"relative" }}>
          <div style={{ position:"absolute", top:36, left:"12.5%", right:"12.5%", height:1, background:"linear-gradient(90deg,#6c3fd5,#e040c8,#4fd1c5,#f6ad55)", opacity:0.3, zIndex:0 }} />
          {steps.map((s, i) => (
            <div key={s.num} className="glass" style={{ padding:24, position:"relative", zIndex:1, textAlign:"center" }}>
              <div style={{ width:52, height:52, margin:"0 auto 18px", borderRadius:"50%", background:`linear-gradient(135deg,${["#6c3fd5,#e040c8","#e040c8,#4fd1c5","#4fd1c5,#f6ad55","#f6ad55,#ff6b6b"][i]})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-head)", fontSize:15, fontWeight:700, boxShadow:`0 8px 24px rgba(108,63,213,0.35)` }}>{s.num}</div>
              <div style={{ fontFamily:"var(--font-head)", fontSize:15, fontWeight:600, marginBottom:10 }}>{s.title}</div>
              <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding:"60px 60px 100px", maxWidth:900, margin:"0 auto", textAlign:"center" }}>
        <div className="glass" style={{ padding:"60px 40px", borderRadius:28, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#6c3fd5,#e040c8,#ff6b6b,#4fd1c5)" }} />
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 0%, rgba(108,63,213,0.25) 0%, transparent 70%)", pointerEvents:"none" }} />
          <h2 style={{ fontFamily:"var(--font-head)", fontSize:"clamp(26px,4vw,44px)", fontWeight:700, marginBottom:16 }}>Ready to sync your chain?</h2>
          <p style={{ color:"var(--muted)", fontSize:15, marginBottom:36, maxWidth:480, margin:"0 auto 36px" }}>Log in with your credentials and experience the full power of end-to-end supply chain management.</p>
          <button className="btn-primary" onClick={onEnter} style={{ padding:"15px 44px", fontSize:17, borderRadius:16, boxShadow:"0 0 50px rgba(108,63,213,0.55)" }}>Launch Dashboard →</button>
          <div style={{ marginTop:18, fontSize:12, color:"var(--muted)" }}>Demo credentials: <span style={{ color:"#b794f4" }}>admin / admin123</span></div>
        </div>
      </section>

      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.07)", padding:"28px 60px", display:"flex", justifyContent:"space-between", alignItems:"center", color:"var(--muted)", fontSize:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⬡</div>
          <span style={{ fontFamily:"var(--font-head)", fontWeight:600 }}>Chain<span style={{ background:"linear-gradient(135deg,#e040c8,#ff6b6b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sync</span></span>
        </div>
        <div>© 2025 ChainSync · Supply Chain Management Platform</div>
      </footer>
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
  const lowStock = inv.filter(i => i.QuantityAvailable < 50);
  const pendingOrders = o.filter(x => x.Status === "Pending");

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

      {lowStock.length > 0 && (
        <div style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.35)', borderRadius:14, padding:'14px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:14 }} className="fade-up">
          <div style={{ fontSize:22 }}>⚠️</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:'#ff6b6b', marginBottom:3 }}>Low Stock Alert — {lowStock.length} item{lowStock.length>1?'s':''} running low</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{lowStock.map(i=>{const prod=p.find(x=>x.ProductID===i.ProductID); return `${prod?.ProductName||i.ProductID} (${i.QuantityAvailable} left)`;}).join(' · ')}</div>
          </div>
        </div>
      )}

      {pendingOrders.length > 0 && (
        <div style={{ background:'rgba(246,173,85,0.1)', border:'1px solid rgba(246,173,85,0.35)', borderRadius:14, padding:'14px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:14 }} className="fade-up">
          <div style={{ fontSize:22 }}>⏳</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:'#f6ad55', marginBottom:3 }}>Pending Requests — {pendingOrders.length} order{pendingOrders.length>1?'s':''} awaiting approval</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>Go to Orders page to accept or reject them.</div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Suppliers"   value={s.length} sub="registered"          gradient="#6c3fd5,#e040c8" icon="🏭" />
        <StatCard label="Products"    value={p.length} sub="in catalog"          gradient="#e040c8,#ff6b6b" icon="📦" />
        <StatCard label="Customers"   value={c.length} sub="registered"          gradient="#4fd1c5,#6c3fd5" icon="👥" />
        <StatCard label="Total Bills" value={`₹${(totalBill/1000).toFixed(0)}K`} sub="across all orders" gradient="#f6ad55,#e040c8" icon="💰" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <GlassCard gradient="#6c3fd5,#4fd1c5">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:18 }}>📊 Inventory Levels</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={invData} margin={{top:0,right:0,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" name="Quantity" radius={[6,6,0,0]}>
                {invData.map((_,i) => <Cell key={i} fill={i < lowStock.length && invData[i]?.qty < 50 ? '#ff6b6b' : pieColors[i%5]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

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

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
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

        <GlassCard gradient="#f6ad55,#ff6b6b">
          <div style={{ fontFamily:"var(--font-head)", fontWeight:600, fontSize:15, marginBottom:16 }}>🛒 Recent Orders</div>
          {o.slice().reverse().slice(0,5).map(x => (
            <div key={x.OrderID} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{x.OrderID}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{x.CustomerID} · {x.OrderDate}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <StatusBadge status={x.Status} />
                <span style={{ fontWeight:700, color:"#f6ad55", fontSize:14 }}>₹{parseFloat(x.Bill).toLocaleString()}</span>
              </div>
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
  const [delTarget, setDelTarget] = useState(null);

  const load = useCallback(() => { setLoading(true); apiFetch('/suppliers').then(d=>{setData(d);setLoading(false);}); },[]);
  useEffect(()=>{load();},[load]);

  const save = async () => {
    try {
      if (modal==="add") await apiPost('/suppliers', form);
      else await apiPut(`/suppliers/${form.SupplierID}`, form);
      showToast(modal==="add" ? `Supplier "${form.SupplierName}" added!` : `Supplier updated successfully.`);
      setModal(null); load();
    } catch { showToast('Failed to save supplier.', 'error'); }
  };
  const filtered = data.filter(s => s.SupplierName.toLowerCase().includes(search.toLowerCase()) || s.SupplierID.includes(search));
  const addBtn = <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Supplier</button>;

  return (
    <div className="fade-up">
      <PageHeader crumb="SUPPLIERS" title="Suppliers" sub={`${data.length} registered suppliers`} action={addBtn} />
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search by name or ID..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? (
        <GlassCard style={{ padding:0, overflow:'hidden' }}><table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>{[1,2,3].map(i=><SkeletonRow key={i}/>)}</tbody></table></GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard style={{ padding:0 }}>
          <EmptyState icon="🏭" title={search ? 'No suppliers match your search' : 'No suppliers yet'} sub={search ? 'Try a different keyword.' : 'Add your first supplier to get started.'} action={search ? null : ()=>{setForm(blank);setModal('add');}} actionLabel="+ Add Supplier" />
        </GlassCard>
      ) : (
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
                      <button className="btn-danger" onClick={()=>setDelTarget({id:s.SupplierID,name:s.SupplierName})} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
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
      {delTarget && (
        <Modal title="Confirm Delete" onClose={()=>setDelTarget(null)}>
          <div style={{ marginBottom:20 }}>
            <div style={{ color:'var(--muted)', fontSize:13, marginBottom:8 }}>You are about to permanently delete:</div>
            <div style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:10, padding:'10px 14px', fontSize:14, fontWeight:600 }}>{delTarget.name}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button className="btn-danger" onClick={async()=>{ try { await apiDel(`/suppliers/${delTarget.id}`); showToast(`"${delTarget.name}" deleted.`); } catch { showToast('Delete failed.','error'); } setDelTarget(null); load(); }}>Delete</button>
            <button className="btn-ghost" onClick={()=>setDelTarget(null)}>Cancel</button>
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

  const save = async () => {
    try {
      if (modal==="add") await apiPost('/products', form);
      else await apiPut(`/products/${form.ProductID}`, form);
      showToast(modal==="add" ? `Product "${form.ProductName}" added!` : `Product updated successfully.`);
      setModal(null); load();
    } catch { showToast('Failed to save product.', 'error'); }
  };

  const catGrad = { Machinery:"#6c3fd5,#4fd1c5", "Raw Materials":"#4fd1c5,#6c3fd5", Components:"#e040c8,#6c3fd5", Packaging:"#f6ad55,#e040c8" };
  const filtered = data.filter(p => p.ProductName.toLowerCase().includes(search.toLowerCase()));
  const addBtn = <button className="btn-primary" onClick={()=>{setForm({...blank,SupplierID:suppliers[0]?.SupplierID||""});setModal("add");}}>+ Add Product</button>;

  return (
    <div className="fade-up">
      <PageHeader crumb="PRODUCTS" title="Products" sub={`${data.length} products in catalog`} action={addBtn} />
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>{[1,2,3,4,5,6].map(i=><SkeletonCard key={i} h={180}/>)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" title={search ? 'No products match your search' : 'No products yet'} sub={search ? 'Try a different keyword.' : 'Add your first product to get started.'} action={search ? null : ()=>{setForm({...blank,SupplierID:suppliers[0]?.SupplierID||''});setModal('add');}} actionLabel="+ Add Product" />
      ) : (
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
                    <button className="btn-danger" onClick={async()=>{ try { await apiDel(`/products/${p.ProductID}`); showToast(`"${p.ProductName}" deleted.`); load(); } catch { showToast('Delete failed.','error'); }}} style={{ fontSize:12, padding:"5px 12px" }}>Del</button>
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

  const save = async () => {
    try {
      if (modal==="add") await apiPost('/warehouses', form);
      else await apiPut(`/warehouses/${form.WarehouseID}`, form);
      showToast(modal==="add" ? `Warehouse "${form.WarehouseName}" added!` : `Warehouse updated.`);
      setModal(null); load();
    } catch { showToast('Failed to save warehouse.', 'error'); }
  };
  const grads = ["#6c3fd5,#4fd1c5","#e040c8,#6c3fd5","#ff6b6b,#e040c8","#4fd1c5,#f6ad55"];
  const addBtn = <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Warehouse</button>;

  return (
    <div className="fade-up">
      <PageHeader crumb="WAREHOUSES" title="Warehouses" sub={`${data.length} storage locations`} action={addBtn} />
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>{[1,2,3,4].map(i=><SkeletonCard key={i} h={220}/>)}</div>
      ) : data.length === 0 ? (
        <EmptyState icon="🏗" title="No warehouses yet" sub="Add your first warehouse to start tracking stock locations." action={()=>{setForm(blank);setModal('add');}} actionLabel="+ Add Warehouse" />
      ) : (
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
  const [delTarget, setDelTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/inventory'), apiFetch('/products'), apiFetch('/warehouses')]).then(([i,p,w])=>{
      setData(i); setProducts(p); setWarehouses(w); setLoading(false);
    });
  },[]);
  useEffect(()=>{load();},[load]);

  const save = async () => {
    try {
      if (modal==="add") await apiPost('/inventory', form);
      else await apiPut(`/inventory/${form.InventoryID}`, form);
      showToast(modal==="add" ? 'Stock record added!' : 'Stock record updated.');
      setModal(null); load();
    } catch { showToast('Failed to save stock.', 'error'); }
  };
  const filtered = data.filter(i => {
    const p = products.find(x=>x.ProductID===i.ProductID);
    return p?.ProductName.toLowerCase().includes(search.toLowerCase()) || i.InventoryID.includes(search);
  });
  const addBtn = <button className="btn-primary" onClick={()=>{setForm({...blank,ProductID:products[0]?.ProductID||"",WarehouseID:warehouses[0]?.WarehouseID||""});setModal("add");}}>+ Add Stock</button>;

  return (
    <div className="fade-up">
      <PageHeader crumb="INVENTORY" title="Inventory" sub={`${data.length} stock records`} action={addBtn} />
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search inventory..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? (
        <GlassCard style={{ padding:0, overflow:"hidden" }}><table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>{[1,2,3].map(i=><SkeletonRow key={i}/>)}</tbody></table></GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard style={{ padding:0 }}><EmptyState icon="📋" title={search ? 'No records match your search' : 'No stock records yet'} sub={search ? 'Try a different keyword.' : 'Add your first stock entry.'} action={search ? null : ()=>{setForm({...blank,ProductID:products[0]?.ProductID||'',WarehouseID:warehouses[0]?.WarehouseID||''});setModal('add');}} actionLabel="+ Add Stock" /></GlassCard>
      ) : (
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
                        <button className="btn-danger" onClick={()=>setDelTarget({id:i.InventoryID,name:prod?.ProductName||i.InventoryID})} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
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
      {delTarget && (
        <Modal title="Confirm Delete" onClose={()=>setDelTarget(null)}>
          <div style={{ marginBottom:20 }}>
            <div style={{ color:'var(--muted)', fontSize:13, marginBottom:8 }}>You are about to remove this stock record:</div>
            <div style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:10, padding:'10px 14px', fontSize:14, fontWeight:600 }}>{delTarget.name}</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-danger" onClick={async()=>{ try { await apiDel(`/inventory/${delTarget.id}`); showToast('Stock record deleted.'); } catch { showToast('Delete failed.','error'); } setDelTarget(null); load(); }}>Delete</button>
            <button className="btn-ghost" onClick={()=>setDelTarget(null)}>Cancel</button>
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
  const [delTarget, setDelTarget] = useState(null);

  const load = useCallback(() => { setLoading(true); apiFetch('/customers').then(d=>{setData(d);setLoading(false);}); },[]);
  useEffect(()=>{load();},[load]);

  const save = async () => {
    try {
      if (modal==="add") await apiPost('/customers', form);
      else await apiPut(`/customers/${form.CustomerID}`, form);
      showToast(modal==="add" ? `Customer "${form.CustomerName}" added!` : `Customer updated.`);
      setModal(null); load();
    } catch { showToast('Failed to save customer.', 'error'); }
  };
  const filtered = data.filter(c => c.CustomerName.toLowerCase().includes(search.toLowerCase()));
  const grads = ["#6c3fd5,#e040c8","#e040c8,#4fd1c5","#4fd1c5,#f6ad55","#f6ad55,#6c3fd5","#ff6b6b,#e040c8"];
  const addBtn = <button className="btn-primary" onClick={()=>{setForm(blank);setModal("add");}}>+ Add Customer</button>;

  return (
    <div className="fade-up">
      <PageHeader crumb="CUSTOMERS" title="Customers" sub={`${data.length} registered customers`} action={addBtn} />
      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search customers..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>{[1,2,3,4,5,6].map(i=><SkeletonCard key={i} h={200}/>)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="👥" title={search ? 'No customers match your search' : 'No customers yet'} sub={search ? 'Try a different keyword.' : 'Add your first customer to start taking orders.'} action={search ? null : ()=>{setForm(blank);setModal('add');}} actionLabel="+ Add Customer" />
      ) : (
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
                  <button className="btn-danger" onClick={()=>setDelTarget({id:c.CustomerID,name:c.CustomerName})} style={{ fontSize:12, padding:"5px 12px" }}>Del</button>
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
      {delTarget && (
        <Modal title="Confirm Delete" onClose={()=>setDelTarget(null)}>
          <div style={{ marginBottom:20 }}>
            <div style={{ color:'var(--muted)', fontSize:13, marginBottom:8 }}>You are about to permanently remove:</div>
            <div style={{ background:'rgba(255,107,107,0.08)', border:'1px solid rgba(255,107,107,0.2)', borderRadius:10, padding:'10px 14px', fontSize:14, fontWeight:600 }}>{delTarget.name}</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn-danger" onClick={async()=>{ try { await apiDel(`/customers/${delTarget.id}`); showToast(`"${delTarget.name}" deleted.`); } catch { showToast('Delete failed.','error'); } setDelTarget(null); load(); }}>Delete</button>
            <button className="btn-ghost" onClick={()=>setDelTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ══ ORDERS ════════════════════════════════════════════════════════════════════
const Orders = () => {
  const [data, setData]         = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([apiFetch('/orders'), apiFetch('/customers'), apiFetch('/products')]).then(([o,c,p])=>{
      setData(o); setCustomers(c); setProducts(p); setLoading(false);
    });
  },[]);
  useEffect(()=>{load();},[load]);


  const save = async () => {
    try {
      if (modal==="add") await apiPost('/orders', {...form, Status: form.Status||"Accepted"});
      else await apiPut(`/orders/${form.OrderID}`, {...form, Status: form.Status||"Accepted"});
      showToast(modal==="add" ? `Order "${form.OrderID}" placed!` : `Order updated.`);
      setModal(null); load();
    } catch { showToast('Failed to save order.', 'error'); }
  };

  const updateStatus = async (oid, status) => {
    const order = data.find(o => o.OrderID === oid);
    await apiPut(`/orders/${oid}`, {...order, Status: status});
    showToast(`Order ${oid} ${status}!`);
    load();
  };

  const filtered = data.filter(o => {
    const c = customers.find(x=>x.CustomerID===o.CustomerID);
    const matchSearch = c?.CustomerName.toLowerCase().includes(search.toLowerCase()) || o.OrderID.includes(search);
    const matchStatus = statusFilter === "All" || (o.Status||"Accepted") === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = data.filter(o => o.Status === "Pending").length;

  return (
    <div className="fade-up">
      <PageHeader crumb="ORDERS" title="Orders" sub={`${data.length} total orders${pendingCount > 0 ? ` · ${pendingCount} pending` : ''}`} action={null} />

      {/* Status filter tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["All","Accepted","Pending","Rejected"].map(f => (
          <button key={f} onClick={()=>setStatusFilter(f)}
            className={statusFilter===f ? "btn-primary" : "btn-ghost"}
            style={{ padding:"7px 16px", fontSize:13 }}>
            {f}
            {f==="Pending" && pendingCount > 0 && <span style={{ marginLeft:6, background:"rgba(255,107,107,0.3)", borderRadius:10, padding:"1px 6px", fontSize:11 }}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      <GlassCard style={{ marginBottom:16, padding:16 }}>
        <GlassInput placeholder="🔍  Search by customer or order ID..." value={search} onChange={e=>setSearch(e.target.value)} />
      </GlassCard>

      {loading ? (
        <GlassCard style={{ padding:0, overflow:"hidden" }}><table style={{ width:'100%', borderCollapse:'collapse' }}><tbody>{[1,2,3].map(i=><SkeletonRow key={i}/>)}</tbody></table></GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard style={{ padding:0 }}><EmptyState icon="🛒" title={search ? 'No orders match your search' : 'No orders yet'} sub={search ? 'Try a different keyword.' : 'Orders placed by customers will appear here.'} action={null} /></GlassCard>
      ) : (
        <GlassCard style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <TableHeader cols={["OrderID","Date","Bill","Customer","Product","Status","Actions"]} />
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
                      <StatusBadge status={o.Status} />
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      {(o.Status === "Pending" || !o.Status) ? (
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>updateStatus(o.OrderID,"Accepted")} style={{ background:"rgba(79,209,197,0.15)", border:"1px solid rgba(79,209,197,0.3)", color:"#4fd1c5", cursor:"pointer", borderRadius:8, fontSize:12, padding:"5px 10px", fontFamily:"var(--font-body)" }}>✓ Accept</button>
                          <button onClick={()=>updateStatus(o.OrderID,"Rejected")} className="btn-danger" style={{ padding:"5px 10px", fontSize:12 }}>✗ Reject</button>
                        </div>
                      ) : (
                        <div style={{ display:"flex", gap:8 }}>
                          <button className="btn-ghost" onClick={()=>{setForm({...o});setModal("edit");}} style={{ padding:"5px 12px", fontSize:12 }}>Edit</button>
                          <button className="btn-danger" onClick={async()=>{await apiDel(`/orders/${o.OrderID}`);load();}} style={{ padding:"5px 12px", fontSize:12 }}>Del</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}

      {modal && (
        <Modal title="Edit Order" onClose={()=>setModal(null)}>
          <div style={{ display:"grid", gap:14 }}>
            <div><Label>CUSTOMER</Label>
              <GlassSelect value={form.CustomerID} onChange={e=>setForm({...form,CustomerID:e.target.value})} style={{width:"100%"}}>
                {customers.map(c=><option key={c.CustomerID} value={c.CustomerID}>{c.CustomerName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>PRODUCT</Label>
              <GlassSelect value={form.ProductID} onChange={e=>{
                const pid=e.target.value;
                const prod=products.find(p=>p.ProductID===pid);
                setForm({...form,ProductID:pid,Bill:prod?Math.round(parseFloat(prod.UnitPrice)):form.Bill});
              }} style={{width:"100%"}}>
                {products.map(p=><option key={p.ProductID} value={p.ProductID}>{p.ProductName}</option>)}
              </GlassSelect>
            </div>
            <div><Label>ORDER DATE</Label><GlassInput type="date" value={form.OrderDate||""} onChange={e=>setForm({...form,OrderDate:e.target.value})} /></div>
            <div><Label>BILL (₹)</Label><GlassInput type="number" value={form.Bill||0} onChange={e=>setForm({...form,Bill:+e.target.value})} /></div>
            <div><Label>STATUS</Label>
              <GlassSelect value={form.Status||"Accepted"} onChange={e=>setForm({...form,Status:e.target.value})} style={{width:"100%"}}>
                <option value="Accepted">Accepted</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </GlassSelect>
            </div>
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

// ══ REPORTS ═══════════════════════════════════════════════════════════════════
const Reports = () => {
  const [data, setData] = useState({ o:[], c:[], p:[], inv:[], wh:[] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([apiFetch('/orders'),apiFetch('/customers'),apiFetch('/products'),apiFetch('/inventory'),apiFetch('/warehouses')])
      .then(([o,c,p,inv,wh]) => { setData({o,c,p,inv,wh}); setLoading(false); });
  }, []);
  if (loading) return <Spinner />;
  const { o, c, p, inv, wh } = data;
  const PC = ["#6c3fd5","#e040c8","#4fd1c5","#f6ad55","#ff6b6b","#a78bfa"];
  const revByCust = c.map(cu=>({name:cu.CustomerName.split(' ')[0],revenue:o.filter(x=>x.CustomerID===cu.CustomerID).reduce((a,x)=>a+parseFloat(x.Bill),0)})).filter(x=>x.revenue>0).sort((a,b)=>b.revenue-a.revenue);
  const ordByProd = p.map(pr=>({name:pr.ProductName.split(' ').slice(0,2).join(' '),orders:o.filter(x=>x.ProductID===pr.ProductID).length})).filter(x=>x.orders>0).sort((a,b)=>b.orders-a.orders);
  const stockByWh = wh.map(w=>({name:w.WarehouseName.split(' ')[0],stock:inv.filter(i=>i.WarehouseID===w.WarehouseID).reduce((a,i)=>a+i.QuantityAvailable,0),capacity:w.Capacity}));
  const catMap={};
  o.forEach(order=>{const prod=p.find(x=>x.ProductID===order.ProductID);if(prod){catMap[prod.Category]=(catMap[prod.Category]||0)+parseFloat(order.Bill);}});
  const revByCat=Object.entries(catMap).map(([name,value])=>({name,value:Math.round(value)}));
  const ChartBox=({title,query,children})=>(
    <GlassCard style={{marginBottom:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18,flexWrap:'wrap',gap:10}}>
        <div style={{fontFamily:'var(--font-head)',fontWeight:600,fontSize:16}}>{title}</div>
        <div style={{background:'rgba(108,63,213,0.12)',border:'1px solid rgba(108,63,213,0.25)',borderRadius:8,padding:'5px 12px',fontSize:10,color:'#b794f4',fontFamily:'monospace',maxWidth:'56%',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{query}</div>
      </div>
      {children}
    </GlassCard>
  );
  return (
    <div className="fade-up">
      <PageHeader crumb="REPORTS" title="Reports & Analytics" sub="SQL-aggregated insights from live data — JOINs, GROUP BY, aggregates" />
      <ChartBox title="💰 Total Revenue per Customer" query="SELECT c.CustomerName, SUM(o.Bill) AS Revenue FROM customer c JOIN orders o ON c.CustomerID=o.CustomerID GROUP BY c.CustomerName ORDER BY Revenue DESC">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revByCust} margin={{top:0,right:0,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="revenue" name="Revenue" radius={[8,8,0,0]}>{revByCust.map((_,i)=><Cell key={i} fill={PC[i%6]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
      <ChartBox title="📦 Orders per Product (Most Ordered)" query="SELECT p.ProductName, COUNT(o.OrderID) AS OrderCount FROM product p JOIN orders o ON p.ProductID=o.ProductID GROUP BY p.ProductName ORDER BY OrderCount DESC">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordByProd} margin={{top:0,right:0,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="orders" name="Orders" radius={[8,8,0,0]}>{ordByProd.map((_,i)=><Cell key={i} fill={PC[(i+2)%6]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <ChartBox title="🏗 Stock per Warehouse" query="SELECT w.WarehouseName, SUM(i.QuantityAvailable) TotalStock FROM warehouse w JOIN inventory i ON w.WarehouseID=i.WarehouseID GROUP BY w.WarehouseName">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockByWh} margin={{top:0,right:0,left:-15,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="stock" name="Stock" fill="#4fd1c5" radius={[6,6,0,0]}/>
              <Bar dataKey="capacity" name="Capacity" fill="rgba(108,63,213,0.35)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="🏷 Revenue by Category" query="SELECT p.Category, SUM(o.Bill) Revenue FROM product p JOIN orders o ON p.ProductID=o.ProductID GROUP BY p.Category">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={revByCat} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" animationBegin={0} animationDuration={900}>
              {revByCat.map((_,i)=><Cell key={i} fill={PC[i%6]} stroke="none"/>)}
            </Pie><Tooltip content={<CustomTooltip/>}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',justifyContent:'center',marginTop:6}}>
            {revByCat.map((d,i)=>(<div key={d.name} style={{display:'flex',alignItems:'center',gap:5}}><div style={{width:8,height:8,borderRadius:'50%',background:PC[i%6]}}/><span style={{fontSize:11,color:'var(--muted)'}}>{d.name}</span></div>))}
          </div>
        </ChartBox>
      </div>
    </div>
  );
};

// ══ SQL QUERIES PAGE ══════════════════════════════════════════════════════════
const SQL_QUERIES = [
  {title:"Top Customers by Revenue",type:"JOIN + GROUP BY + ORDER BY",grad:"#6c3fd5,#e040c8",desc:"Finds total spending per customer by joining orders and customer tables, then grouping and sorting.",
   sql:`SELECT c.CustomerName, c.ContactNumber,\n       SUM(o.Bill)      AS TotalRevenue,\n       COUNT(o.OrderID) AS TotalOrders\nFROM customer c\nJOIN orders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.CustomerName, c.ContactNumber\nORDER BY TotalRevenue DESC;`},
  {title:"Most Ordered Product",type:"JOIN + GROUP BY + COUNT",grad:"#e040c8,#ff6b6b",desc:"Counts how many times each product was ordered, revealing bestsellers.",
   sql:`SELECT p.ProductName, p.Category, p.UnitPrice,\n       COUNT(o.OrderID) AS TimesOrdered\nFROM product p\nJOIN orders o ON p.ProductID = o.ProductID\nGROUP BY p.ProductID, p.ProductName, p.Category, p.UnitPrice\nORDER BY TimesOrdered DESC;`},
  {title:"Warehouse Stock vs Capacity",type:"JOIN + SUM + Aggregate",grad:"#4fd1c5,#6c3fd5",desc:"Calculates utilization % for each warehouse by aggregating stock held vs full capacity.",
   sql:`SELECT w.WarehouseName, w.Location, w.Capacity,\n       SUM(i.QuantityAvailable)                          AS TotalStock,\n       ROUND(SUM(i.QuantityAvailable)*100.0/w.Capacity,1) AS UtilizationPct\nFROM warehouse w\nJOIN inventory i ON w.WarehouseID = i.WarehouseID\nGROUP BY w.WarehouseID, w.WarehouseName, w.Location, w.Capacity\nORDER BY UtilizationPct DESC;`},
  {title:"Low Stock Alert",type:"JOIN + WHERE Filter",grad:"#ff6b6b,#f6ad55",desc:"Identifies inventory items running critically low by filtering on a quantity threshold.",
   sql:`SELECT p.ProductName, p.Category,\n       i.QuantityAvailable,\n       w.WarehouseName\nFROM inventory i\nJOIN product   p ON i.ProductID   = p.ProductID\nJOIN warehouse w ON i.WarehouseID = w.WarehouseID\nWHERE i.QuantityAvailable < 50\nORDER BY i.QuantityAvailable ASC;`},
  {title:"Pending Orders",type:"WHERE Filter",grad:"#f6ad55,#e040c8",desc:"Finds all orders that are still pending approval from the admin.",
   sql:`SELECT o.OrderID, o.OrderDate, o.Bill,\n       c.CustomerName,\n       p.ProductName\nFROM orders o\nJOIN customer c ON o.CustomerID = c.CustomerID\nJOIN product  p ON o.ProductID  = p.ProductID\nWHERE o.Status = 'Pending'\nORDER BY o.OrderDate DESC;`},
  {title:"Full Supply Chain Trace",type:"4-Table JOIN",grad:"#6c3fd5,#4fd1c5",desc:"Traces an order end-to-end: customer → product → supplier across four tables.",
   sql:`SELECT o.OrderID, o.OrderDate, o.Bill, o.Status,\n       c.CustomerName,\n       p.ProductName, p.Category,\n       s.SupplierName\nFROM orders o\nJOIN customer c ON o.CustomerID = c.CustomerID\nJOIN product  p ON o.ProductID  = p.ProductID\nJOIN supplier s ON p.SupplierID = s.SupplierID\nORDER BY o.OrderDate DESC;`},
];
const KW=['SELECT','FROM','JOIN','ON','WHERE','GROUP BY','ORDER BY','HAVING','COUNT','SUM','AVG','MAX','MIN','ROUND','AS','AND','OR','LEFT','INNER','DESC','ASC','LIMIT'];
const SQLLine=({line})=>{
  const tokens=[];let rem=line;
  while(rem.length){
    let hit=false;
    for(const k of [...KW].sort((a,b)=>b.length-a.length)){
      if(rem.startsWith(k)&&(rem.length===k.length||!/\w/.test(rem[k.length]||''))){
        tokens.push(<span key={tokens.length} style={{color:'#e040c8',fontWeight:700}}>{k}</span>);
        rem=rem.slice(k.length);hit=true;break;
      }
    }
    if(!hit){const sp=rem.indexOf(' ');const end=sp===-1?rem.length:sp+1;tokens.push(<span key={tokens.length} style={{color:'#94a3b8'}}>{rem.slice(0,end)}</span>);rem=rem.slice(end);}
  }
  return <>{tokens}</>;
};
const SQLQueries=()=>(
  <div className="fade-up">
    <PageHeader crumb="SQL QUERIES" title="SQL Query Showcase" sub={`${SQL_QUERIES.length} key queries — JOINs, GROUP BY, aggregates, multi-table joins`}/>
    {SQL_QUERIES.map(q=>(
      <div key={q.title} className="glass" style={{padding:28,marginBottom:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${q.grad})`,borderRadius:'16px 16px 0 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14,flexWrap:'wrap',gap:10}}>
          <div>
            <div style={{fontFamily:'var(--font-head)',fontSize:17,fontWeight:700,marginBottom:4}}>{q.title}</div>
            <div style={{fontSize:12,color:'var(--muted)',maxWidth:480}}>{q.desc}</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,padding:'5px 14px',fontSize:11,color:'#b794f4',fontWeight:600,whiteSpace:'nowrap'}}>{q.type}</div>
        </div>
        <div style={{background:'rgba(0,0,0,0.38)',borderRadius:12,padding:'18px 22px',border:'1px solid rgba(255,255,255,0.08)',overflowX:'auto'}}>
          <pre style={{fontFamily:`'JetBrains Mono','Fira Mono',monospace`,fontSize:13,lineHeight:1.75,margin:0,whiteSpace:'pre'}}>
            {q.sql.split('\n').map((line,li)=>(<span key={li}><SQLLine line={line}/>{"\n"}</span>))}
          </pre>
        </div>
      </div>
    ))}
  </div>
);

// ══ APP ═══════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard", icon:"◈",  label:"Dashboard"  },
  { id:"suppliers", icon:"🏭", label:"Suppliers"  },
  { id:"products",  icon:"📦", label:"Products"   },
  { id:"warehouses",icon:"🏗", label:"Warehouses" },
  { id:"inventory", icon:"📋", label:"Inventory"  },
  { id:"customers", icon:"👥", label:"Customers"  },
  { id:"orders",    icon:"🛒", label:"Orders"     },
  { id:"reports",   icon:"📈", label:"Reports"    },
  { id:"sql",       icon:"🗃", label:"SQL Queries"},
];
const PAGES = { dashboard:Dashboard, suppliers:Suppliers, products:Products, warehouses:Warehouses, inventory:Inventory, customers:Customers, orders:Orders, reports:Reports, sql:SQLQueries };

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [page, setPage]     = useState("dashboard");
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (screen === "app") {
      apiFetch('/orders').then(orders => {
        setPendingCount(orders.filter(o => o.Status === "Pending").length);
      });
    }
  }, [screen, page]);

  const Bg = () => <><div className="mesh-bg"/><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></>;
  if (screen === "landing") return <><Bg/><LandingPage onEnter={() => setScreen("login")}/></>;
  if (screen === "login")   return <><Bg/><LoginPage   onLogin={() => setScreen("app")}/></>;
  const Page = PAGES[page];
  return (
    <>
      <ToastContainer />
      <Bg/>
      <div style={{ display:"flex", minHeight:"100vh", position:"relative", zIndex:1 }}>
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
                <span style={{ fontSize:16 }}>{n.icon}</span>
                <span>{n.label}</span>
                {n.id === "orders" && pendingCount > 0 && (
                  <span style={{ marginLeft:"auto", background:"#ef4444", borderRadius:10, padding:"1px 7px", fontSize:11, color:"#fff" }}>{pendingCount}</span>
                )}
                {page===n.id && n.id !== "orders" && <span style={{ marginLeft:"auto", background:"linear-gradient(135deg,#6c3fd5,#e040c8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:700 }}>›</span>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"16px 18px", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#6c3fd5,#e040c8)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>👤</div>
            <div><div style={{ fontSize:14, fontWeight:600 }}>Admin</div><div style={{ fontSize:10, color:"var(--muted)" }}>admin@chainsync.in</div></div>
            <button onClick={()=>setScreen("landing")} style={{ marginLeft:"auto", background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.2)", color:"#ff6b6b", cursor:"pointer", borderRadius:8, width:30, height:30, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>⏻</button>
          </div>
        </div>
        <div style={{ marginLeft:230, flex:1, padding:36, maxWidth:"calc(100vw - 230px)", minHeight:"100vh" }}>
          <Page key={page}/>
        </div>
      </div>
    </>
  );
}
