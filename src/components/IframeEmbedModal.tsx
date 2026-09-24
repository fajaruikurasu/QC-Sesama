import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Code2, Monitor, Smartphone } from 'lucide-react';

interface IframeEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IframeEmbedModal: React.FC<IframeEmbedModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [hideSidebarInIframe, setHideSidebarInIframe] = useState(false);
  const [iframeHeight, setIframeHeight] = useState('900');

  if (!isOpen) return null;

  const currentOrigin = window.location.origin;
  const embedUrl = `${currentOrigin}${hideSidebarInIframe ? '/?sidebar=false' : ''}`;
  const iframeSnippet = `<iframe
  src="${embedUrl}"
  width="100%"
  height="${iframeHeight}px"
  style="border: none; border-radius: 8px; width: 100%; min-height: ${iframeHeight}px;"
  title="Generator Label Dus Kargo & QC Siswa"
  allow="clipboard-write; clipboard-read"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-[#ED1B24]" />
            <h3 className="text-base font-bold text-slate-800">
              Integrasi Menu Iframe untuk Web Utama
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-lg p-3">
            <p className="font-semibold mb-1">
              💡 Siap Dihubungkan ke Website Anda
            </p>
            <p className="text-blue-800">
              Header server telah dikonfigurasi agar bebas dari batasan <code>X-Frame-Options</code>, sehingga aman dan langsung tampil saat disematkan ke WordPress, CMS, Laravel, atau HTML biasa.
            </p>
          </div>

          {/* Configuration options */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Opsi Tampilan Iframe:
            </div>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hideSidebarInIframe}
                onChange={(e) => setHideSidebarInIframe(e.target.checked)}
                className="rounded border-slate-300 text-[#ED1B24] focus:ring-[#ED1B24]"
              />
              <span className="text-slate-700 font-medium">
                Sembunyikan Sidebar Kiri di Iframe (Hanya tampilkan Form & Preview)
              </span>
            </label>

            <div className="flex items-center space-x-3 pt-1">
              <span className="text-slate-600 font-medium">Tinggi Iframe (Height):</span>
              <input
                type="number"
                value={iframeHeight}
                onChange={(e) => setIframeHeight(e.target.value)}
                className="w-24 px-2 py-1 border border-slate-300 rounded text-center font-mono"
              />
              <span className="text-slate-500">px (atau 100vh)</span>
            </div>
          </div>

          {/* Snippet box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-700">Kode HTML Iframe:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-[#ED1B24] hover:bg-[#d4141d] text-white rounded font-bold shadow-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode Iframe'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 select-all">
              {iframeSnippet}
            </pre>
          </div>

          {/* Direct Link */}
          <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100">
            <span>Direct URL: <code className="text-slate-700 font-mono">{embedUrl}</code></span>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005BAA] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Uji Buka URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
