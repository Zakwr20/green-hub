import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { createPlant, getPlant, updatePlant } from "../api/plants";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const PLANT_TYPES = [
  { value: "herba", label: "Herba" },
  { value: "semak", label: "Semak" },
  { value: "pohon", label: "Pohon" },
  { value: "pemanjat", label: "Pemanjat" },
  { value: "menjalar", label: "Menjalar" },
];

const STATUSES = [
  { value: "hidup", label: "Hidup" },
  { value: "mati", label: "Mati" },
  { value: "sakit", label: "Sakit" },
  { value: "berbunga", label: "Berbunga" },
];

const LIGHTING_OPTIONS = [
  { value: "full_sun", label: "Full Sun" },
  { value: "partial_sun", label: "Partial Sun" },
  { value: "indirect_light", label: "Indirect Light" },
  { value: "low_light", label: "Low Light" },
];

const HUMIDITY_OPTIONS = [
  { value: "dry", label: "Dry" },
  { value: "normal", label: "Normal" },
  { value: "humid", label: "Humid" },
];

const TEMPERATURE_OPTIONS = [
  { value: "cool", label: "Cool" },
  { value: "moderate", label: "Moderate" },
  { value: "warm", label: "Warm" },
];

export default function PlantFormPage() {
  const { id } = useParams();
  const isEdit = id && id !== "new";
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    plant_name: "",
    plant_type: "",
    scientific_name: "",
    description: "",
    location: "",
    acquisition_date: "",
    status: "",
    care_instructions: "",
    preferred_lighting: "",
    preferred_humidity: "",
    preferred_temperature: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }

    const loadPlant = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPlant(id);
        const plant = res.data?.plant || res.data;
        setInitialValues({
          plant_name: plant.plant_name || "",
          plant_type: plant.plant_type || "",
          scientific_name: plant.scientific_name || "",
          description: plant.description || "",
          location: plant.location || "",
          acquisition_date: plant.acquisition_date || "",
          status: plant.status || "",
          care_instructions: plant.care_instructions || "",
          preferred_lighting: plant.preferred_lighting || "",
          preferred_humidity: plant.preferred_humidity || "",
          preferred_temperature: plant.preferred_temperature || "",
        });
      } catch (err) {
        setError(err.message || "Gagal memuat tanaman");
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [id, isEdit]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      setSaving(true);
      setError(null);
      try {
        if (isEdit) {
          await updatePlant(id, values);
        } else {
          await createPlant(values);
        }
        navigate("/plants");
      } catch (err) {
        setError(err.message || "Gagal menyimpan tanaman");
      } finally {
        setSaving(false);
      }
    },
  });

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col py-4">
        <div className="w-full space-y-4">
          <Skeleton className="h-5 w-1/2" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col py-4">
      <section className="w-full space-y-5">
        <header className="space-y-1">
          <h1 className="font-heading text-base font-semibold">
            {isEdit ? "Ubah Tanaman" : "Tambah Tanaman"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Isi detail tanaman untuk menyimpan ke koleksi Anda.
          </p>
        </header>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant_name">Nama Tanaman</Label>
              <Input
                id="plant_name"
                name="plant_name"
                value={formik.values.plant_name}
                onChange={formik.handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plant_type">Tipe Tanaman</Label>
              <Select
                value={formik.values.plant_type}
                onValueChange={(value) =>
                  formik.setFieldValue("plant_type", value)
                }
              >
                <SelectTrigger className="w-full" id="plant_type">
                  <SelectValue placeholder="Pilih Tipe" />
                </SelectTrigger>
                <SelectContent>
                  {PLANT_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scientific_name">Nama Ilmiah</Label>
              <Input
                id="scientific_name"
                name="scientific_name"
                value={formik.values.scientific_name}
                onChange={formik.handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                className="min-h-20 w-full rounded border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preferred_lighting">Lighting</Label>
                <Select
                  value={formik.values.preferred_lighting}
                  onValueChange={(value) =>
                    formik.setFieldValue("preferred_lighting", value)
                  }
                >
                  <SelectTrigger className="w-full" id="preferred_lighting">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_temperature">Temperature</Label>
                <Select
                  value={formik.values.preferred_temperature}
                  onValueChange={(value) =>
                    formik.setFieldValue("preferred_temperature", value)
                  }
                >
                  <SelectTrigger className="w-full" id="preferred_temperature">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPERATURE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_humidity">Humidity</Label>
                <Select
                  value={formik.values.preferred_humidity}
                  onValueChange={(value) =>
                    formik.setFieldValue("preferred_humidity", value)
                  }
                >
                  <SelectTrigger className="w-full" id="preferred_humidity">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {HUMIDITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="acquisition_date">Tanggal Perolehan</Label>
              <Input
                id="acquisition_date"
                name="acquisition_date"
                type="date"
                value={formik.values.acquisition_date || ""}
                onChange={formik.handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formik.values.status}
                onValueChange={(value) =>
                  formik.setFieldValue("status", value)
                }
              >
                <SelectTrigger className="w-full" id="status">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="care_instructions">Petunjuk Perawatan</Label>
              <textarea
                id="care_instructions"
                name="care_instructions"
                value={formik.values.care_instructions}
                onChange={formik.handleChange}
                className="min-h-20 w-full rounded border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
