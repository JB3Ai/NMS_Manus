import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { appUrl } from "@/lib/appUrl";
import { trpc } from "@/lib/trpc";
import { calculateVaultProgress } from "@/lib/vaultProgress";
import {
  colourOptions,
  complianceLayers,
  costBlocks,
  currentIssues,
  decisionAreas,
  engagementFlows,
  logoOptions,
  marketingChannels,
  navigation,
  productCriteria,
  proposalVideos,
  risks,
  roadmap,
  statusMetrics,
} from "@/proposalContent";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Download,
  Eye,
  ExternalLink,
  FileArchive,
  FileCheck2,
  FileText,
  FlaskConical,
  Gauge,
  Layers3,
  Leaf,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  PackageCheck,
  Palette,
  Phone,
  Play,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type DecisionStatus = "draft" | "approved" | "needs_discussion";
type VaultReviewer = { id: string; name: string };
type VaultDocument = { id: string; title: string; filename: string; type: string; size: string; category: string; description: string; url: string };
type VaultReview = { documentId: string; openedAt: Date | null; downloadedAt: Date | null; readAt: Date | null };

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr] lg:items-end mb-8">
      <p className="eyebrow text-primary">{eyebrow}</p>
      <div>
        <h2 className="display-title text-3xl sm:text-4xl lg:text-5xl leading-[1.04]">{title}</h2>
        <p className="mt-4 max-w-3xl text-muted-foreground leading-7">{intro}</p>
      </div>
    </div>
  );
}

function VideoShowcase() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeVideo = proposalVideos.find(video => video.id === activeId);

  return (
    <section id="videos" className="section-anchor p-6 sm:p-10 lg:p-14 bg-[#18251f] text-white border-b border-white/15">
      <div className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr] lg:items-end mb-8">
        <p className="eyebrow text-accent">07 · Executive video briefings</p>
        <div>
          <h2 className="display-title text-3xl sm:text-4xl lg:text-5xl leading-[1.04]">Three perspectives on the relaunch.</h2>
          <p className="mt-4 max-w-3xl text-white/65 leading-7">Select a briefing to expand it into a full-width player. Together they connect the digital operating system, 90-day delivery sprint and heritage strategy.</p>
        </div>
      </div>

      {activeVideo && (
        <div className="mb-7 border border-white/20 bg-black/25">
          <div className="flex items-center justify-between gap-4 p-4 sm:px-5 border-b border-white/15">
            <div>
              <p className="text-[10px] uppercase tracking-[.15em] text-accent font-bold">Now playing</p>
              <h3 className="font-semibold mt-1">{activeVideo.executiveTitle}</h3>
              <p className="text-xs text-white/55 mt-1">{activeVideo.title} · {activeVideo.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={activeVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex h-9 items-center gap-2 border border-white/25 px-3 text-[10px] font-bold uppercase tracking-[.1em] hover:bg-white/10">
                Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button onClick={() => setActiveId(null)} aria-label="Close expanded video" className="h-9 w-9 border border-white/25 grid place-items-center hover:bg-white/10"><X className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="aspect-video bg-black">
            <iframe key={activeVideo.id} className="h-full w-full" src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&playsinline=1`} title={activeVideo.title} loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          </div>
          <a href={activeVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="sm:hidden flex items-center justify-center gap-2 border-t border-white/15 p-3 text-[10px] font-bold uppercase tracking-[.1em] text-white/80 hover:bg-white/10">
            If playback is blocked, watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {proposalVideos.map((video, index) => (
          <button key={video.id} onClick={() => setActiveId(video.id)} className={`group text-left border transition-colors duration-200 ${activeId === video.id ? "border-accent" : "border-white/20 hover:border-white/50"}`}>
            <div className="relative aspect-video overflow-hidden bg-primary">
              {video.thumbnail ? <img src={video.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 portal-grid flex flex-col justify-between p-5"><span className="text-[10px] uppercase tracking-[.16em] text-white/55">Briefing {String(index + 1).padStart(2, "0")}</span><p className="display-title text-2xl max-w-[80%]">Digital operating system</p></div>}
              <span className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              <span className="absolute left-4 bottom-4 h-12 w-12 bg-accent text-accent-foreground grid place-items-center"><Play className="h-5 w-5 fill-current" /></span>
              {video.status !== "Available" && <span className="absolute right-3 top-3 bg-black/70 px-3 py-1.5 text-[9px] uppercase tracking-[.12em] font-bold">Processing</span>}
            </div>
            <div className="p-5 min-h-44 bg-white/[.035]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[.14em] text-accent font-bold">Video {String(index + 1).padStart(2, "0")}</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[.1em] text-white/70"><Clock3 className="h-3.5 w-3.5 text-accent" /> Est. {video.duration.replace("≈ ", "")}</span>
              </div>
              <h3 className="font-semibold mt-3 leading-6">{video.executiveTitle}</h3>
              <p className="text-sm text-white/55 mt-2 leading-5">{video.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function DocumentVault({ reviewer, onSetReviewer, onChangeReviewer, documents, reviews, loading, onClose }: {
  reviewer: VaultReviewer | null;
  onSetReviewer: (name: string) => void;
  onChangeReviewer: () => void;
  documents: readonly VaultDocument[];
  reviews: VaultReview[];
  loading: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [previewDocument, setPreviewDocument] = useState<VaultDocument | null>(null);
  const utils = trpc.useUtils();
  const reviewMap = useMemo(() => new Map(reviews.map(review => [review.documentId, review])), [reviews]);
  const record = trpc.vault.record.useMutation({ onSuccess: () => utils.vault.list.invalidate(), onError: error => toast.error(error.message) });
  const progress = useMemo(() => calculateVaultProgress(documents.map(document => document.id), reviews), [documents, reviews]);
  const recordEvent = (documentId: string, event: "opened" | "downloaded" | "read" | "unread") => {
    if (reviewer) record.mutate({ reviewerId: reviewer.id, reviewerName: reviewer.name, documentId, event });
  };
  const previewPdf = (document: VaultDocument) => {
    recordEvent(document.id, "opened");
    setPreviewDocument(document);
  };

  return (
    <div className="fixed inset-0 z-[85] bg-background text-foreground overflow-y-auto">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-5 sm:px-8 lg:px-12 h-18 flex items-center gap-4">
          <span className="h-10 w-10 bg-primary text-primary-foreground grid place-items-center"><FileArchive className="h-5 w-5" /></span>
          <div><p className="eyebrow text-primary">Confidential client documents</p><h2 className="font-semibold">NMS Document Vault</h2></div>
          <button onClick={onClose} aria-label="Close document vault" className="ml-auto h-10 w-10 border border-border grid place-items-center"><X className="h-4 w-4" /></button>
        </div>
      </header>

      {!reviewer ? (
        <main className="min-h-[calc(100vh-72px)] grid place-items-center p-6 portal-grid">
          <div className="w-full max-w-lg bg-card border border-border p-7 sm:p-10 soft-panel">
            <UserRound className="h-8 w-8 text-primary" /><p className="eyebrow text-primary mt-7">Reviewer identification</p><h3 className="display-title text-4xl mt-3">Who is reviewing?</h3>
            <p className="text-muted-foreground mt-4 leading-7">Enter your name once so the vault can keep your document progress separate from the other NMS executives on this browser.</p>
            <form className="mt-7" onSubmit={event => { event.preventDefault(); if (name.trim().length >= 2) onSetReviewer(name.trim()); }}>
              <label htmlFor="reviewer-name" className="text-xs uppercase tracking-[.14em] font-bold text-muted-foreground">Full name</label>
              <Input id="reviewer-name" value={name} onChange={event => setName(event.target.value)} autoFocus placeholder="e.g. Executive name" className="mt-2 h-12" />
              <Button type="submit" className="mt-3 w-full h-12" disabled={name.trim().length < 2}>Enter document vault <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </form>
          </div>
        </main>
      ) : (
        <main className="p-5 sm:p-8 lg:p-12 max-w-[1500px] mx-auto">
          <div className="grid gap-6 xl:grid-cols-[.68fr_.32fr] xl:items-end">
            <div><p className="eyebrow text-primary">Edited client originals · 8 controlled files</p><h1 className="display-title text-4xl sm:text-6xl mt-4">Review, download and confirm each document.</h1><p className="mt-5 max-w-3xl text-muted-foreground leading-7">These are the user-edited originals supplied on 18 August 2026—not the earlier master documents produced by Manus.</p></div>
            <div className="bg-primary text-primary-foreground p-6">
              <div className="flex items-center justify-between gap-4"><div><p className="text-xs text-primary-foreground/60">Reviewing as</p><p className="font-semibold mt-1">{reviewer.name}</p></div><button onClick={onChangeReviewer} className="text-xs underline underline-offset-4">Change</button></div>
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-primary-foreground/20 text-center"><div><p className="text-2xl font-semibold">{progress.opened}</p><p className="text-[10px] text-primary-foreground/60 mt-1">opened</p></div><div><p className="text-2xl font-semibold">{progress.downloaded}</p><p className="text-[10px] text-primary-foreground/60 mt-1">downloaded</p></div><div><p className="text-2xl font-semibold">{progress.read}</p><p className="text-[10px] text-primary-foreground/60 mt-1">read</p></div></div>
            </div>
          </div>

          {loading ? <div className="py-24 grid place-items-center"><Leaf className="h-7 w-7 text-primary animate-pulse" /></div> : (
            <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {documents.map((document, index) => {
                const review = reviewMap.get(document.id);
                return <article key={document.id} className="bg-card border border-border p-5 sm:p-6 flex flex-col min-h-[340px]">
                  <div className="flex items-start justify-between gap-4"><span className="h-11 w-11 bg-secondary text-secondary-foreground grid place-items-center"><FileText className="h-5 w-5" /></span><div className="flex gap-1.5"><span title={review?.openedAt ? "Opened" : "Not opened"} className={`h-7 w-7 grid place-items-center border ${review?.openedAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}><Eye className="h-3.5 w-3.5" /></span><span title={review?.downloadedAt ? "Downloaded" : "Not downloaded"} className={`h-7 w-7 grid place-items-center border ${review?.downloadedAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}><Download className="h-3.5 w-3.5" /></span><span title={review?.readAt ? "Marked read" : "Not marked read"} className={`h-7 w-7 grid place-items-center border ${review?.readAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}><Check className="h-3.5 w-3.5" /></span></div></div>
                  <p className="eyebrow text-primary mt-6">{String(index + 1).padStart(2, "0")} · {document.category}</p><h3 className="text-xl font-semibold mt-3 leading-7">{document.title}</h3><p className="text-sm text-muted-foreground mt-3 leading-6">{document.description}</p><p className="text-xs text-muted-foreground mt-4">{document.type} · {document.size}</p>
                  <div className="mt-auto pt-6 grid grid-cols-2 gap-2">{document.type === "PDF" ? <button onClick={() => previewPdf(document)} className="border border-border px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary"><Eye className="h-4 w-4" /> Preview</button> : <a href={appUrl(document.url)} target="_blank" rel="noreferrer" onClick={() => recordEvent(document.id, "opened")} className="border border-border px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary"><ExternalLink className="h-4 w-4" /> Open</a>}<a href={appUrl(document.url)} download={document.filename} onClick={() => recordEvent(document.id, "downloaded")} className="bg-primary text-primary-foreground px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download</a><button onClick={() => recordEvent(document.id, review?.readAt ? "unread" : "read")} className={`col-span-2 px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border ${review?.readAt ? "border-primary text-primary" : "border-border"}`}><CheckCircle2 className="h-4 w-4" /> {review?.readAt ? "Marked as read" : "Mark as read"}</button></div>
                </article>;
              })}
            </div>
          )}
        </main>
      )}

      {previewDocument && <div className="fixed inset-0 z-[90] bg-[#111815] text-white flex flex-col">
        <header className="shrink-0 min-h-18 px-4 sm:px-6 py-3 border-b border-white/15 flex flex-wrap items-center gap-3">
          <span className="h-10 w-10 bg-accent text-accent-foreground grid place-items-center"><FileText className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-[.14em] text-white/50">In-browser PDF preview</p><h3 className="font-semibold truncate mt-1">{previewDocument.title}</h3></div>
          <a href={appUrl(previewDocument.url)} target="_blank" rel="noreferrer" className="h-10 px-3 border border-white/20 text-xs font-bold flex items-center gap-2"><ExternalLink className="h-4 w-4" /><span className="hidden sm:inline">Open in new tab</span></a>
          <a href={appUrl(previewDocument.url)} download={previewDocument.filename} onClick={() => recordEvent(previewDocument.id, "downloaded")} className="h-10 px-3 bg-accent text-accent-foreground text-xs font-bold flex items-center gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Download</span></a>
          <button onClick={() => setPreviewDocument(null)} aria-label="Close PDF preview" className="h-10 w-10 border border-white/20 grid place-items-center"><X className="h-4 w-4" /></button>
        </header>
        <div className="flex-1 min-h-0 bg-[#252b28] p-2 sm:p-4">
          <iframe src={`${appUrl(previewDocument.url)}#toolbar=1&navpanes=0&view=FitH`} title={`Preview of ${previewDocument.title}`} className="h-full w-full bg-white border-0" />
        </div>
        <footer className="shrink-0 px-4 sm:px-6 py-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-white/55">If your browser blocks embedded PDFs, use “Open in new tab”.</p>
          <button onClick={() => { recordEvent(previewDocument.id, reviewMap.get(previewDocument.id)?.readAt ? "unread" : "read"); }} className={`px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border ${reviewMap.get(previewDocument.id)?.readAt ? "border-accent text-accent" : "border-white/25"}`}><CheckCircle2 className="h-4 w-4" /> {reviewMap.get(previewDocument.id)?.readAt ? "Marked as read" : "Mark as read"}</button>
        </footer>
      </div>}
    </div>
  );
}

function DecisionCard({
  area,
  label,
  options,
  existing,
  onSaved,
}: {
  area: string;
  label: string;
  options: string[];
  existing?: { selection: string; note: string | null; status: string };
  onSaved: () => void;
}) {
  const [selection, setSelection] = useState(existing?.selection ?? options[0]);
  const [note, setNote] = useState(existing?.note ?? "");
  const [status, setStatus] = useState<DecisionStatus>((existing?.status as DecisionStatus) ?? "draft");
  const mutation = trpc.decisions.save.useMutation({
    onSuccess: () => {
      toast.success(`${label} recorded`);
      onSaved();
    },
    onError: error => toast.error(error.message),
  });

  useEffect(() => {
    if (!existing) return;
    setSelection(existing.selection);
    setNote(existing.note ?? "");
    setStatus(existing.status as DecisionStatus);
  }, [existing]);

  return (
    <article className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <span className={`text-[10px] uppercase tracking-[.14em] font-bold px-2 py-1 ${status === "approved" ? "bg-primary text-primary-foreground" : status === "needs_discussion" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
          {status.replace("_", " ")}
        </span>
      </div>
      <select value={selection} onChange={event => setSelection(event.target.value)} className="mt-3 w-full border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      <Textarea value={note} onChange={event => setNote(event.target.value)} placeholder="Optional executive note" className="mt-2 min-h-20 bg-background" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["draft", "needs_discussion", "approved"] as DecisionStatus[]).map(value => (
          <button key={value} onClick={() => setStatus(value)} className={`border px-2 py-2 text-[10px] uppercase tracking-[.08em] font-bold ${status === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
            {value === "needs_discussion" ? "Discuss" : value}
          </button>
        ))}
      </div>
      <Button className="mt-3 w-full" size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate({ area, selection, note: note || undefined, status })}>
        {mutation.isPending ? "Saving…" : "Record decision"}
      </Button>
    </article>
  );
}


export default function Home() {
  const { theme, setTheme, themes } = useTheme();
  const [mobileNav, setMobileNav] = useState(false);
  const [decisionRail, setDecisionRail] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [reminderAction, setReminderAction] = useState<"close" | "logout" | null>(null);
  const [reviewer, setReviewer] = useState<VaultReviewer | null>(() => {
    try {
      const stored = localStorage.getItem("nms-vault-reviewer");
      return stored ? JSON.parse(stored) as VaultReviewer : null;
    } catch {
      return null;
    }
  });
  const utils = trpc.useUtils();
  const vaultInput = useMemo(() => ({ reviewerId: reviewer?.id ?? "unassigned" }), [reviewer?.id]);
  const logout = trpc.pin.logout.useMutation({
    onSuccess: async () => {
      utils.decisions.list.setData(undefined, undefined);
      utils.vault.list.setData(vaultInput, undefined);
    },
  });
  const decisions = trpc.decisions.list.useQuery(undefined, { enabled: true });
  const vault = trpc.vault.list.useQuery(vaultInput, { enabled: Boolean(reviewer), retry: false });
  const decisionMap = useMemo(() => new Map((decisions.data ?? []).map(item => [item.area, item])), [decisions.data]);
  const vaultReviewMap = useMemo(() => new Map((vault.data?.reviews ?? []).map(item => [item.documentId, item])), [vault.data?.reviews]);
  const vaultDocuments = vault.data?.documents ?? [];
  const vaultProgress = useMemo(() => calculateVaultProgress(vaultDocuments.map(document => document.id), vault.data?.reviews ?? []), [vaultDocuments, vault.data?.reviews]);
  const { remainingDownloads, remainingReads, remainingDocuments, completed: reviewedDocuments } = vaultProgress;

  const saveReviewer = (name: string) => {
    const next = { id: crypto.randomUUID(), name };
    localStorage.setItem("nms-vault-reviewer", JSON.stringify(next));
    setReviewer(next);
  };
  const changeReviewer = () => {
    localStorage.removeItem("nms-vault-reviewer");
    setReviewer(null);
  };
  const requestVaultClose = () => {
    if (reviewer && vaultDocuments.length > 0 && remainingDocuments > 0) setReminderAction("close");
    else setVaultOpen(false);
  };
  const requestLogout = () => {
    if (reviewer && vaultDocuments.length > 0 && remainingDocuments > 0) setReminderAction("logout");
    else logout.mutate();
  };
  const confirmReminderAction = () => {
    const action = reminderAction;
    setReminderAction(null);
    if (action === "close") setVaultOpen(false);
    if (action === "logout") logout.mutate();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/92 backdrop-blur-xl border-b border-border">
        <div className="h-17 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu className="h-5 w-5" /></button>
          <a href="#overview" className="flex items-center gap-3 shrink-0">
            <span className="h-9 w-9 bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold tracking-[.14em]">NMS</span>
            <span className="hidden sm:block text-xs uppercase tracking-[.15em] font-bold">Renewal Portal</span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center border border-border bg-card p-1">
              {themes.map(item => <button key={item.id} title={item.description} onClick={() => setTheme(item.id)} className={`px-3 py-1.5 text-[11px] font-bold ${theme === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{item.name.split(" /")[0]}</button>)}
            </div>
            <button onClick={() => setVaultOpen(true)} className="h-9 px-3 border border-border bg-card text-xs font-bold flex items-center gap-2"><FileArchive className="h-4 w-4" /> <span className="hidden sm:inline">Vault{reviewer && vaultDocuments.length > 0 ? ` · ${reviewedDocuments}/${vaultDocuments.length}` : ""}</span></button>
            <button onClick={() => setDecisionRail(true)} className="h-9 px-3 bg-accent text-accent-foreground text-xs font-bold flex items-center gap-2"><FileCheck2 className="h-4 w-4" /> <span className="hidden sm:inline">Decisions</span></button>
            <button onClick={requestLogout} title="Lock portal" className="h-9 w-9 border border-border bg-card grid place-items-center"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      </header>

      {mobileNav && <div className="fixed inset-0 z-[70] lg:hidden"><button aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setMobileNav(false)} /><nav className="relative h-full w-[82vw] max-w-xs bg-sidebar text-sidebar-foreground p-6"><div className="flex justify-between"><span className="eyebrow">Proposal contents</span><button onClick={() => setMobileNav(false)}><X className="h-5 w-5" /></button></div><div className="mt-7 space-y-1">{navigation.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={() => setMobileNav(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-sidebar-accent"><span className="text-[10px] text-sidebar-primary font-bold">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}</div></nav></div>}

      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block bg-sidebar text-sidebar-foreground min-h-[calc(100vh-68px)] sticky top-17 self-start">
          <div className="p-6 border-b border-sidebar-border">
            <p className="eyebrow text-sidebar-primary">JB3AI × NMS</p>
            <p className="mt-3 text-sm text-sidebar-foreground/65 leading-6">Consolidated master proposal<br />Version 1.0 · 17 Aug 2026</p>
          </div>
          <nav className="p-3 py-5">
            {navigation.map(([id, label], index) => <a key={id} href={`#${id}`} className="flex items-center gap-3 px-3 py-2 text-[13px] text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><span className="text-[9px] text-sidebar-primary font-bold">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
          </nav>
          <div className="m-4 mt-0 p-4 border border-sidebar-border">
            <p className="text-xs font-bold">PIN access active</p>
            <p className="text-xs text-sidebar-foreground/60 mt-1 truncate">{reviewer?.name ?? "Shared NMS client session"}</p>
            <p className="text-[10px] uppercase tracking-wider text-sidebar-primary mt-3">Private proposal</p>
          </div>
        </aside>

        <main className="min-w-0">
          <section id="overview" className="section-anchor relative min-h-[620px] bg-cover bg-center" style={{ backgroundImage: `url('${appUrl("/manus-storage/nms-botanical-packaging_bdbd72ed.png")}')` }}>
            <div className="absolute inset-0 hero-overlay" />
            <div className="relative z-10 min-h-[620px] flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
              <div className="flex justify-between items-start gap-4"><p className="eyebrow text-white/70">Consolidated transformation proposal</p><span className="border border-white/35 px-3 py-1.5 text-[10px] uppercase tracking-[.14em]">Confidential</span></div>
              <div className="max-w-4xl py-12">
                <p className="text-sm text-white/65">Natural Medicinal Services</p>
                <h1 className="display-title text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[.91] mt-5">From inherited catalogue to accountable botanical authority.</h1>
                <p className="mt-7 max-w-2xl text-lg text-white/75 leading-8">A decision-ready path to verify the business, select a compliant hero portfolio, build the new brand and digital platform, pilot in Gauteng and scale only what proves safe and commercially resilient.</p>
                <div className="mt-8 flex flex-wrap gap-3"><a href="#roadmap" className="bg-white text-[#18251f] px-5 py-3 text-sm font-bold flex items-center gap-2">View implementation <ArrowRight className="h-4 w-4" /></a><button onClick={() => setDecisionRail(true)} className="border border-white/45 px-5 py-3 text-sm font-bold">Open decision register</button></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/25">
                {statusMetrics.map(metric => <div key={metric.label} className="py-5 pr-5 border-r border-white/20 last:border-r-0"><p className="text-3xl font-semibold">{metric.value}</p><p className="text-xs text-white/60 mt-1">{metric.label}</p></div>)}
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-14 bg-card text-card-foreground border-b border-border">
            <div className="grid gap-8 xl:grid-cols-[.72fr_.28fr]">
              <div><p className="eyebrow text-primary">Introduction & mandate</p><h2 className="display-title text-4xl sm:text-5xl mt-4 max-w-3xl">JB3AI integrates the transformation; NMS owners retain corporate, regulatory and product authority.</h2><p className="mt-6 max-w-3xl text-muted-foreground leading-8">JB3AI will coordinate discovery, establish the controlled data room and product-information process, convert approved strategy into brand and digital systems, manage acceptance testing and report gate evidence. NMS leadership, legal counsel, the regulatory owner, quality leadership and authorised specialists remain accountable for legal particulars, classifications, claims, labels, quality statements, policies and launch approvals.</p></div>
              <div className="bg-primary text-primary-foreground p-6"><ShieldCheck className="h-7 w-7 text-accent" /><p className="mt-8 text-xl leading-8">Truth before identity.<br />Portfolio before platform.<br />Compliance before promotion.<br />Pilot before scale.</p></div>
            </div>
          </section>

          <section id="vault" className="section-anchor p-6 sm:p-10 lg:p-14 bg-muted/45 border-b border-border">
            <div className="grid gap-8 lg:grid-cols-[.68fr_.32fr] lg:items-end">
              <div><p className="eyebrow text-primary">Controlled document vault</p><h2 className="display-title text-4xl sm:text-5xl mt-4">Eight edited originals. One accountable review trail.</h2><p className="mt-5 max-w-3xl text-muted-foreground leading-7">Open and download the exact client-edited files, then mark each as read. Progress is kept separately for each named executive on their browser.</p></div>
              <button onClick={() => setVaultOpen(true)} className="bg-primary text-primary-foreground p-6 text-left group"><FileArchive className="h-7 w-7 text-accent" /><div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-xs text-primary-foreground/60">{reviewer && vaultDocuments.length > 0 ? `${reviewedDocuments} of ${vaultDocuments.length} complete` : "Reviewer setup required"}</p><p className="text-xl font-semibold mt-1">Open document vault</p></div><ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></div></button>
            </div>
          </section>

          <section id="history" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="01 · Brand & history" title="Preserve the heritage. Qualify the claim." intro="The archive is strategically valuable, but archival repetition is not proof of uninterrupted legal continuity or current commercial authority." />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 border-l-4 border-primary pl-6 py-2"><p className="text-2xl sm:text-3xl leading-relaxed">Multiple sources trace NMS’s Johannesburg herbal roots to <strong>1934</strong>, alongside a historical portfolio of more than 150 simplex herbs, remedies, teas, topicals and distributed ranges.</p><p className="text-muted-foreground mt-5 leading-7">Historical records also show product codes, barcodes, NAPPI fields, case packs and pharmacy/wholesale references. They are evidence of past infrastructure—not proof of current listings, products or approvals.</p></div>
              <div className="bg-card border border-border p-6"><BookOpen className="h-6 w-6 text-primary" /><h3 className="font-semibold mt-6">Public-history rule</h3><p className="text-sm text-muted-foreground mt-3 leading-6">Until legal succession and evidence are approved, the strongest working wording is “roots traced to 1934 in Johannesburg.” “Established 1934” remains a leadership and legal decision.</p></div>
            </div>
          </section>

          <section id="current" className="section-anchor p-6 sm:p-10 lg:p-14 bg-muted/50 border-b border-border">
            <SectionHeading eyebrow="02 · Current state" title="The inherited records are an archive—not an operating system." intro="The immediate objective is to convert contradictions into controlled decisions and verified records." />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 border-l border-t border-border">
              {currentIssues.map((issue, index) => <article key={issue.title} className="bg-card p-6 border-r border-b border-border min-h-48"><div className="flex items-center justify-between"><span className="text-[10px] text-muted-foreground font-bold">0{index + 1}</span><span className="text-[10px] uppercase tracking-[.14em] font-bold text-destructive">{issue.status}</span></div><h3 className="display-title text-2xl mt-8">{issue.title}</h3><p className="mt-3 text-sm text-muted-foreground leading-6">{issue.detail}</p></article>)}
            </div>
          </section>

          <section id="roadmap" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="03 · Future implementation" title="A 90-day sprint inside an 18-month gated transformation." intro="The shorter revival plans remain useful delivery sprints, but they cannot be interpreted as automatic public-launch permission." />
            <div className="border-t border-border">
              {roadmap.map((item, index) => <article key={item.phase} className="grid gap-4 md:grid-cols-[64px_.7fr_.25fr_.25fr_1.2fr] py-6 border-b border-border items-start"><span className="h-10 w-10 border border-primary text-primary grid place-items-center font-bold text-xs">{String(index + 1).padStart(2, "0")}</span><h3 className="text-lg font-semibold">{item.phase}</h3><p className="text-sm text-muted-foreground">{item.timing}</p><span className="text-xs font-bold text-primary">{item.gate}</span><p className="text-sm text-muted-foreground leading-6">{item.output}</p></article>)}
            </div>
          </section>

          <section id="brand" className="section-anchor p-6 sm:p-10 lg:p-14 bg-card border-b border-border">
            <SectionHeading eyebrow="04 · New brand & look" title="Johannesburg herbal heritage, made accountable." intro="The internal strategic position moves NMS away from miracle language and towards controlled transparency: inspectable ingredients, clear directions, traceability, safety guidance and named ownership." />
            <div className="grid gap-8 xl:grid-cols-[.85fr_1.15fr]">
              <div className="bg-primary text-primary-foreground p-7 sm:p-9"><Sparkles className="h-7 w-7 text-accent" /><h3 className="display-title text-3xl mt-8">Controlled transparency</h3><p className="mt-5 text-primary-foreground/72 leading-7">Common and botanical names, plant part, dosage form, quantity, warnings, interactions, lot traceability, quality ownership and claims that do not exceed accepted evidence.</p><div className="mt-8 pt-6 border-t border-primary-foreground/20"><p className="eyebrow text-primary-foreground/60">Voice</p><p className="mt-3">Calm · plain · precise · respectful · non-alarmist</p></div></div>
              <div><p className="eyebrow text-primary">Logo routes</p><div className="mt-4 border-t border-border">{logoOptions.map((option, index) => <article key={option.name} className="py-5 border-b border-border grid gap-3 sm:grid-cols-[48px_1fr]"><span className="h-9 w-9 bg-secondary text-secondary-foreground grid place-items-center text-xs font-bold">{index + 1}</span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{option.name}</h3><span className="text-[10px] uppercase tracking-wider text-primary">{option.tag}</span></div><p className="text-sm text-muted-foreground mt-2 leading-6">{option.detail}</p><p className="text-xs mt-3"><strong>Strength:</strong> {option.strength} · <strong>Risk:</strong> {option.risk}</p></div></article>)}</div></div>
            </div>
            <div className="mt-10"><p className="eyebrow text-primary">Colour directions</p><div className="mt-4 grid lg:grid-cols-3 border-l border-t border-border">{colourOptions.map(option => <article key={option.name} className="p-6 border-r border-b border-border"><h3 className="font-semibold">{option.name}</h3><div className="flex mt-5">{option.swatches.map(colour => <span key={colour} title={colour} className="h-12 flex-1" style={{ backgroundColor: colour }} />)}</div><p className="text-sm text-muted-foreground mt-4 leading-6">{option.note}</p></article>)}</div></div>
          </section>

          <section id="marketing" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="05 · Marketing plan" title="Trust and safe discovery before reach." intro="Marketing begins with a verified information platform and service model. Channel volume grows only after capacity, claims governance and contribution are proven." />
            <div className="grid md:grid-cols-2 xl:grid-cols-4 border-l border-t border-border">{marketingChannels.map((channel, index) => <article key={channel.name} className="p-5 border-r border-b border-border min-h-44"><span className="text-[10px] text-primary font-bold">{String(index + 1).padStart(2, "0")}</span><h3 className="font-semibold mt-8">{channel.name}</h3><p className="text-sm text-muted-foreground mt-3 leading-6">{channel.role}</p></article>)}</div>
            <div className="mt-8 bg-secondary text-secondary-foreground p-6 flex items-start gap-4"><Gauge className="h-6 w-6 shrink-0" /><p className="leading-7"><strong>No social allocation is approved.</strong> Source documents contain competing 45/25/15/10/5, 45/25/15/15 and 60/30/10 examples. The pilot plan will set spend through contribution evidence, attribution and stop/reallocate rules.</p></div>
          </section>

          <section id="products" className="section-anchor p-6 sm:p-10 lg:p-14 bg-muted/45 border-b border-border">
            <SectionHeading eyebrow="06 · Products & rebranding" title="From 247 held rows to three–five defensible heroes." intro="Rebranding is not a label reskin. Every hero candidate must first pass mandatory safety, identity, licence and production disqualifiers." />
            <div className="grid gap-8 xl:grid-cols-[.37fr_.63fr]">
              <div className="bg-card border border-border p-6"><img src={appUrl("/manus-storage/product-status-indicator_40bc02cd.png")} alt="Red quarantine, amber needs work and green hero candidate product triage" className="w-full h-auto" /><p className="text-xs text-muted-foreground mt-4 leading-5">Green means eligible for weighted scoring—not automatically approved. All eight QA release checks must still pass.</p></div>
              <div className="space-y-4">{productCriteria.map(item => <article key={item.name}><div className="flex justify-between gap-4 text-sm"><h3 className="font-semibold">{item.name}</h3><span className="font-bold text-primary">{item.weight}%</span></div><div className="h-2 bg-secondary mt-2"><div className="h-full bg-primary" style={{ width: `${item.weight * 4}%` }} /></div><p className="text-xs text-muted-foreground mt-2 leading-5">{item.detail}</p></article>)}</div>
            </div>
          </section>

          <VideoShowcase />

          <section id="compliance" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="08 · SAHPRA & compliance" title="Claims are controlled product data—not creative copy." intro="Health supplements are limited to low-risk indication frameworks and product readiness must link formulation, dose, evidence, warnings, quality and channel use." />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 border-l border-t border-border">{complianceLayers.map((layer, index) => <article key={layer.title} className="p-6 border-r border-b border-border min-h-48"><div className="flex items-center gap-3"><span className="h-8 w-8 bg-primary text-primary-foreground grid place-items-center text-xs font-bold">{index + 1}</span><ShieldCheck className="h-5 w-5 text-primary" /></div><h3 className="font-semibold mt-6">{layer.title}</h3><p className="text-sm text-muted-foreground mt-3 leading-6">{layer.text}</p></article>)}</div>
            <div className="mt-8 border-l-4 border-accent bg-card p-6"><p className="font-semibold">Mandatory release rule</p><p className="text-muted-foreground mt-2 leading-7">Physical stock, controlled specification, regulatory category, barcode/NAPPI, artwork, commercial data, logistics and digital assets must all be green with named evidence before a SKU is publishable or orderable.</p></div>
          </section>

          <section id="engagement" className="section-anchor p-6 sm:p-10 lg:p-14 bg-card border-b border-border">
            <SectionHeading eyebrow="09 · Customer engagement" title="One case model across every conversation." intro="Calls, chatbot, email, WhatsApp and social should share approved product information, consent controls and full-context escalation so safety and service are never fragmented." />
            <div className="border-t border-border">{engagementFlows.map((flow, index) => <article key={flow.channel} className="grid gap-4 sm:grid-cols-[48px_120px_1fr] py-5 border-b border-border items-center"><span className="h-9 w-9 bg-secondary grid place-items-center text-xs font-bold">{index + 1}</span><h3 className="font-semibold">{flow.channel}</h3><p className="text-sm text-muted-foreground">{flow.steps}</p></article>)}</div>
            <div className="mt-8 grid sm:grid-cols-5 gap-3">{[[Phone,"Calls"],[Bot,"Chatbot"],[Mail,"Email"],[MessageCircle,"WhatsApp"],[Users,"Social"]].map(([Icon,label]: any) => <div key={label} className="border border-border p-4 text-center"><Icon className="h-5 w-5 mx-auto text-primary"/><p className="text-xs font-bold mt-3">{label}</p></div>)}</div>
          </section>

          <section id="commerce" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="10 · Shopify & ordering" title="Catalogue first. Checkout only after operational acceptance." intro="Shopify is a strong platform option, but it has not been selected by the source material and must be compared against NMS requirements before procurement." />
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="bg-primary text-primary-foreground p-7"><Store className="h-7 w-7 text-accent"/><p className="eyebrow mt-8 text-primary-foreground/60">Stage 1</p><h3 className="display-title text-3xl mt-3">Verified discovery</h3><p className="mt-4 text-primary-foreground/72 leading-7">Approved catalogue, educational library, stockist locator, trade enquiry/portal and customer-care routes. No unverified products or prices.</p></article>
              <article className="border border-border p-7 bg-card"><ShoppingBag className="h-7 w-7 text-primary"/><p className="eyebrow mt-8 text-primary">Stage 2</p><h3 className="display-title text-3xl mt-3">Controlled ordering</h3><p className="mt-4 text-muted-foreground leading-7">Approved SKUs, stock and ZAR pricing; tested payments, delivery, refunds, support, privacy, consent, security, analytics and lot/recall linkage.</p></article>
            </div>
            <div className="mt-6 grid md:grid-cols-3 border-l border-t border-border">{["PIM remains the source of truth","End-to-end test orders and refunds","No subscriptions until repeat and regimen fit are proved"].map(item => <div key={item} className="p-5 border-r border-b border-border flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0"/><p className="text-sm">{item}</p></div>)}</div>
          </section>

          <section id="risks" className="section-anchor p-6 sm:p-10 lg:p-14 bg-muted/45 border-b border-border">
            <SectionHeading eyebrow="11 · Risks & controls" title="Uncertainty is a control condition—not a gap to fill with creative copy." intro="The proposal converts each material uncertainty into an owner, gate and evidence requirement." />
            <div className="overflow-x-auto bg-card border border-border"><table className="w-full min-w-[760px] text-left"><thead><tr className="bg-primary text-primary-foreground text-xs uppercase tracking-wider"><th className="p-4">Risk</th><th className="p-4">Consequence</th><th className="p-4">Control</th></tr></thead><tbody>{risks.map(([risk, consequence, control]) => <tr key={risk} className="border-t border-border align-top"><td className="p-4 font-semibold text-sm">{risk}</td><td className="p-4 text-sm text-muted-foreground">{consequence}</td><td className="p-4 text-sm">{control}</td></tr>)}</tbody></table></div>
          </section>

          <section id="costing" className="section-anchor p-6 sm:p-10 lg:p-14 border-b border-border">
            <SectionHeading eyebrow="12 · Indicative proposal framework" title="Price the verified scope—not the contradictions." intro="No final prices are adopted here. The inherited cost models use different scopes, currencies, exclusions and commercial structures and cannot be stacked." />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 border-l border-t border-border">{costBlocks.map((block, index) => <div key={block} className="p-5 border-r border-b border-border min-h-32"><span className="text-[10px] text-primary font-bold">{String(index + 1).padStart(2,"0")}</span><p className="font-semibold mt-5">{block}</p></div>)}</div>
            <div className="mt-8 bg-accent text-accent-foreground p-6"><p className="font-semibold">Final proposal method</p><p className="mt-2 leading-7">Each block receives low/base/high estimates, tax treatment, contingency, dependencies, exclusions, acceptance criteria and a payment gate. Leadership then selects a stage-gated project, recurring programme or hybrid—never all source scenarios added together.</p></div>
          </section>

          <section id="decisions" className="section-anchor p-6 sm:p-10 lg:p-14 bg-primary text-primary-foreground">
            <div className="grid gap-8 lg:grid-cols-[.7fr_.3fr] lg:items-end"><div><p className="eyebrow text-accent">13 · Conclusion & decisions</p><h2 className="display-title text-4xl sm:text-6xl mt-4">Heritage creates attention. Accountability creates the right to scale.</h2><p className="mt-6 max-w-3xl text-primary-foreground/72 leading-8">The defensible path is to verify the business, quarantine unsupported claims, choose a small hero range, build a modular accountable identity, launch a governed information and service platform, pilot in Gauteng and scale only what proves safe, repeatable and contributive.</p></div><button onClick={() => setDecisionRail(true)} className="bg-accent text-accent-foreground p-5 font-bold flex items-center justify-between">Record executive decisions <ArrowRight className="h-5 w-5"/></button></div>
            <div className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 border-l border-t border-primary-foreground/20">{["Confirm legal entity & ownership","Approve heritage treatment","Select hero portfolio at Gate B","Choose theme, logo and commerce gate"].map((item,index) => <div key={item} className="p-5 border-r border-b border-primary-foreground/20"><span className="text-xs text-accent font-bold">0{index+1}</span><p className="mt-6">{item}</p></div>)}</div>
          </section>

          <footer className="p-6 sm:p-10 bg-[#18251f] text-white/65 flex flex-col sm:flex-row gap-4 justify-between text-xs"><p>Prepared by JB3AI for Natural Medicinal Services leadership.</p><p>Working proposal · Not legal, medical, regulatory, tax or investment advice.</p></footer>
        </main>
      </div>

      {vaultOpen && <DocumentVault reviewer={reviewer} onSetReviewer={saveReviewer} onChangeReviewer={changeReviewer} documents={vaultDocuments} reviews={vault.data?.reviews ?? []} loading={vault.isLoading} onClose={requestVaultClose} />}

      {reminderAction && <div className="fixed inset-0 z-[95] grid place-items-center p-5"><button className="absolute inset-0 bg-black/60" aria-label="Return to document vault" onClick={() => setReminderAction(null)} /><div className="relative w-full max-w-lg bg-card text-card-foreground border border-border p-7 sm:p-9 soft-panel"><AlertTriangle className="h-8 w-8 text-accent" /><p className="eyebrow text-primary mt-7">Review reminder</p><h2 className="display-title text-3xl mt-3">You still have {remainingDocuments} {remainingDocuments === 1 ? "document" : "documents"} to complete.</h2><p className="mt-4 text-muted-foreground leading-7">{remainingDownloads} still {remainingDownloads === 1 ? "needs" : "need"} to be downloaded and {remainingReads} still {remainingReads === 1 ? "needs" : "need"} to be marked as read.</p><div className="mt-7 grid sm:grid-cols-2 gap-2"><Button variant="outline" onClick={confirmReminderAction}>{reminderAction === "logout" ? "Lock anyway" : "Close anyway"}</Button><Button onClick={() => { setReminderAction(null); setVaultOpen(true); }}>Continue review</Button></div></div></div>}

      {decisionRail && <div className="fixed inset-0 z-[80]"><button aria-label="Close decision register" className="absolute inset-0 bg-black/50" onClick={() => setDecisionRail(false)} /><aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-card text-card-foreground overflow-y-auto soft-panel"><div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border p-5 flex items-start justify-between"><div><p className="eyebrow text-primary">Executive register</p><h2 className="display-title text-3xl mt-2">Client decisions</h2><p className="text-xs text-muted-foreground mt-2">Shared across the PIN-protected NMS client session.</p></div><button onClick={() => setDecisionRail(false)} className="h-9 w-9 border border-border grid place-items-center"><X className="h-4 w-4" /></button></div><div className="p-5 sm:p-7">{decisionAreas.map(item => <DecisionCard key={item.area} {...item} existing={decisionMap.get(item.area)} onSaved={() => decisions.refetch()} />)}</div></aside></div>}
    </div>
  );
}
