import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import { Mail, Lock, Chrome, Globe2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useIntl } from 'react-intl';
import { getFirebaseErrorCode } from '../utils/firebaseErrors';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { currentLanguage, setLanguage } = useLanguage();
  const intl = useIntl();

  const handleError = (error: any) => {
    const errorCode = getFirebaseErrorCode(error);
    setError(intl.formatMessage({ id: `auth.error.${errorCode}` }));
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      handleError(err);
    }
  };

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-100 to-pink-100">
      {/* Geometric patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {/* Circles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className="absolute rounded-full border-2 border-violet-300/30 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${Math.random() * 5 + 10}s`
            }}
          />
        ))}

        {/* Squares */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`square-${i}`}
            className="absolute border-2 border-pink-300/30 animate-float"
            style={{
              width: `${Math.random() * 60 + 40}px`,
              height: `${Math.random() * 60 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${Math.random() * 5 + 8}s`
            }}
          />
        ))}

        {/* Triangles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`triangle-${i}`}
            className="absolute w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-purple-300/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 5 + 12}s`
            }}
          />
        ))}
      </div>

      {/* Gradient lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-violet-200 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center relative z-10 p-4">
        <div className="w-full max-w-md">
          <div className="card backdrop-blur-xl bg-white/80 p-8 space-y-6 relative shadow-xl border border-white/40">
            <button
              onClick={toggleLanguage}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-violet-500 hover:bg-violet-50 rounded-full transition-all duration-300"
              title={intl.formatMessage({ 
                id: currentLanguage === 'en' ? 'auth.language.switch.fr' : 'auth.language.switch.en' 
              })}
            >
              <div className="flex items-center space-x-1">
                <Globe2 className="h-5 w-5" />
                <span className="text-sm font-medium">{currentLanguage === 'en' ? 'FR' : 'EN'}</span>
              </div>
            </button>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                {intl.formatMessage({ 
                  id: isLogin ? 'auth.login.title' : 'auth.signup.title' 
                })}
              </h2>
              <p className="text-gray-500">
                {intl.formatMessage({ 
                  id: isLogin ? 'auth.login.subtitle' : 'auth.signup.subtitle' 
                })}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleAuth}
              className="w-full btn flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 text-white shadow-lg shadow-pink-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <Chrome className="w-5 h-5" />
              <span>{intl.formatMessage({ id: 'auth.button.google' })}</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 text-gray-500">
                  {intl.formatMessage({ id: 'auth.divider' })}
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-hover:text-violet-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'auth.email.placeholder' })}
                    className="input-field pl-10 transition-all duration-300 focus:ring-violet-400 focus:border-violet-400 group-hover:border-violet-400"
                    required
                  />
                </div>
              </div>
              <div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400 transition-colors group-hover:text-violet-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'auth.password.placeholder' })}
                    className="input-field pl-10 transition-all duration-300 focus:ring-violet-400 focus:border-violet-400 group-hover:border-violet-400"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="btn w-full bg-gradient-to-r from-violet-400 to-pink-400 hover:from-violet-500 hover:to-pink-500 text-white shadow-lg shadow-pink-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {intl.formatMessage({ 
                  id: isLogin ? 'auth.button.login' : 'auth.button.signup' 
                })}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-violet-500 hover:text-violet-600 font-medium transition-colors"
              >
                {intl.formatMessage({ 
                  id: isLogin ? 'auth.toggle.signup' : 'auth.toggle.login' 
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}