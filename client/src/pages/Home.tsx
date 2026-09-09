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
          <p className="mt-4 max-w-3xl text-muted-foreground leading-7">Watch the three executive perspectives on the upcoming relaunch of the NMS portal.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proposalVideos.map(video => (
          <article key={video.id} className="bg-card border border-border p-5">
            <div className="aspect-video bg-secondary rounded-lg mb-4 flex items-center justify-center">
              {activeVideo?.id === video.id ? (
                <div className="w-full h-full flex items-center justify-center">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button
                  onClick={() => setActiveId(video.id)}
                  className="w-full h-full flex items-center justify-center"
                >
                  <Play className="h-12 w-12 text-primary" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
            <p className="text-sm text-muted-foreground">{video.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProposalOverview() {
  return (
    <section id="overview" className="section-anchor p-6 sm:p-10 lg:p-14">
      <SectionHeading
        eyebrow="01 · Strategic overview"
        title="The NMS portal: a new digital experience"
        intro="The NMS portal represents a fundamental shift in how we engage with our clients, offering a modern, intuitive interface for accessing and reviewing our strategic proposals."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article className="border border-border p-7 bg-card">
          <BookOpen className="h-7 w-7 text-primary" />
          <p className="eyebrow mt-8 text-primary">Stage 1</p>
          <h3 className="display-title text-3xl mt-3">Strategic foundation</h3>
          <p className="mt-4 text-muted-foreground leading-7">Complete business case, stakeholder alignment, governance framework, and risk assessment.</p>
        </article>
        <article className="border border-border p-7 bg-card">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <p className="eyebrow mt-8 text-primary">Stage 2</p>
          <h3 className="display-title text-3xl mt-3">Controlled ordering</h3>
          <p className="mt-4 text-muted-foreground leading-7">Approved SKUs, stock and ZAR pricing; tested payments, delivery, refunds, support, privacy, consent, security, analytics and lot/recall linkage.</p>
        </article>
        <article className="border border-border p-7 bg-card">
          <Sparkles className="h-7 w-7 text-primary" />
          <p className="eyebrow mt-8 text-primary">Stage 3</p>
          <h3 className="display-title text-3xl mt-3">Digital transformation</h3>
          <p className="mt-4 text-muted-foreground leading-7">Implementation of the new portal, training, adoption, and continuous improvement based on user feedback.</p>
        </article>
      </div>
    </section>
  );
}

function ProductFeatures() {
  return (
    <section id="features" className="section-anchor p-6 sm:p-10 lg:p-14 bg-[#18251f] text-white border-b border-white/15">
      <SectionHeading
        eyebrow="02 · Product features"
        title="Enhanced capabilities for strategic engagement"
        intro="The NMS portal offers a comprehensive suite of tools designed to streamline collaboration and enhance decision-making processes."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {productCriteria.map((item, index) => (
          <article key={index} className="border border-white/15 p-6 bg-card/50">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary text-primary-foreground grid place-items-center rounded-md flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComplianceFramework() {
  return (
    <section id="compliance" className="section-anchor p-6 sm:p-10 lg:p-14">
      <SectionHeading
        eyebrow="03 · Compliance framework"
        title="Governance and regulatory alignment"
        intro="Our portal adheres to the highest standards of data protection, security, and regulatory compliance."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complianceLayers.map((layer, index) => (
          <article key={index} className="border border-border p-7 bg-card">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h3 className="text-xl font-semibold mt-6">{layer.title}</h3>
            <p className="mt-4 text-muted-foreground">{layer.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EngagementModel() {
  return (
    <section id="engagement" className="section-anchor p-6 sm:p-10 lg:p-14 bg-[#18251f] text-white border-b border-white/15">
      <SectionHeading
        eyebrow="04 · Engagement model"
        title="Collaborative decision-making process"
        intro="Our engagement model facilitates transparent communication and collaborative decision-making among stakeholders."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {engagementFlows.map((flow, index) => (
          <article key={index} className="border border-white/15 p-6 bg-card/50">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary text-primary-foreground grid place-items-center rounded-md flex-shrink-0">
                {flow.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{flow.title}</h3>
                <p className="mt-2 text-muted-foreground">{flow.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MarketingChannels() {
  return (
    <section id="channels" className="section-anchor p-6 sm:p-10 lg:p-14">
      <SectionHeading
        eyebrow="05 · Marketing channels"
        title="Integrated communication strategy"
        intro="Our marketing channels are designed to reach stakeholders through their preferred communication methods."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketingChannels.map((channel, index) => (
          <article key={index} className="border border-border p-7 bg-card">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary text-primary-foreground grid place-items-center rounded-md flex-shrink-0">
                {channel.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{channel.title}</h3>
                <p className="mt-4 text-muted-foreground">{channel.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RiskAssessment() {
  return (
    <section id="risks" className="section-anchor p-6 sm:p-10 lg:p-14 bg-[#18251f] text-white border-b border-white/15">
      <SectionHeading
        eyebrow="06 · Risk assessment"
        title="Proactive risk management"
        intro="We maintain a comprehensive risk assessment framework to identify, evaluate, and mitigate potential risks."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {risks.map((risk, index) => (
          <article key={index} className="border border-white/15 p-6 bg-card/50">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-primary text-primary-foreground grid place-items-center rounded-md flex-shrink-0">
                {risk.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{risk.title}</h3>
                <p className="mt-2 text-muted-foreground">{risk.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ area, selection, note, status });
  };

  return (
    <article className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{label}</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            status === "draft" ? "bg-yellow-100 text-yellow-800" :
            status === "needs_discussion" ? "bg-blue-100 text-blue-800" :
            "bg-green-100 text-green-800"
          }`}>
            {status}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Select your decision:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map(option => (
              <label key={option} className="flex items-center gap-2 p-2 border border-border rounded-md cursor-pointer hover:bg-secondary">
                <input
                  type="radio"
                  name={`decision-${area}`}
                  checked={selection === option}
                  onChange={() => setSelection(option)}
                  className="sr-only"
                />
                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  selection === option ? "border-primary bg-primary" : "border-border"
                }`}>
                  {selection === option && <span className="h-2 w-2 rounded-full bg-white"></span>}
                </span>
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Add notes (optional):</p>
          <Textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add any additional notes..."
            className="mt-2"
            rows={3}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={e => setStatus(e.target.value as DecisionStatus)}
              className="text-xs border border-border bg-transparent px-2 py-1 rounded"
            >
              <option value="draft">Draft</option>
              <option value="needs_discussion">Needs Discussion</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Saving..." : "Save Decision"}
          </Button>
        </div>
      </form>
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
  
  // Removed PIN-related trpc calls and authentication logic
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
    else {
      // Removed PIN logout logic - now just clears reviewer
      localStorage.removeItem("nms-vault-reviewer");
      setReviewer(null);
    }
  };
  const confirmReminderAction = () => {
    const action = reminderAction;
    setReminderAction(null);
    if (action === "logout") {
      localStorage.removeItem("nms-vault-reviewer");
      setReviewer(null);
    } else if (action === "close") {
      setVaultOpen(false);
    }
  };

  const recordEvent = (documentId: string, event: "opened" | "downloaded" | "read" | "unread") => {
    if (!reviewer) return;
    
    const review = vaultReviewMap.get(documentId);
    const now = new Date();
    
    const update = {
      documentId,
      reviewerId: reviewer.id,
      [event]: event === "unread" ? null : now,
    };
    
    trpc.vault.update.useMutation().mutate(update, {
      onSuccess: () => {
        utils.vault.list.setData(vaultInput, prev => {
          if (!prev) return prev;
          
          const updatedReviews = [...prev.reviews];
          const existingIndex = updatedReviews.findIndex(r => r.documentId === documentId);
          
          if (existingIndex >= 0) {
            updatedReviews[existingIndex] = {
              ...updatedReviews[existingIndex],
              [event]: event === "unread" ? null : now,
            };
          } else {
            updatedReviews.push({
              documentId,
              openedAt: event === "opened" ? now : null,
              downloadedAt: event === "downloaded" ? now : null,
              readAt: event === "read" ? now : null,
            });
          }
          
          return {
            ...prev,
            reviews: updatedReviews,
          };
        });
      },
    });
  };

  const previewPdf = (document: VaultDocument) => {
    setPreviewDocument(document);
  };

  const [previewDocument, setPreviewDocument] = useState<VaultDocument | null>(null);

  const loading = !reviewer || !decisions.data || !vault.data;

  const progress = useMemo(() => ({
    opened: vaultProgress.completed.filter(id => {
      const review = vaultReviewMap.get(id);
      return review?.openedAt;
    }).length,
    downloaded: vaultProgress.completed.filter(id => {
      const review = vaultReviewMap.get(id);
      return review?.downloadedAt;
    }).length,
    read: vaultProgress.completed.filter(id => {
      const review = vaultReviewMap.get(id);
      return review?.readAt;
    }).length,
  }), [vaultProgress, vaultReviewMap]);

  const documents = vaultDocuments.sort((a, b) => {
    const aIndex = complianceLayers.findIndex(layer => layer.title === a.category);
    const bIndex = complianceLayers.findIndex(layer => layer.title === b.category);
    return aIndex - bIndex;
  });

  const reviewMap = useMemo(() => new Map(vault.data?.reviews.map(review => [review.documentId, review]) ?? []), [vault.data?.reviews]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="md:hidden h-10 w-10 flex items-center justify-center border border-border rounded-md"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <span className="font-bold text-xl">NMS Portal</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <nav className="flex items-center gap-6">
                {navigation.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                    <UserRound className="h-4 w-4" />
                  </div>
                  {reviewer ? (
                    <span className="text-sm font-medium">{reviewer.name}</span>
                  ) : (
                    <span className="text-sm font-medium">Guest</span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={requestLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            <div className="md:hidden flex items-center gap-2">
              <div className="h-8 w-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
                <UserRound className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileNav && (
          <div className="md:hidden border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navigation.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileNav(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" onClick={requestLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!reviewer ? (
          // Login Screen - Removed PIN authentication
          <div className="max-w-2xl mx-auto mt-16">
            <div className="text-center mb-12">
              <h1 className="display-title text-4xl sm:text-5xl lg:text-6xl mb-6">Welcome to NMS Portal</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access your strategic documents and collaborate with the team
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Continue as Reviewer</h2>
              <p className="text-muted-foreground mb-6">
                Enter your name to access the document vault and participate in the review process.
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get("name") as string;
                if (name.trim()) {
                  saveReviewer(name.trim());
                }
              }}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    className="text-lg py-6"
                  />
                </div>
                
                <Button type="submit" className="w-full py-6 text-lg">
                  Access Vault
                </Button>
              </form>
            </div>
          </div>
        ) : (
          // Main Dashboard
          <>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="display-title text-3xl sm:text-4xl">Document Vault</h1>
                <p className="text-muted-foreground mt-2">Review, download, and confirm each document</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setVaultOpen(true)}>
                  <FileArchive className="h-4 w-4 mr-2" />
                  View Vault
                </Button>
                <Button variant="outline" onClick={() => setDecisionRail(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Executive Register
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 xl:grid-cols-[.68fr_.32fr] xl:items-end mb-8">
              <div>
                <p className="eyebrow text-primary">Edited client originals · 8 controlled files</p>
                <h1 className="display-title text-4xl sm:text-6xl mt-4">Review, download and confirm each document.</h1>
                <p className="mt-5 max-w-3xl text-muted-foreground leading-7">
                  These are the user-edited originals supplied on 18 August 2026—not the earlier master documents produced by Manus.
                </p>
              </div>
              <div className="bg-primary text-primary-foreground p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-primary-foreground/60">Reviewing as</p>
                    <p className="font-semibold mt-1">{reviewer.name}</p>
                  </div>
                  <button onClick={changeReviewer} className="text-xs underline underline-offset-4">Change</button>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-primary-foreground/20 text-center">
                  <div>
                    <p className="text-2xl font-semibold">{progress.opened}</p>
                    <p className="text-[10px] text-primary-foreground/60 mt-1">opened</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{progress.downloaded}</p>
                    <p className="text-[10px] text-primary-foreground/60 mt-1">downloaded</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{progress.read}</p>
                    <p className="text-[10px] text-primary-foreground/60 mt-1">read</p>
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="py-24 grid place-items-center">
                <Leaf className="h-7 w-7 text-primary animate-pulse" />
              </div>
            ) : (
              <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {documents.map((document, index) => {
                  const review = reviewMap.get(document.id);
                  return (
                    <article key={document.id} className="bg-card border border-border p-5 sm:p-6 flex flex-col min-h-[340px]">
                      <div className="flex items-start justify-between gap-4">
                        <span className="h-11 w-11 bg-secondary text-secondary-foreground grid place-items-center">
                          <FileText className="h-5 w-5" />
                        </span>
                        <div className="flex gap-1.5">
                          <span 
                            title={review?.openedAt ? "Opened" : "Not opened"} 
                            className={`h-7 w-7 grid place-items-center border ${review?.openedAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </span>
                          <span 
                            title={review?.downloadedAt ? "Downloaded" : "Not downloaded"} 
                            className={`h-7 w-7 grid place-items-center border ${review?.downloadedAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}
                          >
                            <Download className="h-3.5 w-3.5" />
                          </span>
                          <span 
                            title={review?.readAt ? "Marked read" : "Not marked read"} 
                            className={`h-7 w-7 grid place-items-center border ${review?.readAt ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                      <p className="eyebrow text-primary mt-6">{String(index + 1).padStart(2, "0")} · {document.category}</p>
                      <h3 className="text-xl font-semibold mt-3 leading-7">{document.title}</h3>
                      <p className="text-sm text-muted-foreground mt-3 leading-6">{document.description}</p>
                      <p className="text-xs text-muted-foreground mt-4">{document.type} · {document.size}</p>
                      <div className="mt-auto pt-6 grid grid-cols-2 gap-2">
                        {document.type === "PDF" ? (
                          <button 
                            onClick={() => previewPdf(document)} 
                            className="border border-border px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary"
                          >
                            <Eye className="h-4 w-4" /> Preview
                          </button>
                        ) : (
                          <a 
                            href={appUrl(document.url)} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => recordEvent(document.id, "opened")} 
                            className="border border-border px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary"
                          >
                            <ExternalLink className="h-4 w-4" /> Open
                          </a>
                        )}
                        <a 
                          href={appUrl(document.url)} 
                          download={document.filename} 
                          onClick={() => recordEvent(document.id, "downloaded")} 
                          className="bg-primary text-primary-foreground px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" /> Download
                        </a>
                        <button 
                          onClick={() => recordEvent(document.id, review?.readAt ? "unread" : "read")} 
                          className={`col-span-2 px-3 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border ${review?.readAt ? "border-primary text-primary" : "border-border"}`}
                        >
                          <CheckCircle2 className="h-4 w-4" /> {review?.readAt ? "Marked as read" : "Mark as read"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Vault Modal */}
      {vaultOpen && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Document Vault</h2>
              <button 
                onClick={() => setVaultOpen(false)} 
                className="h-8 w-8 border border-border grid place-items-center rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {vaultDocuments.map(document => (
                  <article key={document.id} className="border border-border p-4 rounded-md">
                    <div className="flex items-start gap-3">
                      <span className="h-10 w-10 bg-secondary text-secondary-foreground grid place-items-center rounded-md">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold">{document.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{document.type} · {document.size}</p>
                        <p className="text-xs text-muted-foreground mt-2">{document.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end">
              <Button onClick={() => setVaultOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Rail */}
      {decisionRail && (
        <div className="fixed inset-0 z-[80]">
          <button 
            aria-label="Close decision register" 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setDecisionRail(false)} 
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-card text-card-foreground overflow-y-auto soft-panel">
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border p-5 flex items-start justify-between">
              <div>
                <p className="eyebrow text-primary">Executive register</p>
                <h2 className="display-title text-3xl mt-2">Client decisions</h2>
                <p className="text-xs text-muted-foreground mt-2">Shared across the NMS client session.</p>
              </div>
              <button onClick={() => setDecisionRail(false)} className="h-9 w-9 border border-border grid place-items-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 sm:p-7">
              {decisionAreas.map(item => (
                <DecisionCard 
                  key={item.area} 
                  {...item} 
                  existing={decisionMap.get(item.area)} 
                  onSaved={() => decisions.refetch()} 
                />
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Reminder Action Modal */}
      {reminderAction && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <h3 className="text-lg font-bold">Pending Actions</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                {reminderAction === "close" 
                  ? "You have documents that haven't been reviewed yet. Are you sure you want to close the vault?"
                  : "You have documents that haven't been reviewed yet. Are you sure you want to log out?"}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setReminderAction(null)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={confirmReminderAction} 
                  className="flex-1"
                >
                  {reminderAction === "close" ? "Close Vault" : "Logout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-[90] bg-[#111815] text-white flex flex-col">
          <header className="shrink-0 min-h-18 px-4 sm:px-6 py-3 border-b border-white/15 flex flex-wrap items-center gap-3">
            <span className="h-10 w-10 bg-accent text-accent-foreground grid place-items-center">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[.14em] text-white/50">In-browser PDF preview</p>
              <h3 className="font-semibold truncate mt-1">{previewDocument.title}</h3>
            </div>
            <a 
              href={appUrl(previewDocument.url)} 
              target="_blank" 
              rel="noreferrer" 
              className="h-10 px-3 border border-white/20 text-xs font-bold flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
            <a 
              href={appUrl(previewDocument.url)} 
              download={previewDocument.filename} 
              onClick={() => recordEvent(previewDocument.id, "downloaded")} 
              className="h-10 px-3 bg-accent text-accent-foreground text-xs font-bold flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button 
              onClick={() => setPreviewDocument(null)} 
              aria-label="Close PDF preview" 
              className="h-10 w-10 border border-white/20 grid place-items-center"
            >
              <X className="h-4 w-4" />
            </button>
          </header>
          <div className="flex-1 min-h-0 bg-[#252b28] p-2 sm:p-4">
            <iframe 
              src={`${appUrl(previewDocument.url)}#toolbar=1&navpanes=0&view=FitH`} 
              title={`Preview of ${previewDocument.title}`} 
              className="h-full w-full bg-white border-0" 
            />
          </div>
          <footer className="shrink-0 px-4 sm:px-6 py-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-white/55">If your browser blocks embedded PDFs, use “Open in new tab”.</p>
            <button 
              onClick={() => { 
                recordEvent(previewDocument.id, reviewMap.get(previewDocument.id)?.readAt ? "unread" : "read"); 
              }} 
              className={`px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 border ${reviewMap.get(previewDocument.id)?.readAt ? "border-accent text-accent" : "border-white/25"}`}
            >
              <CheckCircle2 className="h-4 w-4" /> 
              {reviewMap.get(previewDocument.id)?.readAt ? "Marked as read" : "Mark as read"}
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}