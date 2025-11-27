import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register, setError, error } = useAuth();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        await register({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
        });
        toast.success("Registrasi berhasil, silakan login");
        navigate("/login");
      } catch (err) {
        const message = err.message || "Registrasi gagal";
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
      setError(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col p-4 md:p-8 grow justify-center">
      <div className="w-full flex flex-col gap-6">
        <div className="space-y-0.5">
          <h2 className="font-heading font-semibold text-lg">Register</h2>
          <p className="text-sm text-muted-foreground">
            Daftar akun untuk mulai menyimpan tanaman, gratis.
          </p>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                type="text"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
              />
            </div>
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
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login">
              <span className="transition-colors hover:text-foreground">
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
