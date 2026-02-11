import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email wajib diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      console.log("Sending forgot password request for:", email);
      const response = await authService.forgotPassword(email);
      console.log("Forgot password response:", response);

      setMessage(
        "Jika email terdaftar, link reset password telah dikirim ke email Anda. Silakan periksa inbox dan folder spam.",
      );
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      console.error("Error response:", error.response);

      // Handle specific Google user error
      if (error.response?.data?.error === "GOOGLE_USER_RESET_NOT_ALLOWED") {
        setError(
          "Akun ini menggunakan login Google. Silakan login menggunakan Google atau hubungi customer service.",
        );
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Terjadi kesalahan: " + (error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Lupa Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Masukkan email Anda untuk menerima link reset password
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <Alert variant="error">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Link Reset Password"}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-sm text-gray-500">Atau</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Links */}
            <div className="space-y-3 text-center text-sm">
              <Link
                to="/login"
                className="block font-medium text-primary-600 hover:text-primary-500"
              >
                Kembali ke halaman login
              </Link>

              <span className="text-gray-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Daftar sekarang
                </Link>
              </span>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            className="rounded-xl border border-blue-200 bg-blue-50 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>

              <div>
                <h3 className="text-sm font-semibold text-blue-800">
                  Informasi Penting
                </h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-blue-700">
                  <li>Link reset password berlaku selama 5 menit</li>
                  <li>Link hanya dapat digunakan sekali</li>
                  <li>Periksa folder spam jika email tidak diterima</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
