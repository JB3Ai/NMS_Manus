import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowRight, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, PropsWithChildren, useEffect, useState } from "react";

export default function NmsAccessGate({ children }: PropsWithChildren) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [pin, setPin] = useState("");
  const status = trpc.nmsAccess.status.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const login = trpc.nmsAccess.login.useMutation({
    onSuccess: async () => {
      await status.refetch();
    },
  });

  useEffect(() => {
    if (status.data?.authenticated) {
      setAcknowledged(false);
      setPin("");
    }
  }, [status.data?.authenticated]);

  if (status.isLoading) {
    return (
      <main className="min-h-screen bg-[#111815] text-white grid place-items-center px-6">
        <div className="flex items-center gap-3 text-white/70" role="status" aria-live="polite">
          <LockKeyhole className="h-5 w-5 text-accent animate-pulse" />
          <span>Preparing the NMS client edition…</span>
        </div>
      </main>
    );
  }

  if (status.data?.authenticated) return <>{children}</>;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acknowledged || !pin.trim() || login.isPending) return;
    login.mutate({ pin: pin.trim(), acknowledged: true });
  };

  const errorMessage = login.error?.data?.code === "UNAUTHORIZED"
    ? "The PIN was not accepted. Check it and try again."
    : login.error?.message ?? (status.data?.configured === false ? "Access is temporarily unavailable. Please contact JB³." : null);

  return (
    <main className="min-h-screen bg-[#111815] text-white portal-grid">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-14">
        <section className="max-w-2xl">
          <div className="flex items-center gap-3 text-accent">
            <span className="grid h-10 w-10 place-items-center border border-accent/40 bg-accent/10">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="eyebrow">NMS · Controlled client edition</p>
          </div>
          <p className="eyebrow mt-14 text-white/50">Natural Medicinal Services · RSA</p>
          <h1 className="display-title mt-5 text-5xl leading-[.96] sm:text-7xl">Transformation &amp; accelerated growth plan.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/65">
            A private review portal for the NMS strategy, implementation plan, brand system and supporting client documents.
          </p>
          <div className="mt-12 grid gap-4 border-t border-white/15 pt-6 text-sm text-white/55 sm:grid-cols-2">
            <div>
              <p className="text-white/35">Access context</p>
              <p className="mt-2 leading-6">Temporary 30-day review access for the intended client audience.</p>
            </div>
            <div>
              <p className="text-white/35">Handling requirement</p>
              <p className="mt-2 leading-6">Confidential client material. Do not forward, reproduce or publish.</p>
            </div>
          </div>
        </section>

        <section className="border border-white/15 bg-[#f4f0e7] p-6 text-[#17251f] shadow-2xl sm:p-9" aria-labelledby="nms-access-heading">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="eyebrow text-[#667067]">NMS portal access</p>
              <h2 id="nms-access-heading" className="display-title mt-3 text-3xl sm:text-4xl">Certification remains the gate.</h2>
            </div>
            <LockKeyhole className="h-6 w-6 shrink-0 text-[#173f32]" aria-hidden="true" />
          </div>

          <div className="mt-8 border-l-2 border-[#c6923e] pl-4 text-sm leading-7 text-[#52605a]">
            <p>
              This NMS client edition is available for a limited 30-day review period. It is a once-off JB³ service prepared for the intended client review.
            </p>
            <p className="mt-4">
              The material and information within it may not be shared, reproduced, published or used outside this review without written permission from JB³.
            </p>
            <p className="mt-4 text-xs text-[#667067]">
              This is a client-side access prompt for controlled temporary access, not a substitute for secure handling of the source material. Please do not forward the page link or PIN.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <label className="flex items-start gap-3 text-sm leading-6 text-[#52605a]">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={event => setAcknowledged(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#173f32]"
              />
              <span>I acknowledge the 30-day, once-off, confidential-use terms.</span>
            </label>

            <div>
              <label htmlFor="nms-client-pin" className="eyebrow text-[#667067]">Client PIN</label>
              <Input
                id="nms-client-pin"
                name="pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                value={pin}
                onChange={event => setPin(event.target.value)}
                placeholder="Enter client PIN"
                aria-describedby={errorMessage ? "nms-access-error" : undefined}
                className="mt-3 h-14 border-[#c9c0ad] bg-white text-lg tracking-[.22em] text-[#17251f] placeholder:tracking-normal"
              />
            </div>

            {errorMessage && (
              <p id="nms-access-error" role="alert" className="flex items-start gap-2 text-sm leading-6 text-[#ad493d]">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            <Button
              type="submit"
              disabled={!acknowledged || !pin.trim() || login.isPending || status.data?.configured === false}
              className="h-14 w-full justify-between bg-[#173f32] px-5 text-base text-white hover:bg-[#244f41] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span>{login.isPending ? "Checking access…" : "Open NMS Portal"}</span>
              {login.isPending ? <Check className="h-5 w-5 animate-pulse" /> : <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[#667067]">Access question? Contact the client or JB³.</p>
        </section>
      </div>
    </main>
  );
}
