import React from 'react';

interface PortalProps {
  onSelectRole: (role: 'admin' | 'user') => void;
}

export const Portal: React.FC<PortalProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-xl mb-6">
            <img src="/logo.png" alt="SIAK Logo" className="w-12 h-12 object-contain grayscale" onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/white/black?text=SIAK'; }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            Plataforma <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">SIAK</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Sistema Integrado de Administración Karin. Gestión documental y procedimental para investigaciones bajo la Ley N° 21.643.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card Usuario */}
          <button 
            onClick={() => onSelectRole('user')}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Acceso Investigador</h2>
            <p className="text-slate-400 mb-6">Ingresa para gestionar un proceso investigativo específico, generar actas y redactar informes finales.</p>
            <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Ingresar al sistema</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </button>

          {/* Card Super Admin */}
          <button 
            onClick={() => onSelectRole('admin')}
            className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl hover:bg-slate-800 transition-all duration-300 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500"></div>
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Super Administrador</h2>
            <p className="text-slate-400 mb-6">Panel de control global. Gestiona módulos por región, provincia, comuna y sector (Educación, Salud, etc).</p>
            <div className="flex items-center text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Acceder al panel</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
};
