import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#08090F", card: "#0F1117", cardHover: "#161820", border: "#1C1F2E",
  cobalt: "#2563EB", cobaltBright: "#3B82F6", cobaltGlow: "rgba(59,130,246,0.12)",
  neonCyan: "#06B6D4", neonPink: "#EC4899", amber: "#F59E0B", green: "#10B981",
  breaking: "#EF4444", textPrimary: "#F1F5F9", textSecondary: "#94A3B8", textMuted: "#3D4560",
};
const C_LIGHT = {
  bg: "#F8FAFC", card: "#FFFFFF", cardHover: "#F1F5F9", border: "#E2E8F0",
  cobalt: "#2563EB", cobaltBright: "#3B82F6", cobaltGlow: "rgba(59,130,246,0.08)",
  neonCyan: "#0891B2", neonPink: "#DB2777", amber: "#D97706", green: "#059669",
  breaking: "#DC2626", textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
};

const ADMIN_PASSWORD = "cliknews2026";

const CATEGORIES = [
  { id: "all",       label: "Όλα",                icon: "⚡",  color: "#ffffff"  },
  { id: "breaking",  label: "Breaking",            icon: "🔥",  color: "#EF4444"  },
  { id: "trending",  label: "Trending",            icon: "📈",  color: "#10B981"  },
  { id: "viral",     label: "Viral",               icon: "😂",  color: "#F59E0B"  },
  { id: "lifestyle", label: "Lifestyle",           icon: "🎯",  color: "#EC4899"  },
  { id: "sports",    label: "Αθλητικά",            icon: "⚽",  color: "#F97316"  },
  { id: "world",     label: "Κόσμος",              icon: "🌍",  color: "#06B6D4"  },
  { id: "nightlife", label: "Nightlife Greece",    icon: "🌙",  color: "#A78BFA"  },
  { id: "tourism",   label: "Τουρισμός",           icon: "✈️",  color: "#34D399"  },
  { id: "music",     label: "Μουσική Βιομηχανία",  icon: "🎵",  color: "#F472B6"  },
  { id: "health",    label: "Gym & Health",         icon: "💪",  color: "#4ADE80"  },
  { id: "auto",      label: "Αυτοκίνητο",          icon: "🚗",  color: "#60A5FA"  },
  { id: "beauty",    label: "Ομορφιά & Tips",      icon: "💅",  color: "#F9A8D4"  },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram",   icon: "📸", tone: "visual, engaging, με emojis, max 150 λέξεις, τελειώνει με 5 hashtags" },
  { id: "facebook",  label: "Facebook",    icon: "👥", tone: "πληροφοριακό, φιλικό, λίγο πιο αναλυτικό, max 80 λέξεις, 3 hashtags" },
  { id: "tiktok",    label: "TikTok",      icon: "🎵", tone: "πολύ σύντομο, viral, hook στην πρώτη γραμμή, max 50 λέξεις, trending hashtags" },
  { id: "twitter",   label: "X / Twitter", icon: "𝕏",  tone: "άμεσο, έντονο, max 280 χαρακτήρες, 2 hashtags" },
  { id: "threads",   label: "Threads",     icon: "🧵", tone: "conversational, σαν να μιλάς σε φίλο, max 100 λέξεις, χωρίς πολλά hashtags" },
];

const MOCK_NEWS = [
  { id: 1,  title: "Σεισμός 6.8 Ρίχτερ στη Βενεζουέλα — Δεκάδες αγνοούμενοι", summary: "Ισχυρός σεισμός έπληξε τα βόρεια παράλια. Κατάσταση έκτακτης ανάγκης σε τρεις πολιτείες.", time: "4 λεπτά",  category: "breaking",  hot: 98, source: "Protothema", url: "https://www.protothema.gr" },
  { id: 2,  title: "Καύσωνας: 42°C αύριο στην Αττική — Έκτακτο δελτίο ΕΜΥ", summary: "Η ΕΜΥ εξέδωσε έκτακτο δελτίο. Αποφύγετε έκθεση στον ήλιο 11:00–17:00.", time: "11 λεπτά", category: "breaking",  hot: 95, source: "Kathimerini", url: "https://www.kathimerini.gr" },
  { id: 3,  title: "Έλληνας creator: 50 εκατ. views σε 48 ώρες στο TikTok", summary: "Βίντεο Έλληνα δημιουργού έσπασε κάθε ρεκόρ και τράβηξε διεθνή προσοχή.", time: "23 λεπτά", category: "viral",     hot: 99, source: "in.gr", url: "https://www.in.gr" },
  { id: 4,  title: "Ολυμπιακός: Ισπανός τεχνικός — Επίσημη ανακοίνωση", summary: "Η ΠΑΕ Ολυμπιακός επιβεβαίωσε την απόκτηση Ισπανού τεχνικού με στόχο Ευρώπη.", time: "35 λεπτά", category: "sports",    hot: 87, source: "Gazzetta", url: "https://www.gazzetta.gr" },
  { id: 5,  title: "Taylor Swift: Νέο album — Ρεκόρ pre-orders σε 24 ώρες", summary: "18 tracks, release Σεπτέμβριο. Ήδη σπάει κάθε ρεκόρ στις προ-παραγγελίες.", time: "1 ώρα",    category: "trending",  hot: 93, source: "pes.gr", url: "https://www.pes.gr" },
  { id: 6,  title: "Μύκονος & Σαντορίνη: Τι αλλάζει φέτος για τους επισκέπτες", summary: "Νέοι κανόνες, περιορισμοί επισκεπτών — τι να ξέρεις πριν ταξιδέψεις.", time: "1 ώρα",    category: "tourism",   hot: 82, source: "Newsbeast", url: "https://www.newsbeast.gr" },
  { id: 7,  title: "Αθήνα Nightlife: Τα 10 καλύτερα clubs του καλοκαιριού 2026", summary: "Ο πλήρης οδηγός για τα hot spots της αθηναϊκής νύχτας — Γκάζι, Ριβιέρα και νέες αφίξεις.", time: "2 ώρες",   category: "nightlife", hot: 85, source: "Newsbeast", url: "https://www.newsbeast.gr" },
  { id: 8,  title: "Spotify αλλάζει πληρωμές καλλιτεχνών — Τι σημαίνει για την ελληνική δισκογραφία", summary: "Νέο μοντέλο αποζημίωσης που επηρεάζει εκατομμύρια ανεξάρτητους καλλιτέχνες.", time: "3 ώρες",   category: "music",     hot: 75, source: "pes.gr", url: "https://www.pes.gr" },
  { id: 9,  title: "G7: Νέες κυρώσεις κατά Ρωσίας — Αντιδράσεις Μόσχας", summary: "Νέο πακέτο κυρώσεων από τους G7, εστιάζοντας στον ενεργειακό τομέα.", time: "3 ώρες",   category: "world",     hot: 71, source: "Kathimerini", url: "https://www.kathimerini.gr" },
  { id: 10, title: "Το viral πρωινό που όλοι τρώνε φέτος το καλοκαίρι", summary: "Τάση που σαρώνει το TikTok και έχει γίνει η νέα συνήθεια του ελληνικού καλοκαιριού.", time: "4 ώρες",   category: "lifestyle", hot: 88, source: "in2life", url: "https://www.in2life.gr" },
  { id: 11, title: "Grammy 2027: Beyoncé vs Kendrick — 9 υποψηφιότητες ο καθένας", summary: "Η Recording Academy ανακοίνωσε τις υποψηφιότητες. Επική σύγκρουση για το βραβείο χρονιάς.", time: "5 ώρες",   category: "trending",  hot: 90, source: "pes.gr", url: "https://www.pes.gr" },
  { id: 12, title: "5 τροφές που καίνε λίπος πιο αποτελεσματικά από τη γυμναστική", summary: "Νέα έρευνα αποκαλύπτει ποιες τροφές επιταχύνουν τον μεταβολισμό.", time: "5 ώρες",   category: "health",    hot: 86, source: "vita.gr", url: "https://www.vita.gr" },
  { id: 13, title: "Πλημμύρες Βραζιλία: 80.000 άστεγοι — Εικόνες σοκ", summary: "Καταστροφικές πλημμύρες στη νότια Βραζιλία. Διεθνής βοήθεια σπεύδει στην περιοχή.", time: "6 ώρες",   category: "world",     hot: 80, source: "iefimerida", url: "https://www.iefimerida.gr" },
  { id: 14, title: "Yoga vs Pilates: Τι να διαλέξεις ανάλογα με τον στόχο σου", summary: "Αναλυτικός οδηγός από ειδικούς για το ποια άσκηση ταιριάζει στον κάθε τύπο σώματος.", time: "7 ώρες",   category: "health",    hot: 72, source: "iatronet", url: "https://www.iatronet.gr" },
  { id: 15, title: "Ρεκόρ τουριστών στην Ελλάδα — 35 εκατ. το 2026", summary: "Η Ελλάδα έχει ήδη σπάσει το ρεκόρ αφίξεων του 2025 με μήνες μπροστά.", time: "8 ώρες",   category: "tourism",   hot: 78, source: "Newsbeast", url: "https://www.newsbeast.gr" },
  { id: 16, title: "BMW M5 vs Mercedes AMG E63: Η μεγάλη δοκιμή του 2026", summary: "Συγκριτική δοκιμή των δύο κορυφαίων sport sedan στην πίστα του Σαλαμίνας.", time: "9 ώρες",   category: "auto",      hot: 77, source: "Gazzetta", url: "https://www.gazzetta.gr" },
  { id: 17, title: "10 beauty hacks που κάνουν viral τις Ελληνίδες στο TikTok", summary: "Από SPF routines ως μεσογειακά συστατικά — τα μυστικά που όλες μοιράζονται.", time: "10 ώρες",  category: "beauty",    hot: 83, source: "in2life", url: "https://www.in2life.gr" },
];

const OWN_INIT = [
  { id: 101, title: "Exclusive: Μεγάλος Έλληνας καλλιτέχνης ετοιμάζει comeback", summary: "Αποκλειστικές πληροφορίες για την επιστροφή του πιο αγαπημένου καλλιτέχνη της γενιάς μας.", time: "Σήμερα 09:00", category: "music", own: true, hot: 91, source: "ClikNews", url: "#" },
];

const BANNERS = [
  { label: "Διαφήμιση", sub: "Your Ad Here", color1: "#2563EB", color2: "#06B6D4", url: "#" },
  { label: "Διαφήμιση", sub: "Your Ad Here", color1: "#7C3AED", color2: "#EC4899", url: "#" },
  { label: "Διαφήμιση", sub: "Your Ad Here", color1: "#10B981", color2: "#84CC16", url: "#" },
];

function getCat(id) { return CATEGORIES.find(c => c.id === id) || CATEGORIES[0]; }

async function generateCaption(item, platform) {
  const p = PLATFORMS.find(x => x.id === platform);
  const cat = getCat(item.category);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000,
      messages: [{ role: "user", content: `Είσαι social media manager με 3 εκατομμύρια followers στην Ελλάδα.\nΓράψε ένα post για ${p.label}.\nΎφος: ${p.tone}.\nΓράψε ΜΟΝΟ το κείμενο, στα Ελληνικά, χωρίς επεξηγήσεις.\nΚατηγορία: ${cat.icon} ${cat.label}\nΤίτλος: ${item.title}\nΠερίληψη: ${item.summary}` }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Σφάλμα. Δοκίμασε ξανά.";
}

function HotMeter({ value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 44, height: 3, background: "#1C1F2E", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.04em" }}>{value}</span>
    </div>
  );
}

function ShareMenu({ item, color, onClose }) {
  const txt = encodeURIComponent(`${item.title} — ${item.url}`);
  const links = [
    { label: "Facebook", icon: "👥", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.url)}` },
    { label: "X/Twitter", icon: "𝕏", url: `https://twitter.com/intent/tweet?text=${txt}` },
    { label: "WhatsApp", icon: "💬", url: `https://wa.me/?text=${txt}` },
    { label: "Copy link", icon: "🔗", url: null },
  ];
  return (
    <div style={{ position: "absolute", right: 0, bottom: "110%", background: "#0F1117", border: `1px solid ${color}44`, borderRadius: 10, padding: 8, zIndex: 50, minWidth: 150, boxShadow: "0 -8px 32px rgba(0,0,0,0.5)" }}>
      {links.map(l => (
        <div key={l.label} onClick={() => { if (l.url) window.open(l.url, "_blank"); else { navigator.clipboard.writeText(item.url); } onClose(); }}
          style={{ padding: "7px 12px", fontSize: 12, fontWeight: 600, color: "#F1F5F9", cursor: "pointer", borderRadius: 7, display: "flex", alignItems: "center", gap: 8, transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = color + "22"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          {l.icon} {l.label}
        </div>
      ))}
    </div>
  );
}

function FeaturedCard({ item, onConvert, darkMode }) {
  const cat = getCat(item.category);
  const [showShare, setShowShare] = useState(false);
  const gradients = {
    breaking: "linear-gradient(135deg,#1a0000 0%,#7f1d1d 60%,#08090F 100%)",
    trending: "linear-gradient(135deg,#052e16 0%,#14532d 60%,#08090F 100%)",
    viral:    "linear-gradient(135deg,#1c1203 0%,#78350f 60%,#08090F 100%)",
    lifestyle:"linear-gradient(135deg,#2d0a1f 0%,#831843 60%,#08090F 100%)",
    sports:   "linear-gradient(135deg,#1a0a00 0%,#7c2d12 60%,#08090F 100%)",
    world:    "linear-gradient(135deg,#042f2e 0%,#134e4a 60%,#08090F 100%)",
    nightlife:"linear-gradient(135deg,#1e1040 0%,#3b0764 60%,#08090F 100%)",
    tourism:  "linear-gradient(135deg,#042f2e 0%,#065f46 60%,#08090F 100%)",
    music:    "linear-gradient(135deg,#2d0a1f 0%,#9d174d 60%,#08090F 100%)",
    health:   "linear-gradient(135deg,#052e16 0%,#166534 60%,#08090F 100%)",
    auto:     "linear-gradient(135deg,#0a1628 0%,#1e3a5f 60%,#08090F 100%)",
    beauty:   "linear-gradient(135deg,#2d0a1f 0%,#9d174d 60%,#08090F 100%)",
  };
  return (
    <div style={{ background: gradients[item.category] || gradients.breaking, borderRadius: 20, border: `1px solid ${cat.color}33`, padding: "32px 28px", position: "relative", overflow: "hidden", boxShadow: `0 0 80px ${cat.color}15`, marginBottom: 14 }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: cat.color, opacity: 0.07, filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 16, bottom: -16, fontSize: 130, opacity: 0.05, pointerEvents: "none", userSelect: "none", lineHeight: 1 }}>{cat.icon}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 900, color: cat.color, border: `1px solid ${cat.color}`, padding: "3px 10px", borderRadius: 4, background: `${cat.color}15`, letterSpacing: "0.1em" }}>★ TOP STORY</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: cat.color }}>{cat.icon} {cat.label}</span>
        <HotMeter value={item.hot} color={cat.color} />
        <span style={{ fontSize: 11, color: "rgba(241,245,249,0.35)", marginLeft: "auto" }}>{item.source} · πριν {item.time}</span>
      </div>
      <h2 onClick={() => item.url && item.url !== "#" && window.open(item.url, "_blank")}       style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.25, maxWidth: 560, letterSpacing: "-0.02em", cursor: item.url ? "pointer" : "default", textDecoration: "none" }}>{item.title}</h2>
      <p style={{ margin: "0 0 22px", fontSize: 14, color: "rgba(241,245,249,0.6)", lineHeight: 1.65, maxWidth: 500 }}>{item.summary}</p>
      <div style={{ display: "flex", gap: 10, alignItems: "center", position: "relative" }}>
        <button onClick={() => onConvert(item)} style={{ fontSize: 13, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg,${cat.color}dd,${cat.color}99)`, border: "none", borderRadius: 10, padding: "11px 22px", cursor: "pointer", boxShadow: `0 4px 24px ${cat.color}44` }}>✦ Δημιουργία Social Post</button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowShare(s => !s)} style={{ fontSize: 13, fontWeight: 700, color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}44`, borderRadius: 10, padding: "11px 16px", cursor: "pointer" }}>↗ Μοιράσου</button>
          {showShare && <ShareMenu item={item} color={cat.color} onClose={() => setShowShare(false)} />}
        </div>
        {item.url && item.url !== "#" && <a href={item.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Πηγή →</a>}
      </div>
    </div>
  );
}

function NewsCard({ item, onConvert }) {
  const [hovered, setHovered] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const cat = getCat(item.category);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? C.cardHover : C.card, border: `1px solid ${hovered ? cat.color + "44" : C.border}`, borderLeft: `3px solid ${item.own ? C.amber : cat.color}`, borderRadius: 12, padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr auto", gap: "8px 14px", alignItems: "start", transition: "all 0.18s", boxShadow: hovered ? `0 0 24px ${cat.color}12` : "none" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: cat.color, background: `${cat.color}15`, padding: "2px 8px", borderRadius: 20 }}>{cat.icon} {cat.label}</span>
          {item.own && <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, border: `1px solid ${C.amber}44`, padding: "2px 7px", borderRadius: 20 }}>✍ ClikNews</span>}
          <span style={{ fontSize: 11, color: C.textMuted }}>{item.source} · {item.time}</span>
        </div>
        <h3 onClick={() => item.url && item.url !== "#" && window.open(item.url, "_blank")} style={{ margin: "0 0 5px", fontSize: 14, fontWeight: 800, color: C.textPrimary, lineHeight: 1.35, cursor: item.url ? "pointer" : "default", textDecoration: "none" }}>{item.title}</h3>
        <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, lineHeight: 1.55 }}>{item.summary}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, paddingTop: 2 }}>
        <HotMeter value={item.hot} color={cat.color} />
        <button onClick={() => onConvert(item)} style={{ fontSize: 11, fontWeight: 800, whiteSpace: "nowrap", color: hovered ? "#fff" : cat.color, background: hovered ? cat.color : `${cat.color}15`, border: `1px solid ${cat.color}44`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", transition: "all 0.15s" }}>✦ Post</button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowShare(s => !s)} style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>↗</button>
          {showShare && <ShareMenu item={item} color={cat.color} onClose={() => setShowShare(false)} />}
        </div>
      </div>
    </div>
  );
}

function PostModal({ item, onClose, onPosted }) {
  const cat = getCat(item.category);
  const [platform, setPlatform] = useState("instagram");
  const [caption, setCaption] = useState(`${cat.icon} ${item.title}\n\n${item.summary}`);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try { setCaption(await generateCaption(item, platform)); onPosted(); }
    catch { setCaption("Σφάλμα σύνδεσης. Δοκίμασε ξανά."); }
    setLoading(false);
  };
  const copy = () => { navigator.clipboard.writeText(caption); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }} onClick={onClose}>
      <div style={{ background: "#0F1117", border: `1px solid ${cat.color}44`, borderRadius: 20, padding: 26, maxWidth: 540, width: "100%", boxShadow: `0 0 80px ${cat.color}15` }} onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: 12, fontWeight: 800, color: cat.color }}>{cat.icon} {cat.label}</span>
        <h3 style={{ margin: "6px 0 18px", fontSize: 15, fontWeight: 800, color: C.textPrimary, lineHeight: 1.3 }}>{item.title}</h3>
        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 800, color: C.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Πλατφόρμα</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {PLATFORMS.map(p => <button key={p.id} onClick={() => setPlatform(p.id)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", background: platform === p.id ? cat.color : "#ffffff08", color: platform === p.id ? "#fff" : C.textSecondary, border: `1px solid ${platform === p.id ? cat.color : C.border}`, transition: "all 0.15s" }}>{p.icon} {p.label}</button>)}
        </div>
        <button onClick={generate} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: loading ? C.border : `linear-gradient(135deg,${cat.color},#7C3AED)`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: loading ? "default" : "pointer", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Δημιουργία…</> : "✦ Δημιουργία με AI"}
        </button>
        <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={7} style={{ width: "100%", boxSizing: "border-box", background: "#08090F", border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", fontSize: 13, lineHeight: 1.6, fontFamily: "inherit", resize: "vertical", color: C.textPrimary }} />
        <p style={{ margin: "5px 0 14px", fontSize: 11, color: C.textMuted }}>💡 Επεξεργάσου πριν αντιγράψεις.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "none", cursor: "pointer", fontSize: 13, color: C.textMuted }}>Κλείσιμο</button>
          <button onClick={copy} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: copied ? C.green : cat.color, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 800, transition: "background 0.2s" }}>{copied ? "✓ Αντιγράφηκε!" : "Αντιγραφή"}</button>
        </div>
      </div>
    </div>
  );
}

function AdminModal({ onSave, onClose }) {
  const [pass, setPass] = useState("");
  const [auth, setAuth] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("music");
  const [url, setUrl] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [error, setError] = useState("");

  const login = () => { if (pass === ADMIN_PASSWORD) setAuth(true); else setError("Λάθος κωδικός!"); };
  const handleImg = e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setImgPreview(ev.target.result); r.readAsDataURL(f); } };
  const save = () => { if (!title.trim()) return; onSave({ title, summary, category, url: url || "#", img: imgPreview, scheduleDate }); };

  const inp = { width: "100%", boxSizing: "border-box", background: "#08090F", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 13px", fontSize: 13, color: C.textPrimary, fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }} onClick={onClose}>
      <div style={{ background: "#0F1117", border: `1px solid ${C.amber}33`, borderRadius: 20, padding: 26, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        {!auth ? (
          <>
            <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 900, color: C.textPrimary }}>🔐 Admin</h3>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: C.textMuted }}>Εισάγετε τον κωδικό πρόσβασης.</p>
            <input type="password" placeholder="Κωδικός…" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} style={inp} />
            {error && <p style={{ margin: "6px 0 0", fontSize: 12, color: C.breaking }}>{error}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "none", cursor: "pointer", fontSize: 13, color: C.textMuted }}>Ακύρωση</button>
              <button onClick={login} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: C.amber, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>Είσοδος</button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ margin: "0 0 18px", fontSize: 17, fontWeight: 900, color: C.textPrimary }}>✍️ Νέο Άρθρο ClikNews</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input placeholder="Τίτλος…" value={title} onChange={e => setTitle(e.target.value)} style={inp} />
              <textarea placeholder="Σύντομη περίληψη…" value={summary} onChange={e => setSummary(e.target.value)} rows={3} style={{ ...inp, resize: "vertical" }} />
              <input placeholder="URL άρθρου (προαιρετικό)…" value={url} onChange={e => setUrl(e.target.value)} style={inp} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, appearance: "none" }}>
                {CATEGORIES.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
              {/* Image upload */}
              <div style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: 12, textAlign: "center" }}>
                {imgPreview ? <img src={imgPreview} alt="preview" style={{ maxHeight: 100, borderRadius: 8, marginBottom: 8 }} /> : <p style={{ margin: "0 0 8px", fontSize: 12, color: C.textMuted }}>📷 Εικόνα άρθρου</p>}
                <input type="file" accept="image/*" onChange={handleImg} style={{ fontSize: 12, color: C.textSecondary }} />
              </div>
              {/* Schedule */}
              <div>
                <p style={{ margin: "0 0 5px", fontSize: 11, color: C.textMuted, fontWeight: 700 }}>⏰ Προγραμματισμός (προαιρετικό)</p>
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ ...inp }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "none", cursor: "pointer", fontSize: 13, color: C.textMuted }}>Ακύρωση</button>
              <button onClick={save} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.amber},#D97706)`, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>
                {scheduleDate ? "⏰ Προγραμματισμός" : "Δημοσίευση"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [convertItem, setConvertItem] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [ownArticles, setOwnArticles] = useState(OWN_INIT);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [konami, setKonami] = useState([]);

  const theme = darkMode ? C : C_LIGHT;

  const handleLogoClick = () => {
    const now = Date.now();
    setKonami(prev => { const next = [...prev.filter(t => now - t < 1500), now]; if (next.length >= 3) { setShowAdmin(true); return []; } return next; });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setLastRefresh(new Date()); setRefreshing(false); }, 1200);
  };

  useEffect(() => { const t = setInterval(() => setLastRefresh(new Date()), 60000); return () => clearInterval(t); }, []);

  const allItems = [...ownArticles.map(a => ({ ...a, own: true })), ...MOCK_NEWS];
  const filtered = allItems.filter(item => {
    const matchCat = activeCat === "all" || item.category === activeCat;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => (b.hot || 0) - (a.hot || 0));

  const featuredItem = filtered[0];
  const restItems = filtered.slice(1);
  const breakingCount = allItems.filter(i => i.category === "breaking").length;

  const addArticle = ({ title, summary, category, url, img, scheduleDate }) => {
    const newItem = { id: Date.now(), title, summary, category, url: url || "#", img, time: scheduleDate ? `Προγρ. ${new Date(scheduleDate).toLocaleString("el-GR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}` : "Μόλις τώρα", own: true, hot: 75, source: "ClikNews" };
    setOwnArticles(prev => [newItem, ...prev]);
    setShowAdmin(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter',system-ui,sans-serif", color: theme.textPrimary, transition: "background 0.3s, color 0.3s" }}>

      {/* Header */}
      <header style={{ background: darkMode ? "linear-gradient(180deg,#0C0E1A 0%,#08090F 100%)" : "#fff", borderBottom: `1px solid ${theme.border}`, padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: darkMode ? "none" : "0 1px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, cursor: "pointer" }} onClick={handleLogoClick}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${C.cobalt},${C.neonCyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, boxShadow: `0 0 16px ${C.cobaltGlow}` }}>📡</div>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.04em", background: "linear-gradient(135deg,#fff 20%,#3B82F6 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: darkMode ? "transparent" : undefined, color: darkMode ? undefined : C.cobalt }}>ClikNews.gr</span>
            {breakingCount > 0 && <span onClick={() => setActiveCat("breaking")} style={{ fontSize: 10, fontWeight: 900, color: C.breaking, border: `1px solid ${C.breaking}44`, padding: "2px 8px", borderRadius: 4, background: `${C.breaking}10`, animation: "blink 1.5s infinite", letterSpacing: "0.08em", cursor: "pointer" }}>🔥 {breakingCount} BREAKING</span>}
          </div>
          <span style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.03em", paddingLeft: 40 }}>Όλες οι σημαντικές Ειδήσεις σε Ελλάδα και Κόσμο</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {postCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: `${C.green}15`, border: `1px solid ${C.green}33`, borderRadius: 20, padding: "3px 10px" }}>✦ {postCount} posts σήμερα</span>}
          <input placeholder="🔍  Αναζήτηση…" value={search} onChange={e => setSearch(e.target.value)} style={{ background: darkMode ? "#ffffff07" : "#F1F5F9", border: `1px solid ${theme.border}`, borderRadius: 10, padding: "7px 13px", fontSize: 13, color: theme.textPrimary, width: 160, outline: "none" }} />
          <button onClick={handleRefresh} title="Ανανέωση" style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14, color: theme.textMuted, transition: "transform 0.3s", transform: refreshing ? "rotate(360deg)" : "none" }}>↻</button>
          <button onClick={() => setDarkMode(d => !d)} style={{ background: "none", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>{darkMode ? "☀️" : "🌙"}</button>
          <span style={{ fontSize: 10, color: theme.textMuted }}>{lastRefresh.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </header>

      {/* Category bar + Banners */}
      <div style={{ background: darkMode ? "#0B0C14" : "#F8FAFC", borderBottom: `1px solid ${theme.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 200, flexShrink: 0 }}>
          <select value={activeCat} onChange={e => setActiveCat(e.target.value)} style={{ width: "100%", background: darkMode ? "#08090F" : "#fff", border: `1px solid ${getCat(activeCat).color}55`, borderRadius: 10, padding: "8px 36px 8px 14px", fontSize: 13, fontWeight: 700, color: getCat(activeCat).color, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none" }}>
            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id} style={{ color: cat.color, background: darkMode ? "#08090F" : "#fff" }}>{cat.icon} {cat.label}</option>)}
          </select>
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 12, color: getCat(activeCat).color }}>▼</span>
        </div>
        {BANNERS.map((b, i) => (
          <a key={i} href={b.url} target="_blank" rel="noreferrer" style={{ flex: 1, minWidth: 90, height: 38, borderRadius: 10, position: "relative", overflow: "hidden", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${b.color1}cc,${b.color2}cc)` }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.07)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 100%)", borderRadius: "10px 10px 0 0" }} />
            <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>{b.label}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em" }}>{b.sub}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Content */}
      <main style={{ padding: "18px 20px", maxWidth: 860, margin: "0 auto" }}>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", color: theme.textMuted, padding: "80px 0", fontSize: 14 }}>Δεν βρέθηκαν ειδήσεις.</div>
          : <>
              {featuredItem && <FeaturedCard item={featuredItem} onConvert={setConvertItem} darkMode={darkMode} />}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {restItems.map(item => <NewsCard key={item.id} item={item} onConvert={setConvertItem} />)}
              </div>
            </>
        }
      </main>

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: "16px 24px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: theme.textMuted }}>© 2026 ClikNews.gr · Όλες οι σημαντικές Ειδήσεις σε Ελλάδα και Κόσμο</span>
      </footer>

      {convertItem && <PostModal item={convertItem} onClose={() => setConvertItem(null)} onPosted={() => setPostCount(n => n + 1)} />}
      {showAdmin && <AdminModal onSave={addArticle} onClose={() => setShowAdmin(false)} />}

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-track{background:${theme.bg}}
        ::-webkit-scrollbar-thumb{background:#3D4560;border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:#6B7280}
        input::placeholder,textarea::placeholder{color:${theme.textMuted}}
        *{box-sizing:border-box}
      `}</style>
    </div>
  );
}
