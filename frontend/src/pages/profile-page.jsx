import { useFormik } from 'formik';
import { toast } from 'sonner';
import { useAuth } from '../context/auth-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { apiRequest } from '../api/client';

export default function ProfilePage() {
  const { user } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.user_metadata?.full_name || ''
    },
    onSubmit: async (values) => {
      setSavingProfile(true);
      setMessage('');
      setError('');
      try {
        await apiRequest('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify({ full_name: values.fullName || null })
        });
        setMessage('Profil berhasil diperbarui.');
        toast.success('Profil berhasil diperbarui.');
      } catch (err) {
        setError(err.message || 'Gagal memperbarui profil');
        toast.error(err.message || 'Gagal memperbarui profil');
      } finally {
        setSavingProfile(false);
      }
    }
  });

  const passwordForm = useFormik({
    initialValues: {
      password: ''
    },
    onSubmit: async (values, helpers) => {
      if (!values.password) return;
      setChangingPassword(true);
      setMessage('');
      setError('');
      try {
        await apiRequest('/auth/change-password', {
          method: 'PUT',
          body: JSON.stringify({ password: values.password })
        });
        helpers.resetForm();
        setMessage('Password berhasil diubah.');
        toast.success('Password berhasil diubah.');
      } catch (err) {
        setError(err.message || 'Gagal mengubah password');
        toast.error(err.message || 'Gagal mengubah password');
      } finally {
        setChangingPassword(false);
      }
    }
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
      <section className="w-full space-y-5">
        <header className="space-y-1">
          <h1 className="font-heading text-base font-semibold">Profil</h1>
          <p className="text-xs text-muted-foreground">
            Kelola informasi akun dan keamanan Anda.
          </p>
        </header>

        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Email:</span>{" "}
            <span>{user?.email}</span>
          </p>
        </div>

        <form onSubmit={profileForm.handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              type="text"
              name="fullName"
              value={profileForm.values.fullName}
              onChange={profileForm.handleChange}
            />
          </div>
          <Button type="submit" size="sm" disabled={savingProfile}>
            {savingProfile ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </form>

        <form onSubmit={passwordForm.handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={passwordForm.values.password}
              onChange={passwordForm.handleChange}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={changingPassword}
          >
            {changingPassword ? "Memproses..." : "Ubah Password"}
          </Button>
        </form>

        {message && (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
            {message}
          </p>
        )}
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </section>
    </div>
  );
}
