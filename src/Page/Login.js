import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-[90vh] flex px-6 md:px-10 flex-col lg:flex-row items-center justify-center">
      {/* Left side - Background Image */}
    <motion.div
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
  className="hidden lg:flex lg:w-2/3 items-center justify-center rounded-2xl overflow-hidden shadow-lg"
>
  <img
    src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200"
    alt="login visual"
    className="object-cover w-full h-full rounded-2xl"
  />
</motion.div>


      {/* Right side - Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full lg:w-1/3 flex p-6 bg-gray-50 min-h-[90vh] items-center justify-center"
      >
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Se connecter</h2>
            <p className="text-gray-600">
              Vous n'avez pas de compte?{' '}
              <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                Créer un compte
              </button>
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Votre e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Adresse e-mail"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Votre mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Se connecter
            </button>

            {/* Forgot password */}
            <div className="text-center">
              <button
                type="button"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">Ou</span>
            </div>
          </div>

          {/* Social logins */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95 group"
            >
              {/* SVG omitted for brevity */}
              <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-200">
                Se connecter avec Google
              </span>
            </button>

            {/* Apple */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 bg-black hover:bg-gray-900 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 group"
            >
              {/* SVG omitted for brevity */}
              <span className="font-medium group-hover:text-gray-100 transition-colors duration-200">
                Se connecter avec Apple
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
