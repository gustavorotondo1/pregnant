"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

interface ContractionEntry {
  id: number;
  startedAt: number;
  duration: number; // ms
  interval: number | null; // ms since last contraction ended
}

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  if (min > 0) {
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
  }
  return `${sec.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min}m ${sec.toString().padStart(2, "0")}s`;
  return `${totalSec}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function ContractionsPage() {
  const [active, setActive] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [intervalMs, setIntervalMs] = useState(0); // time since last contraction ended
  const [history, setHistory] = useState<ContractionEntry[]>([]);
  const startRef = useRef<number | null>(null);
  const lastEndRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current !== null) {
      setElapsedMs(Date.now() - startRef.current);
    }
    if (lastEndRef.current !== null && startRef.current === null) {
      setIntervalMs(Date.now() - lastEndRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const start = useCallback(() => {
    startRef.current = Date.now();
    setElapsedMs(0);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    if (!startRef.current) return;
    const now = Date.now();
    const duration = now - startRef.current;
    const intervalFromLast = lastEndRef.current ? startRef.current - lastEndRef.current : null;

    lastEndRef.current = now;

    setHistory((prev) => {
      const entry: ContractionEntry = {
        id: now,
        startedAt: startRef.current!,
        duration,
        interval: intervalFromLast,
      };
      const next = [entry, ...prev];

      const recent = next.slice(0, 3);
      if (
        recent.length === 3 &&
        recent.every((c) => c.duration >= 45_000) &&
        recent.slice(1).every((c) => c.interval !== null && c.interval <= 300_000)
      ) {
        toast.warning("⚠️ Contrações regulares detectadas! Hora de ir para o hospital!", {
          autoClose: false,
          toastId: "contraction-alert",
        });
      }

      return next;
    });

    startRef.current = null;
    setElapsedMs(0);
    setActive(false);
  }, []);

  const reset = useCallback(() => {
    startRef.current = null;
    lastEndRef.current = null;
    setActive(false);
    setElapsedMs(0);
    setIntervalMs(0);
    setHistory([]);
  }, []);

  const recent = history.slice(0, 5);
  const avgIntervalMs =
    recent.filter((c) => c.interval !== null).length > 0
      ? recent.filter((c) => c.interval !== null).reduce((sum, c) => sum + c.interval!, 0) /
        recent.filter((c) => c.interval !== null).length
      : null;
  const avgDurationMs =
    recent.length > 0
      ? recent.reduce((sum, c) => sum + c.duration, 0) / recent.length
      : null;

  const isRegular =
    recent.length >= 3 &&
    recent.every((c) => c.duration >= 45_000) &&
    recent.slice(1).every((c) => c.interval !== null && c.interval <= 300_000);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Contador de contrações
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Registre o início e fim de cada contração para monitorar duração e intervalo.
        </p>
      </header>

      {isRegular && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          ⚠️ Contrações regulares detectadas! Consulte seu médico ou vá para o hospital.
        </div>
      )}

      {/* Cronômetros lado a lado */}
      <section className="grid gap-4 sm:grid-cols-2">
        {/* Duração da contração */}
        <Card className="flex flex-col items-center gap-3 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">
            {active ? "Contração em andamento" : "Duração"}
          </p>
          <div
            className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 transition-all ${
              active
                ? "border-[var(--brand-500)] bg-[var(--brand-100)] shadow-lg shadow-[var(--brand-200)]"
                : "border-[var(--border-1)] bg-[var(--surface-2)]"
            }`}
          >
            <span
              className={`font-mono text-3xl font-bold tabular-nums tracking-tight ${
                active ? "text-[var(--brand-700)]" : "text-[var(--text-3)]"
              }`}
            >
              {formatMs(active ? elapsedMs : (history[0]?.duration ?? 0))}
            </span>
            {!active && history.length > 0 && (
              <span className="mt-1 text-xs text-[var(--text-3)]">última</span>
            )}
          </div>
          {active && (
            <p className="text-xs text-[var(--text-2)]">
              Iniciada às {startRef.current ? formatTime(startRef.current) : "—"}
            </p>
          )}
        </Card>

        {/* Intervalo entre contrações */}
        <Card className="flex flex-col items-center gap-3 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-3)]">
            {!active && lastEndRef.current ? "Intervalo (desde fim)" : "Intervalo"}
          </p>
          <div
            className={`flex h-40 w-40 flex-col items-center justify-center rounded-full border-4 transition-all ${
              !active && lastEndRef.current
                ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
                : "border-[var(--border-1)] bg-[var(--surface-2)]"
            }`}
          >
            <span
              className={`font-mono text-3xl font-bold tabular-nums tracking-tight ${
                !active && lastEndRef.current ? "text-amber-700" : "text-[var(--text-3)]"
              }`}
            >
              {!active && lastEndRef.current
                ? formatMs(intervalMs)
                : history[0]?.interval != null
                ? formatDuration(history[0].interval)
                : "—"}
            </span>
            {!active && lastEndRef.current && (
              <span className="mt-1 text-xs text-amber-600">em andamento</span>
            )}
            {(!active || !lastEndRef.current) && history[0]?.interval != null && (
              <span className="mt-1 text-xs text-[var(--text-3)]">último</span>
            )}
          </div>
          {history.length > 0 && history[0].interval !== null && (
            <p className="text-xs text-[var(--text-2)]">
              Intervalo anterior: {formatDuration(history[0].interval)}
            </p>
          )}
        </Card>
      </section>

      {/* Botões */}
      <div className="flex justify-center gap-3">
        {!active ? (
          <Button onClick={start} className="px-10 py-3 text-base">
            ▶ Iniciar contração
          </Button>
        ) : (
          <Button
            onClick={stop}
            className="bg-[var(--brand-600)] px-10 py-3 text-base text-white hover:bg-[var(--brand-700)]"
          >
            ■ Fim da contração
          </Button>
        )}
        {history.length > 0 && !active && (
          <Button
            onClick={reset}
            className="border border-[var(--border-1)] bg-transparent px-6 text-[var(--text-2)] hover:bg-[var(--surface-2)]"
          >
            Reiniciar
          </Button>
        )}
      </div>

      {/* Estatísticas */}
      {history.length >= 2 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Total</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">{history.length}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Duração média</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">
              {avgDurationMs !== null ? formatDuration(avgDurationMs) : "—"}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Intervalo médio</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">
              {avgIntervalMs !== null ? formatDuration(avgIntervalMs) : "—"}
            </p>
          </Card>
        </section>
      )}

      {/* Histórico */}
      {history.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-semibold">Histórico das contrações</h2>
          <div className="space-y-2">
            {history.map((c, i) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border-1)] px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge>{i === 0 ? "Última" : `#${history.length - i}`}</Badge>
                  <span className="text-[var(--text-2)]">{formatTime(c.startedAt)}</span>
                </div>
                <div className="flex gap-4 text-right text-[var(--text-2)]">
                  <span>
                    <strong>Duração:</strong> {formatDuration(c.duration)}
                  </span>
                  {c.interval !== null && (
                    <span>
                      <strong>Intervalo:</strong> {formatDuration(c.interval)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--text-3)]">
            Alerta quando 3 contrações seguidas durarem ≥ 45s com intervalo ≤ 5 min.
          </p>
        </Card>
      )}
    </div>
  );
}


interface ContractionEntry {
  id: number;
  startedAt: number;
  duration: number; // seconds
  interval: number | null; // seconds since last contraction ended
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function ContractionsPage() {
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<ContractionEntry[]>([]);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    startRef.current = Date.now();
    setElapsed(0);
    setActive(true);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startRef.current ?? Date.now())) / 1000));
    }, 500);
  }, []);

  const stop = useCallback(() => {
    if (!startRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = Math.floor((Date.now() - startRef.current) / 1000);

    setHistory((prev) => {
      const lastEnd = prev.length > 0 ? prev[0].startedAt + prev[0].duration * 1000 : null;
      const interval = lastEnd ? Math.floor((startRef.current! - lastEnd) / 1000) : null;
      const entry: ContractionEntry = {
        id: Date.now(),
        startedAt: startRef.current!,
        duration,
        interval,
      };
      const next = [entry, ...prev];

      // Alerta: últimas 3 contrações com intervalo ≤ 5 min e duração ≥ 45s
      const recent = next.slice(0, 3);
      if (
        recent.length === 3 &&
        recent.every((c) => c.duration >= 45) &&
        recent.slice(1).every((c) => c.interval !== null && c.interval <= 300)
      ) {
        toast.warning("⚠️ Contrações regulares detectadas! Hora de ir para o hospital!", {
          autoClose: false,
          toastId: "contraction-alert",
        });
      }

      return next;
    });

    startRef.current = null;
    setActive(false);
    setElapsed(0);
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(false);
    setElapsed(0);
    setHistory([]);
    startRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const recent = history.slice(0, 5);
  const avgInterval =
    recent.filter((c) => c.interval !== null).length > 0
      ? Math.round(
          recent.filter((c) => c.interval !== null).reduce((sum, c) => sum + c.interval!, 0) /
            recent.filter((c) => c.interval !== null).length,
        )
      : null;
  const avgDuration =
    recent.length > 0
      ? Math.round(recent.reduce((sum, c) => sum + c.duration, 0) / recent.length)
      : null;

  const isRegular =
    recent.length >= 3 &&
    recent.every((c) => c.duration >= 45) &&
    recent.slice(1).every((c) => c.interval !== null && c.interval <= 300);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)" }}>
          Contador de contrações
        </h1>
        <p className="text-sm text-[var(--text-2)]">
          Registre o início e fim de cada contração para monitorar duração e intervalo.
        </p>
      </header>

      {isRegular && (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          ⚠️ Contrações regulares detectadas! Consulte seu médico ou vá para o hospital.
        </div>
      )}

      {/* Timer principal */}
      <Card className="flex flex-col items-center gap-4 py-8">
        <div
          className={`flex h-36 w-36 items-center justify-center rounded-full border-4 text-3xl font-bold tabular-nums transition-all ${
            active
              ? "border-[var(--brand-500)] bg-[var(--brand-100)] text-[var(--brand-700)]"
              : "border-[var(--border-1)] bg-[var(--surface-2)] text-[var(--text-3)]"
          }`}
        >
          {formatSeconds(elapsed)}
        </div>

        <div className="flex gap-3">
          {!active ? (
            <Button onClick={start} className="px-8">
              Iniciar contração
            </Button>
          ) : (
            <Button onClick={stop} className="bg-[var(--brand-600)] px-8 text-white hover:bg-[var(--brand-700)]">
              Fim da contração
            </Button>
          )}
          {history.length > 0 && !active && (
            <Button
              onClick={reset}
              className="border border-[var(--border-1)] bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)]"
            >
              Reiniciar
            </Button>
          )}
        </div>

        {active && (
          <p className="text-sm text-[var(--text-2)]">
            Iniciada às {startRef.current ? formatTime(startRef.current) : "—"}
          </p>
        )}
      </Card>

      {/* Estatísticas */}
      {history.length >= 2 && (
        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Total registradas</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">{history.length}</p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Duração média</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">
              {avgDuration !== null ? formatSeconds(avgDuration) : "—"}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">Intervalo médio</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-700)]">
              {avgInterval !== null ? formatSeconds(avgInterval) : "—"}
            </p>
          </Card>
        </section>
      )}

      {/* Histórico */}
      {history.length > 0 && (
        <Card>
          <h2 className="mb-3 text-base font-semibold">Histórico das contrações</h2>
          <div className="space-y-2">
            {history.map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border-1)] px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge>{i === 0 ? "Última" : `#${history.length - i}`}</Badge>
                  <span className="text-[var(--text-2)]">{formatTime(c.startedAt)}</span>
                </div>
                <div className="flex gap-4 text-right text-[var(--text-2)]">
                  <span>
                    <strong>Duração:</strong> {formatSeconds(c.duration)}
                  </span>
                  {c.interval !== null && (
                    <span>
                      <strong>Intervalo:</strong> {formatSeconds(c.interval)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--text-3)]">
            Alerta automático quando 3 contrações seguidas durarem ≥ 45s com intervalo ≤ 5 min.
          </p>
        </Card>
      )}
    </div>
  );
}
