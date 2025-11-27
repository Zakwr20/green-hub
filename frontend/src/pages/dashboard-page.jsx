import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, AlertTriangle } from "lucide-react";
import { getPlantStatistics, listPlants } from "@/api/plants";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const formatLabel = (value) => {
  if (!value) return "Tidak diketahui";
  return value
    .toString()
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentPlants, setRecentPlants] = useState([]);
  const [attentionPlants, setAttentionPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, recentRes] = await Promise.all([
          getPlantStatistics(),
          listPlants({ limit: 16, sort_by: "created_at", sort_order: "desc" }),
        ]);

        const statsPayload = statsRes.data?.stats || statsRes.data;
        setStats(statsPayload);

        const recent = recentRes.data?.data || [];
        setRecentPlants(recent);
        setAttentionPlants(
          recent.filter(
            (p) => p.status === "sakit" || p.status === "mati",
          ),
        );
      } catch (err) {
        setError(err.message || "Gagal memuat statistik");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const byType = stats?.by_type || {};
  const byStatus = stats?.by_status || {};
  const total = stats?.total || 0;
  const alive = byStatus.hidup || 0;
  const flowering = byStatus.berbunga || 0;
  const attention = (byStatus.sakit || 0) + (byStatus.mati || 0);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <section className="w-full space-y-6">
        <header className="space-y-1">
          <h1 className="font-heading text-base font-semibold tracking-tight">
            Hari Ini di Koleksi Anda
          </h1>
          <p className="text-xs text-muted-foreground">
            Lihat sekilas kesehatan tanaman, yang baru ditambahkan, dan yang
            butuh perhatian.
          </p>
        </header>

        <div className="space-y-5">
          {loading && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Skeleton className="h-20 flex-1" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {!loading && !error && stats && (
            <>
              {/* Hero */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-lg bg-linear-to-br from-emerald-100/95 via-emerald-50/95 to-emerald-50/40 px-3 py-2 dark:from-emerald-400/15 dark:via-emerald-300/10 dark:to-emerald-200/5">
                  <span className="text-[11px] text-emerald-900/75 dark:text-emerald-100/80">
                    Total tanaman
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-emerald-950 dark:text-emerald-50">
                      {total}
                    </span>
                    {flowering > 0 && (
                      <span className="text-[11px] text-emerald-900/80 dark:text-emerald-100/80">
                        {flowering} berbunga
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 rounded-lg bg-muted/70 px-3 py-2 dark:bg-muted/60">
                  <span className="text-[11px] text-muted-foreground">
                    Sehat
                  </span>
                  <span className="text-xl font-semibold">{alive}</span>
                </div>

                <div className="flex flex-col gap-1 rounded-lg bg-amber-100/85 px-3 py-2 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100">
                  <span className="text-[11px] text-amber-800/90 dark:text-amber-100/85">
                    Perlu perhatian
                  </span>
                  <span className="text-xl font-semibold">{attention}</span>
                </div>
              </div>

              {/* Needs attention */}
              {attentionPlants.length > 0 && (
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Perlu perhatian hari ini
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 text-[11px] text-muted-foreground hover:text-foreground"
                      onClick={() => navigate("/plants?status=sakit")}
                    >
                      Lihat semua
                    </Button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {attentionPlants.slice(0, 6).map((plant) => (
                      <button
                        key={plant.id}
                        type="button"
                        onClick={() => navigate(`/plants/${plant.id}`)}
                        className="min-w-36 flex-1 rounded border border-border/40 bg-background/80 px-3 py-2 text-left text-xs hover:border-foreground/60"
                      >
                        <div className="line-clamp-1 font-medium">
                          {plant.plant_name}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-1.5 py-0.5 text-[10px] text-amber-900">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{formatLabel(plant.status)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Recently added */}
              {recentPlants.length > 0 && (
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Baru ditambahkan
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-0 text-[11px] text-muted-foreground hover:text-foreground"
                      onClick={() => navigate("/plants")}
                    >
                      Semua tanaman
                    </Button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {recentPlants.slice(0, 8).map((plant) => (
                      <button
                        key={plant.id}
                        type="button"
                        onClick={() => navigate(`/plants/${plant.id}`)}
                        className="min-w-36 flex-1 rounded border border-border/40 bg-background px-3 py-2 text-left text-xs hover:border-foreground/60"
                      >
                        <div className="line-clamp-1 font-medium">
                          {plant.plant_name}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Leaf className="h-3 w-3" />
                          <span>{formatLabel(plant.plant_type)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Types and status charts */}
              <div className="space-y-3">
                <section className="space-y-1.5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Tipe Tanaman
                  </h2>
                  {Object.keys(byType).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Belum ada data tipe.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(byType).map(([type, count]) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            navigate(
                              `/plants?plant_type=${encodeURIComponent(type)}`,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-foreground/50 hover:text-foreground"
                        >
                          <Leaf className="h-3 w-3" />
                          <span>{formatLabel(type)}</span>
                          <span className="text-[10px] text-foreground/70">
                            {count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                <section className="space-y-1.5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Status Tanaman
                  </h2>
                  {Object.keys(byStatus).length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Belum ada data status.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {Object.entries(byStatus).map(([status, count]) => {
                        const pct = total ? Math.round((count / total) * 100) : 0;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() =>
                              navigate(`/plants?status=${encodeURIComponent(status)}`)
                            }
                            className="w-full rounded border border-border/40 px-2.5 py-1.5 text-left text-xs hover:border-foreground/50"
                          >
                            <div className="mb-1 flex items-center justify-between">
                              <div className="inline-flex items-center gap-1 text-muted-foreground">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{formatLabel(status)}</span>
                              </div>
                              <span className="text-[11px] font-medium text-foreground">
                                {count}
                                {total > 0 && (
                                  <span className="ml-1 text-muted-foreground">
                                    ({pct}%)
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="h-1.5 w-full rounded bg-muted">
                              <div
                                className="h-1.5 rounded bg-foreground/70"
                                style={{ width: `${pct || 0}%` }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                {total === 0 && (
                  <section className="mt-2 rounded bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    Belum ada tanaman di koleksi Anda. Tambahkan tanaman pertama
                    untuk mulai memantau kesehatan dan kebutuhannya.
                  </section>
                )}
              </div>
            </>
          )}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              size="sm"
              className="flex-1"
              onClick={() => navigate("/plants")}
            >
              Lihat semua tanaman
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/plants/new")}
            >
              Tambah tanaman baru
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
