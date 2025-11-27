import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  SunMedium,
  Thermometer,
  Droplets,
  MapPin,
  Sprout,
  AlertTriangle,
} from "lucide-react";
import { getPlant, deletePlant } from "../api/plants";
import {
  deleteImage,
  getImagesByPlant,
  setPrimaryImage,
  uploadImages,
} from "../api/images";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";

const formatLabel = (value) => {
  if (!value) return "Tidak diketahui";
  return value
    .toString()
    .replace(/_/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const getStatusClasses = (status) => {
  switch (status) {
    case "hidup":
      return "bg-emerald-100 text-emerald-900";
    case "berbunga":
      return "bg-lime-100 text-lime-900";
    case "sakit":
      return "bg-amber-100 text-amber-900";
    case "mati":
      return "bg-slate-200 text-slate-800";
    default:
      return "bg-muted text-foreground";
  }
};

export default function PlantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const plantRes = await getPlant(id);
      const plantData = plantRes.data?.plant || plantRes.data;
      setPlant(plantData);

      const imagesRes = await getImagesByPlant(id);
      setImages(imagesRes.data?.images || imagesRes.data || []);
    } catch (err) {
      setError(err.message || "Gagal memuat detail tanaman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const uploadForm = useFormik({
    initialValues: {
      caption: "",
      is_primary: false,
    },
    onSubmit: async (values, helpers) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        await uploadImages(id, {
          files,
          caption: values.caption,
          isPrimary: values.is_primary,
        });
        helpers.resetForm();
        setFiles([]);
        await loadData();
      } catch (err) {
        alert(err.message || "Gagal mengupload gambar");
      } finally {
        setUploading(false);
      }
    },
  });

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Hapus gambar ini?")) return;
    try {
      await deleteImage(imageId);
      await loadData();
    } catch (err) {
      alert(err.message || "Gagal menghapus gambar");
    }
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await setPrimaryImage(imageId);
      await loadData();
    } catch (err) {
      alert(err.message || "Gagal mengatur gambar utama");
    }
  };

  const handleDeletePlant = async () => {
    if (!window.confirm("Hapus tanaman ini beserta semua gambar?")) return;
    try {
      await deletePlant(id);
      navigate("/plants");
    } catch (err) {
      alert(err.message || "Gagal menghapus tanaman");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-4">
          <Skeleton className="h-5 w-1/2" />
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-32 w-full" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="error-text">{error}</p>
        <Link to="/plants">Kembali</Link>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <p className="text-sm text-destructive">Tanaman tidak ditemukan.</p>
        <Link
          to="/plants"
          className="mt-2 inline-flex text-sm text-primary hover:underline"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const primaryImage =
    images.find((img) => img.is_primary) || images[0] || null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <section className="w-full space-y-5">
        {/* Hero image */}
        {primaryImage && primaryImage.image_url && (
          <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
            <img
              src={primaryImage.image_url}
              alt={plant.plant_name}
              className="h-48 w-full object-cover sm:h-56"
            />
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-heading text-base font-semibold">
              {plant.plant_name}
            </h1>
            {plant.scientific_name && (
              <p className="text-xs text-muted-foreground">
                {plant.scientific_name}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
              {plant.plant_type && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-0.5 text-muted-foreground">
                  <Sprout className="h-3 w-3" />
                  <span>{formatLabel(plant.plant_type)}</span>
                </span>
              )}
              {plant.status && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] ${getStatusClasses(
                    plant.status
                  )}`}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>{formatLabel(plant.status)}</span>
                </span>
              )}
              {plant.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{plant.location}</span>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => navigate(`/plants/${id}/edit`)}
            >
              Ubah
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={handleDeletePlant}
            >
              Hapus
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => navigate("/plants")}
            >
              Kembali
            </Button>
          </div>
        </header>

        {/* Environment row */}
        <div className="mt-1 grid gap-2 text-xs sm:grid-cols-3">
          {plant.preferred_lighting && (
            <div className="flex flex-col gap-1 rounded bg-muted/40 px-3 py-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <SunMedium className="h-3 w-3" />
                <span>Lighting</span>
              </span>
              <span className="font-medium text-foreground">
                {formatLabel(plant.preferred_lighting)}
              </span>
            </div>
          )}
          {plant.preferred_temperature && (
            <div className="flex flex-col gap-1 rounded bg-muted/40 px-3 py-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Thermometer className="h-3 w-3" />
                <span>Temperature</span>
              </span>
              <span className="font-medium text-foreground">
                {formatLabel(plant.preferred_temperature)}
              </span>
            </div>
          )}
          {plant.preferred_humidity && (
            <div className="flex flex-col gap-1 rounded bg-muted/40 px-3 py-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Droplets className="h-3 w-3" />
                <span>Humidity</span>
              </span>
              <span className="font-medium text-foreground">
                {formatLabel(plant.preferred_humidity)}
              </span>
            </div>
          )}
        </div>

        {/* Description / care */}
        <section className="space-y-2 text-sm leading-relaxed">
          {plant.description && (
            <p>
              <span className="font-medium">Deskripsi:</span>{" "}
              <span className="text-muted-foreground">{plant.description}</span>
            </p>
          )}
          {plant.care_instructions && (
            <p>
              <span className="font-medium">Perawatan:</span>{" "}
              <span className="text-muted-foreground">
                {plant.care_instructions}
              </span>
            </p>
          )}
        </section>

        {/* Images and upload */}
        <section className="mt-4 space-y-3">
          <h2 className="text-sm font-semibold">Gambar</h2>
          {images.length === 0 && (
            <p className="text-sm text-muted-foreground">Belum ada gambar.</p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded border border-border/40 bg-card"
              >
                {img.image_url && (
                  <img
                    src={img.image_url}
                    alt={img.caption || plant.plant_name}
                    className="h-32 w-full object-cover transition-all group-hover:brightness-105"
                  />
                )}
                {img.is_primary && (
                  <span className="absolute left-1.5 top-1.5 inline-flex rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-emerald-800 shadow-sm">
                    Utama
                  </span>
                )}
                <div className="space-y-1 p-2">
                  {img.caption && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {img.caption}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border/60 p-2">
                  {!img.is_primary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetPrimary(img.id)}
                    >
                      Jadikan Utama
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteImage(img.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={uploadForm.handleSubmit}
            className="mt-4 space-y-3 rounded border border-dashed border-border/60 bg-muted/20 px-3 py-3"
          >
            <h3 className="text-sm font-semibold">Tambah Gambar</h3>
            <div
              className="flex flex-col items-center justify-center gap-2 rounded bg-background/60 px-3 py-6 text-xs text-muted-foreground"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer?.files?.length) {
                  setFiles(e.dataTransfer.files);
                }
              }}
            >
              <Label
                htmlFor="images"
                className="cursor-pointer rounded border border-dashed border-border px-3 py-1 text-[11px] hover:border-foreground/60"
              >
                Pilih file
              </Label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
              <p>atau seret & lepaskan ke sini</p>
              {files && files.length > 0 && (
                <p className="text-[11px] text-foreground/80">
                  {files.length} file siap diunggah
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                name="caption"
                value={uploadForm.values.caption}
                onChange={uploadForm.handleChange}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                id="is_primary"
                type="checkbox"
                name="is_primary"
                checked={uploadForm.values.is_primary}
                onChange={uploadForm.handleChange}
                className="h-3.5 w-3.5"
              />
              <span>
                Jadikan gambar pertama sebagai utama (jika belum ada utama)
              </span>
            </label>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Mengupload..." : "Upload"}
            </Button>
          </form>
        </section>
      </section>
    </div>
  );
}
