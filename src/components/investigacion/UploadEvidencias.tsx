import React, { useState, useRef } from 'react';
import { FormData } from '../../types';
import { supabase } from '../../services/supabase';

interface UploadEvidenciasProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export function UploadEvidencias({ formData, setFormData }: UploadEvidenciasProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setError(null);
        setUploadProgress(10); // Start progress

        try {
            const newEvidences = [...(formData.investigacion.evidencias || [])];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `${formData.investigador.rut || 'anon'}/${fileName}`;

                // Upload to Supabase Storage
                const { error: uploadError, data } = await supabase.storage
                    .from('evidencias')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('evidencias')
                    .getPublicUrl(filePath);

                newEvidences.push({
                    id: data.path,
                    name: file.name,
                    url: publicUrl,
                    type: file.type,
                    size: file.size
                });

                setUploadProgress(10 + Math.round(((i + 1) / files.length) * 90));
            }

            setFormData(prev => ({
                ...prev,
                investigacion: {
                    ...prev.investigacion,
                    evidencias: newEvidences
                }
            }));

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

        } catch (err: any) {
            console.error("Error uploading file:", err);
            setError(err.message || 'Ocurrió un error al subir el archivo.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveEvidence = async (idToRemove: string) => {
        try {
            // Remove from Supabase Storage
            const { error } = await supabase.storage
                .from('evidencias')
                .remove([idToRemove]);

            if (error) {
                console.error("Error removing file from storage:", error);
                // We continue to remove it from state even if storage deletion fails, 
                // to not block the user, but ideally we'd handle this better.
            }

            // Remove from state
            setFormData(prev => ({
                ...prev,
                investigacion: {
                    ...prev.investigacion,
                    evidencias: (prev.investigacion.evidencias || []).filter(e => e.id !== idToRemove)
                }
            }));
        } catch (err) {
            console.error("Error in handleRemoveEvidence:", err);
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Evidencias Adjuntas</h3>
                    <p className="text-sm text-slate-500">Sube documentos, imágenes, audios o videos relevantes para la investigación.</p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                <input 
                    type="file" 
                    multiple 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                {isUploading ? (
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-10 w-10 text-indigo-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm font-bold text-slate-700">Subiendo archivos... {uploadProgress}%</p>
                        <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 mt-2">
                            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                        <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="text-base font-bold text-slate-700">Haz clic o arrastra archivos aquí</p>
                        <p className="text-xs text-slate-500 mt-1">Soporta PDF, JPG, PNG, MP4, MP3, ZIP (Máx. 1GB por archivo)</p>
                    </div>
                )}
            </div>

            {formData.investigacion.evidencias && formData.investigacion.evidencias.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Archivos Subidos ({formData.investigacion.evidencias.length})</h4>
                    <div className="space-y-2">
                        {formData.investigacion.evidencias.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="bg-white p-2 rounded shadow-sm text-slate-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    </div>
                                    <div className="truncate">
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:underline truncate block">
                                            {file.name}
                                        </a>
                                        <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRemoveEvidence(file.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                    title="Eliminar archivo"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
