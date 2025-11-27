import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login, setError, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        await login(values);
        toast.success("Login berhasil");
        navigate("/plants");
      } catch (err) {
        const message = err.message || "Login gagal";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await formik.submitForm();
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col p-4 md:p-8 grow justify-center">
      <div className="w-full flex flex-col gap-6">
        <div className="space-y-0.5">
          <h2 className="font-heading font-semibold text-lg">Login</h2>
          <p className="text-sm text-muted-foreground">
            Masuk untuk mengelola koleksi tanaman Anda.
          </p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                required
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register">
              <span className="transition-colors hover:text-foreground">
                Daftar
              </span>
            </Link>{" "}
            sekarang.
          </p>
        </div>
      </div>
    </div>
  );
}
