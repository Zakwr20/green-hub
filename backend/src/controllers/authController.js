const { supabase } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name
          }
        }
      });

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(
        res,
        'Registrasi berhasil. Silakan cek email untuk verifikasi.',
        { user: data.user },
        201
      );
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return errorResponse(res, 'Email atau password salah', 401);
      }

      return successResponse(res, 'Login berhasil', {
        user: data.user,
        session: data.session
      });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(res, 'Logout berhasil');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;

      return successResponse(res, 'Profil berhasil diambil', { user });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async updateProfile(req, res) {
    try {
      const { full_name } = req.body;

      const { data, error } = await supabase.auth.updateUser({
        data: { full_name }
      });

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(res, 'Profil berhasil diperbarui', {
        user: data.user
      });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async changePassword(req, res) {
    try {
      const { password } = req.body;

      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(res, 'Password berhasil diubah');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      });

      if (error) {
        return errorResponse(res, error.message, 400);
      }

      return successResponse(res, 'Email reset password telah dikirim');
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  }
}

module.exports = new AuthController();

