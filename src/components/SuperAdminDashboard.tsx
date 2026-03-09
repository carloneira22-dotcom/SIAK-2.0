import React, { useState } from 'react';
import { REGIONES, SECTORES } from '../data/territories';

interface SuperAdminDashboardProps {
  onSelectModule: (context: { region: string; provincia: string; comuna: string; sector: string }) => void;
  onLogout: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onSelectModule, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'territorios' | 'configuracion'>('territorios');
  const [selectedRegion, setSelectedRegion] = useState(REGIONES[0]);
  const [selectedProvincia, setSelectedProvincia] = useState(REGIONES[0].provincias[0]);
  const [selectedComuna, setSelectedComuna] = useState<string | null>(null);

  // Estados para la configuración de archivos
  const [maxFileSize, setMaxFileSize] = useState('100');
  const [allowedTypes, setAllowedTypes] = useState({
    pdf: true,
    images: true,
    video: true,
    audio: true,
    zip: false
  });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  const handleSaveConfig = () => {
    setIsSavingConfig(true);
    setTimeout(() => {
      setIsSavingConfig(false);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">SIAK <span className="text-blue-400">SuperAdmin</span></h1>
        </div>
        <button onClick={onLogout} className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2">
          <span>Cerrar Sesión</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('territorios')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'territorios' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Territorios y Módulos
            </button>
            <button 
              onClick={() => setActiveTab('configuracion')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'configuracion' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Configuración Global
            </button>
          </div>

          {activeTab === 'territorios' && (
            <div className="flex-1 overflow-y-auto p-2">
              <div className="p-2 mb-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regiones</h2>
              </div>
              {REGIONES.map((region) => (
                <div key={region.nombre} className="mb-4">
                  <button 
                    onClick={() => {
                      setSelectedRegion(region);
                      setSelectedProvincia(region.provincias[0]);
                      setSelectedComuna(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md font-semibold text-sm transition-colors ${selectedRegion.nombre === region.nombre ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    {region.nombre}
                  </button>
                  
                  {selectedRegion.nombre === region.nombre && (
                    <div className="ml-4 mt-1 border-l-2 border-slate-100 pl-2 space-y-1">
                      {region.provincias.map(provincia => (
                        <button
                          key={provincia.nombre}
                          onClick={() => {
                            setSelectedProvincia(provincia);
                            setSelectedComuna(null);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${selectedProvincia.nombre === provincia.nombre ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          Provincia de {provincia.nombre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {activeTab === 'territorios' ? (
            <div className="max-w-5xl mx-auto animate-fade-in-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{selectedRegion.nombre}</h2>
                <p className="text-slate-500 mt-1">Provincia de {selectedProvincia.nombre} • Selecciona una comuna para gestionar sus módulos.</p>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {selectedProvincia.comunas.map(comuna => (
                <button
                  key={comuna}
                  onClick={() => setSelectedComuna(comuna)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${selectedComuna === comuna ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${selectedComuna === comuna ? 'text-blue-700' : 'text-slate-700'}`}>{comuna}</span>
                    {selectedComuna === comuna && (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedComuna && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Módulos para {selectedComuna}</h3>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SECTORES.map((sector, idx) => {
                    const colors = [
                      'bg-emerald-500 hover:bg-emerald-600', // Educación
                      'bg-rose-500 hover:bg-rose-600',       // Salud
                      'bg-indigo-500 hover:bg-indigo-600',   // Municipal
                      'bg-amber-500 hover:bg-amber-600'      // Empresas
                    ];
                    const colorClass = colors[idx % colors.length];

                    return (
                      <div key={sector} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            {idx === 0 && <span className="text-2xl">📚</span>}
                            {idx === 1 && <span className="text-2xl">🏥</span>}
                            {idx === 2 && <span className="text-2xl">🏛️</span>}
                            {idx === 3 && <span className="text-2xl">🏢</span>}
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">{sector}</h4>
                          <p className="text-sm text-slate-500">Gestión de denuncias, investigaciones y actas bajo la normativa vigente para el sector en la comuna de {selectedComuna}.</p>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100">
                          <button 
                            onClick={() => onSelectModule({
                              region: selectedRegion.nombre,
                              provincia: selectedProvincia.nombre,
                              comuna: selectedComuna,
                              sector: sector
                            })}
                            className={`w-full py-2.5 px-4 rounded-lg text-white font-bold shadow-sm transition-colors flex justify-center items-center gap-2 ${colorClass}`}
                          >
                            <span>Ingresar al Módulo</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Configuración Global</h2>
                <p className="text-slate-500 mt-1">Administra los parámetros generales del sistema SIAK.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Almacenamiento y Archivos Grandes</h3>
                    <p className="text-sm text-slate-500">Configura los límites y formatos para la subida de evidencias (videos, audios, documentos).</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Tamaño Máximo */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tamaño máximo por archivo</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {['10', '50', '100', '500', '1024'].map(size => (
                        <button
                          key={size}
                          onClick={() => setMaxFileSize(size)}
                          className={`py-3 px-4 rounded-xl border-2 font-bold transition-all ${maxFileSize === size ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-600'}`}
                        >
                          {size === '1024' ? '1 GB' : `${size} MB`}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      * Archivos mayores a 50MB requieren configuración especial en el bucket de Supabase Storage.
                    </p>
                  </div>

                  {/* Formatos Permitidos */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Formatos de evidencia permitidos</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={allowedTypes.pdf} onChange={(e) => setAllowedTypes({...allowedTypes, pdf: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block font-bold text-slate-700">Documentos</span>
                          <span className="block text-xs text-slate-500">PDF, DOCX, XLSX</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={allowedTypes.images} onChange={(e) => setAllowedTypes({...allowedTypes, images: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block font-bold text-slate-700">Imágenes</span>
                          <span className="block text-xs text-slate-500">JPG, PNG, WEBP</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={allowedTypes.video} onChange={(e) => setAllowedTypes({...allowedTypes, video: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block font-bold text-slate-700">Videos</span>
                          <span className="block text-xs text-slate-500">MP4, MOV, AVI</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={allowedTypes.audio} onChange={(e) => setAllowedTypes({...allowedTypes, audio: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block font-bold text-slate-700">Audios</span>
                          <span className="block text-xs text-slate-500">MP3, WAV, M4A</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="checkbox" checked={allowedTypes.zip} onChange={(e) => setAllowedTypes({...allowedTypes, zip: e.target.checked})} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block font-bold text-slate-700">Comprimidos</span>
                          <span className="block text-xs text-slate-500">ZIP, RAR</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Supabase Storage Info */}
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4">
                    <div className="text-blue-500 mt-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-900">Configuración requerida en Supabase</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        Para que la subida de archivos grandes funcione, debes crear un bucket llamado <b>"evidencias"</b> en tu panel de Supabase Storage y ajustar el límite de tamaño en la configuración del bucket.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-4">
                  {configSaved && (
                    <span className="text-emerald-600 font-bold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Configuración guardada
                    </span>
                  )}
                  <button 
                    onClick={handleSaveConfig}
                    disabled={isSavingConfig}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
};
