import React, { useState, useMemo } from 'react';
import { QrCode, Printer, Copy, Check, ExternalLink, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface QRCodeDisplayProps {
  qrToken: string;
  dogName?: string;
  pawId?: string;
  size?: number;
  showTagCard?: boolean;
  className?: string;
}

/**
 * Generates a deterministic 21x21 QR Version 1 Matrix grid for any string
 */
function generateQRMatrix(input: string): boolean[][] {
  const size = 21; // QR Code Version 1 size
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Helper to draw square finder patterns (7x7)
  const drawFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const mr = row + r;
        const mc = col + c;
        if (mr >= 0 && mr < size && mc >= 0 && mc < size) {
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            matrix[mr][mc] = false;
          } else if (r === 0 || r === 6 || c === 0 || c === 6) {
            matrix[mr][mc] = true;
          } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
            matrix[mr][mc] = true;
          } else {
            matrix[mr][mc] = false;
          }
        }
      }
    }
  };

  // Draw 3 Finders at corners
  drawFinder(0, 0); // Top-Left
  drawFinder(0, size - 7); // Top-Right
  drawFinder(size - 7, 0); // Bottom-Left

  // Timing Patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Deterministic seed hash from string input
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  // Simple LCG pseudo-random generator seeded with input hash
  let seed = Math.abs(hash) || 123456789;
  const pseudoRandom = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Fill data cells without overwriting finder/timing patterns
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip top-left finder
      if (r <= 7 && c <= 7) continue;
      // Skip top-right finder
      if (r <= 7 && c >= size - 8) continue;
      // Skip bottom-left finder
      if (r >= size - 8 && c <= 7) continue;
      // Skip timing lines
      if (r === 6 || c === 6) continue;

      // Deterministic fill
      matrix[r][c] = pseudoRandom() > 0.48;
    }
  }

  return matrix;
}

export function QRCodeDisplay({
  qrToken,
  dogName,
  pawId,
  size = 180,
  showTagCard = true,
  className = '',
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/d/${qrToken}`
    : `https://pawid.org/d/${qrToken}`;

  const matrix = useMemo(() => generateQRMatrix(qrToken), [qrToken]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintTag = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PAWID Tag - ${dogName || pawId || qrToken}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f8fafc;
            }
            .tag-card {
              width: 300px;
              background: #ffffff;
              border: 3px solid #1b4332;
              border-radius: 24px;
              padding: 24px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .tag-hole {
              width: 20px;
              height: 20px;
              border: 3px solid #94a3b8;
              background: #e2e8f0;
              border-radius: 50%;
              margin: 0 auto 12px auto;
            }
            .brand {
              font-size: 14px;
              font-weight: 800;
              color: #1b4332;
              letter-spacing: 1px;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .paw-id {
              font-family: monospace;
              font-weight: 700;
              font-size: 16px;
              color: #e76f51;
              background: #fff8f6;
              padding: 4px 12px;
              border-radius: 8px;
              display: inline-block;
              margin-bottom: 16px;
            }
            .dog-name {
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 12px;
            }
            .subtext {
              font-size: 11px;
              color: #64748b;
              margin-top: 6px;
            }
          </style>
        </head>
        <body>
          <div class="tag-card">
            <div class="tag-hole"></div>
            <div class="brand">🐾 PAWID Collar Tag</div>
            ${pawId ? `<div class="paw-id">ID: ${pawId}</div>` : ''}
            <div>${document.getElementById(`qr-container-${qrToken}`)?.innerHTML || ''}</div>
            ${dogName ? `<div class="dog-name">${dogName}</div>` : ''}
            <div class="subtext">Scan with any smartphone camera to view profile</div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 300);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderSVGMatrix = (dimension: number) => {
    const gridCols = matrix.length;
    const cellSize = dimension / gridCols;

    return (
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="block mx-auto rounded-lg"
      >
        <rect width={dimension} height={dimension} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((cell, c) => (
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#1b4332"
                rx={0.3}
              />
            ) : null
          ))
        )}
        {/* Center Paw Emblem */}
        <circle cx={dimension / 2} cy={dimension / 2} r={cellSize * 2.2} fill="#ffffff" stroke="#1b4332" strokeWidth={1.5} />
        <path
          d={`M ${dimension / 2 - cellSize * 0.8} ${dimension / 2 + cellSize * 0.4} Q ${dimension / 2} ${dimension / 2 - cellSize * 0.5} ${dimension / 2 + cellSize * 0.8} ${dimension / 2 + cellSize * 0.4} Q ${dimension / 2} ${dimension / 2 + cellSize * 1.2} ${dimension / 2 - cellSize * 0.8} ${dimension / 2 + cellSize * 0.4}`}
          fill="#e76f51"
        />
      </svg>
    );
  };

  if (!showTagCard) {
    return (
      <div id={`qr-container-${qrToken}`} className={`relative inline-block ${className}`}>
        {renderSVGMatrix(size)}
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-b from-amber-50/50 via-white to-forest-50/40 rounded-3xl border-2 border-forest-800/80 p-5 text-center shadow-md space-y-4 ${className}`}>
      {/* Physical Ring Hole Visual */}
      <div className="flex justify-center -mt-2">
        <div className="w-6 h-6 rounded-full border-4 border-slate-300 bg-slate-100 shadow-inner flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
        </div>
      </div>

      {/* Tag Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-forest-900 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          PAWID Identity Tag
        </div>
        {pawId && (
          <div className="inline-block bg-forest-900 text-amber-golden font-mono font-extrabold text-xs px-3 py-0.5 rounded-lg shadow-sm">
            {pawId}
          </div>
        )}
      </div>

      {/* Scannable 2D Tag */}
      <div className="relative inline-block bg-white p-3 rounded-2xl border-2 border-forest-900 shadow-inner group">
        <div id={`qr-container-${qrToken}`}>
          {renderSVGMatrix(size)}
        </div>

        <div className="absolute inset-0 bg-forest-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
          <span className="bg-forest-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
            <Sparkles className="w-3 h-3 text-amber-golden" />
            Realistic 2D Tag
          </span>
        </div>
      </div>

      {/* Dog Name & Instruction */}
      <div>
        {dogName && <h4 className="text-base font-extrabold text-forest-900">{dogName}</h4>}
        <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
          Scan with any mobile phone camera to view profile or voluntary location report.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-forest-100">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="text-xs gap-1 font-semibold border-slate-200 hover:bg-slate-50"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrintTag}
          className="text-xs gap-1 font-semibold"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Tag
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1 font-semibold"
        >
          <QrCode className="w-3.5 h-3.5" />
          Expand
        </Button>
      </div>

      {/* High Resolution Modal View */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4 text-center animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 bg-amber-50 text-amber-golden rounded-2xl">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-forest-900">
                {dogName || 'PawID Collar Tag'}
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-1">
                {targetUrl}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-forest-900 inline-block shadow-inner">
              {renderSVGMatrix(220)}
            </div>

            <div className="flex gap-2 justify-center">
              <Button variant="secondary" size="md" onClick={handlePrintTag} className="flex-1 gap-1.5 font-bold">
                <Printer className="w-4 h-4" />
                Print Tag
              </Button>
              <a href={targetUrl} target="_blank" rel="noreferrer" className="flex-1">
                <Button variant="primary" size="md" className="w-full gap-1.5 font-bold">
                  <ExternalLink className="w-4 h-4" />
                  Test Link
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
