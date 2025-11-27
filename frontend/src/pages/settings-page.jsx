import { useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { useTheme } from "../context/theme-context.jsx";

const STORAGE_KEY = "green_hub_settings";

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const formik = useFormik({
    initialValues: {
      compactList: false,
      showImages: true,
      message: ''
    },
    onSubmit: (values, helpers) => {
      saveSettings({
        compactList: values.compactList,
        showImages: values.showImages
      });
      helpers.setFieldValue("message", "Pengaturan tersimpan.");
      toast.success("Pengaturan tersimpan.");
      setTimeout(() => helpers.setFieldValue("message", ""), 2500);
    }
  });

  useEffect(() => {
    const stored = loadSettings();
    if (stored) {
      formik.setValues({
        compactList: Boolean(stored.compactList),
        showImages: stored.showImages !== false,
        message: ""
      });
    }
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col py-4">
      <section className="w-full space-y-5">
        <header className="space-y-1">
          <h1 className="font-heading text-base font-semibold">Pengaturan</h1>
          <p className="text-xs text-muted-foreground">
            Sesuaikan tampilan aplikasi sesuai preferensi Anda.
          </p>
        </header>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="compactList"
                checked={formik.values.compactList}
                onChange={formik.handleChange}
                className="h-4 w-4"
              />
              <span>Gunakan tampilan daftar yang lebih rapat</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                name="showImages"
                checked={formik.values.showImages}
                onChange={formik.handleChange}
                className="h-4 w-4"
              />
              <span>Tampilkan gambar tanaman di daftar</span>
            </label>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Tema
              </p>
              <div className="flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs ${
                    theme === "light"
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs ${
                    theme === "dark"
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
          <Button type="submit" size="sm" className="mt-3">
            Simpan pengaturan
          </Button>
          {formik.values.message && (
            <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
              {formik.values.message}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
