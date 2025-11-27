import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Leaf, AlertTriangle, Search, Plus } from "lucide-react";
import { listPlants, deletePlant } from "../api/plants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Skeleton } from "../components/ui/skeleton";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loadPlants = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = searchParams.get("status") || undefined;
      const plantType = searchParams.get("plant_type") || undefined;

      const res = await listPlants({
        search,
        status,
        plant_type: plantType,
      });
      setPlants(res.data?.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat tanaman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus tanaman ini?")) return;
    try {
      await deletePlant(id);
      await loadPlants();
    } catch (err) {
      alert(err.message || "Gagal menghapus");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Tanaman Saya</h2>
        <Button
          type="button"
          onClick={() => navigate("/plants/new")}
          size="lg"
          className="h-10 px-3"
        >
          <Plus className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden text-xs font-medium sm:inline">
            Tambah Tanaman
          </span>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        {searchParams.get("plant_type") && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-[3px]">
            <Leaf className="h-3 w-3" />
            <span>
              Tipe: {searchParams.get("plant_type")}
            </span>
          </span>
        )}
        {searchParams.get("status") && (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-[3px]">
            <AlertTriangle className="h-3 w-3" />
            <span>
              Status: {searchParams.get("status")}
            </span>
          </span>
        )}
        {(searchParams.get("status") || searchParams.get("plant_type")) && (
          <button
            type="button"
            onClick={() => navigate("/plants")}
            className="text-[11px] underline-offset-2 hover:underline"
          >
            Hapus filter
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="search"
          placeholder="Cari tanaman..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10"
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10 px-3"
          onClick={loadPlants}
        >
          <Search className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden text-xs font-medium sm:inline">Cari</span>
        </Button>
      </div>
      {loading && (
        <ul className="mt-2 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <li key={idx} className="border-b border-border/30 pb-3">
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="mb-1 h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </li>
          ))}
        </ul>
      )}
      {error && !loading && <p className="text-sm text-destructive">{error}</p>}
      {!loading && !error && plants.length === 0 && (
        <p className="text-sm text-muted-foreground">Belum ada tanaman.</p>
      )}
      <ul className="flex flex-col divide-y divide-border/20">
        {plants.map((plant) => {
          const images = plant.plant_images || [];
          const primaryImage =
            images.find((img) => img.is_primary) || images[0] || null;

          return (
            <li
              key={plant.id}
              className="flex items-center justify-between gap-3 py-3 text-sm"
            >
              <div className="flex flex-1 items-start gap-3">
                {primaryImage && primaryImage.image_url && (
                  <Link
                    to={`/plants/${plant.id}`}
                    className="mt-0.5 block h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-border/50 bg-muted"
                  >
                    <img
                      src={primaryImage.image_url}
                      alt={plant.plant_name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                )}
                <div className="space-y-1">
                  <Link
                    to={`/plants/${plant.id}`}
                    className="font-medium hover:underline"
                  >
                    {plant.plant_name}
                  </Link>
                  {plant.scientific_name && (
                    <div className="text-xs text-muted-foreground">
                      {plant.scientific_name}
                    </div>
                  )}
                  {plant.status && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-[2px] text-[11px] text-muted-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{plant.status}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => navigate(`/plants/${plant.id}`)}
                >
                  Detail
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(plant.id)}
                >
                  Hapus
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
