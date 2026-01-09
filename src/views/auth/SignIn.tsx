import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "src/services/authService";
import { useTenant } from "src/contexts/TenantContext";
import InputField from "components/fields/InputField";
import Loader from "components/loader/Loader";

export default function SignIn() {
  const navigate = useNavigate();
  const { clinicSubdomain, isPublicSchema } = useTenant();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Warn if accessing login on public schema
    if (isPublicSchema) {
      console.warn(
        "⚠️ Login page accessed on PUBLIC schema. Users should be on clinic subdomain."
      );
    }
  }, [isPublicSchema]);

  const handleLogin = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Attempting login for:", username);
    setLoading(true);
    setError("");

    try {
      await authService.login({ username, password });
      navigate("/admin/default");
    } catch (err: any) {
      console.error("Login Error Catch:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[2vh] w-full max-w-full flex-col items-center md:pl-12 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Connexion
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          {clinicSubdomain
            ? `Cabinet: ${clinicSubdomain}`
            : "Entrez votre nom d'utilisateur pour accéder au cabinet."}
        </p>

        {/* Tenant Warning for Public Schema */}
        {isPublicSchema && (
          <div className="mb-4 text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            ⚠️ Vous êtes sur le schéma public. Accédez via le sous-domaine de
            votre cabinet (ex: clinic1.localhost:3000)
          </div>
        )}

        {/* Tenant Info Display */}
        {clinicSubdomain && (
          <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            🏥 Connexion au cabinet: <strong>{clinicSubdomain}</strong>
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <InputField
            variant="auth"
            extra="mb-3"
            label="Nom d'utilisateur*"
            placeholder="ex: dr_alami"
            id="username"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="Mot de passe*"
            placeholder="••••••••"
            id="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400"
          >
            {loading ? (
              <>
                <Loader size="sm" variant="white" />{" "}
                <span>Vérification...</span>
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
