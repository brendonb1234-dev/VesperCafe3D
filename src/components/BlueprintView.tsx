import { useState } from 'react';
import { ArrowLeft, Check, Copy, Download, Layers } from 'lucide-react';
import {
  AESTHETIC_PRESETS,
  DEVELOPMENT_PHASES,
  REQUIRED_3D_ASSETS,
  type BlueprintAssetItem,
} from '../data/cafeData';
import { generateStandaloneBlueprintHtml } from '../utils/blueprintHtmlGenerator';

interface BlueprintViewProps {
  onBackToStorefront: () => void;
}

type AssetFilter = 'All' | BlueprintAssetItem['priority'];

export function BlueprintView({ onBackToStorefront }: BlueprintViewProps) {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('All');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const filteredAssets =
    assetFilter === 'All'
      ? REQUIRED_3D_ASSETS
      : REQUIRED_3D_ASSETS.filter((a) => a.priority === assetFilter);

  const handleDownloadHtml = () => {
    const html = generateStandaloneBlueprintHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cafe-3d-website-ide-blueprint.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3000);
  };

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(generateStandaloneBlueprintHtml());
      setCopiedHtml(true);
      window.setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      handleDownloadHtml();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
      {/* Top Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-black/10">
        <div>
          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#94632E] hover:text-[#7A4F22] mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live 3D Café Storefront</span>
          </button>
          <h1
            className="font-display text-3xl sm:text-5xl font-semibold text-[#171614] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            3D Café Architecture, Asset Manifest &amp; IDE Implementation Plan
          </h1>
          <p className="text-sm text-[#524E48] max-w-3xl mt-3 leading-relaxed">
            Everything required to take this commercial 3D café concept into your IDE — covering
            physical-to-digital aesthetic synchronization, business logic architecture, the 10
            exact 3D models to download, phase-wise sprint distribution, testing, and deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors whitespace-nowrap shrink-0"
          >
            {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{downloaded ? 'HTML Blueprint Downloaded' : 'Download Complete HTML Doc'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-black/14 bg-[#FFFFFF] text-[#171614] hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-[#244235]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHtml ? 'Copied HTML' : 'Copy Raw HTML'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: End-to-End Business & Aesthetic Connectivity Flow */}
      <section className="py-12 border-b border-black/10">
        <p className="text-xs font-medium text-[#78736A] mb-2">
          01. Architecture &amp; Commercial Connectivity Flow
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171614] mb-6">
          Connecting Physical Café Aesthetics Directly to Conversion Logic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: 'Layer 01 · Physical Sync',
              title: 'Interior Material & Light Tokens',
              desc: 'Map real café stone, wood, brass, and 5200K → 2700K diurnal lighting directly to CSS variables and Three.js PBR shaders.',
            },
            {
              step: 'Layer 02 · Interactive 3D',
              title: 'WebGL Tasting Stage',
              desc: 'Draco-compressed GLB heroes with OrbitControls, exploded layer inspection, and instant "Customize & Order" deep links.',
            },
            {
              step: 'Layer 03 · Commerce Engine',
              title: 'Menu, Cart & POS Sync',
              desc: 'Live modifier pricing, promo validation, Counter Pickup vs. Table Delivery, Stripe/Square payments, and KDS order webhooks.',
            },
            {
              step: 'Layer 04 · Spatial Booking',
              title: 'Floor Plan Table Engine',
              desc: 'Architectural SVG seating map backed by transactional slot locks, party capacity validation, and pre-order table linking.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 bg-[#FFFFFF] rounded-xl border border-black/8 flex flex-col justify-between"
            >
              <div>
                <p className="text-[11px] font-medium text-[#94632E]">{item.step}</p>
                <h3 className="font-display text-xl font-semibold text-[#171614] mt-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[#524E48] leading-relaxed mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aesthetic Token Mapping Table */}
        <div className="mt-8 bg-[#FFFFFF] rounded-xl border border-black/8 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-black/8 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#171614]">
              Interior-to-WebGL Ambiance Token Map
            </span>
            <span className="text-xs text-[#78736A]">Synced automatically by local cafe hours</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F6] text-[#78736A] border-b border-black/8">
                  <th className="py-3 px-4 font-medium">Preset</th>
                  <th className="py-3 px-4 font-medium">Service Hours</th>
                  <th className="py-3 px-4 font-medium">Physical Surfaces</th>
                  <th className="py-3 px-4 font-medium">Lighting Specification</th>
                  <th className="py-3 px-4 font-medium">Hex Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {Object.values(AESTHETIC_PRESETS).map((preset) => (
                  <tr key={preset.id}>
                    <td className="py-3 px-4 font-medium text-[#171614] whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-xs border border-black/20"
                          style={{ backgroundColor: preset.swatchHex }}
                        />
                        {preset.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-[#524E48] whitespace-nowrap">
                      {preset.timeWindow}
                    </td>
                    <td className="py-3 px-4 text-[#524E48]">{preset.materialNote}</td>
                    <td className="py-3 px-4 text-[#524E48]">{preset.lightingSpec}</td>
                    <td className="py-3 px-4 font-mono-tabular text-[#524E48] whitespace-nowrap">
                      {preset.bgHex} · {preset.keyLightHex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 2: Required 3D Models to Download / Source */}
      <section className="py-12 border-b border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#78736A] mb-2">
              02. Downloadable 3D Asset Manifest (.GLB / .HDR)
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171614]">
              10 Required 3D Elements to Download for IDE Development
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EAE7E0] rounded-lg overflow-x-auto max-w-full">
            {(['All', 'Core Hero', 'Menu Showcase', 'Environment', 'Lighting'] as AssetFilter[]).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAssetFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    assetFilter === f
                      ? 'bg-[#FFFFFF] text-[#171614] shadow-xs'
                      : 'text-[#524E48] hover:text-[#171614]'
                  }`}
                >
                  {f}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-black/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF9F6] text-[#78736A] border-b border-black/8">
                  <th className="py-3 px-4 font-medium">#</th>
                  <th className="py-3 px-4 font-medium">3D Asset &amp; Tier</th>
                  <th className="py-3 px-4 font-medium">Target IDE File Path</th>
                  <th className="py-3 px-4 font-medium">Format &amp; Poly Budget</th>
                  <th className="py-3 px-4 font-medium">PBR Textures</th>
                  <th className="py-3 px-4 font-medium">Where to Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6">
                {filteredAssets.map((asset, i) => (
                  <tr key={asset.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-4 font-mono-tabular text-[#78736A]">
                      {String(i + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#171614]">{asset.name}</p>
                      <p className="text-[11px] text-[#78736A] mt-0.5">
                        {asset.priority} · {asset.usage}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono-tabular text-[11px] text-[#94632E] whitespace-nowrap">
                      {asset.fileName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="text-[#171614] font-medium">{asset.format}</p>
                      <p className="font-mono-tabular text-[11px] text-[#78736A]">
                        {asset.polyBudget}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-[#524E48] max-w-xs">{asset.textureSpec}</td>
                    <td className="py-3.5 px-4 text-[#524E48]">{asset.recommendedSources}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compression CLI Callout */}
        <div className="mt-6 rounded-xl bg-[#171614] text-[#F6F5F2] p-5 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs text-[#C99C58] mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>IDE Optimization Command (Draco + WebP keeps initial 3D bundle under 3.5 MB)</span>
          </div>
          <pre className="font-mono-tabular text-xs leading-relaxed text-[#E7E3DC]">
{`npm install -g @gltf-transform/cli
gltf-transform optimize raw/cortado-stoneware-set.glb public/models/cortado-stoneware-set.glb --compress draco --texture-compress webp --texture-size 1024`}
          </pre>
        </div>
      </section>

      {/* Section 3: Phase-Wise Development, Testing & Deployment Distribution */}
      <section className="py-12">
        <p className="text-xs font-medium text-[#78736A] mb-2">
          03. Phase-Wise Execution, Testing &amp; Deployment Roadmap
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#171614] mb-6">
          8-Week Commercial Delivery Schedule (6 Structured Phases)
        </h2>

        <div className="space-y-4">
          {DEVELOPMENT_PHASES.map((p) => (
            <article
              key={p.phase}
              className="bg-[#FFFFFF] rounded-xl border border-black/8 p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#78736A]">
                <span className="font-mono-tabular font-medium text-[#94632E]">{p.phase}</span>
                <span aria-hidden="true">·</span>
                <span>{p.duration}</span>
                <span aria-hidden="true">·</span>
                <span>Lead: {p.owner}</span>
              </div>

              <h3 className="font-display text-2xl font-semibold text-[#171614] mt-1.5">
                {p.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-xs font-semibold text-[#171614] mb-2">Engineering Objectives</p>
                  <ul className="space-y-1.5 text-xs text-[#524E48] list-disc pl-4 leading-relaxed">
                    {p.objectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#171614] mb-2">Deliverables</p>
                  <ul className="space-y-1.5 text-xs text-[#524E48] list-disc pl-4 leading-relaxed">
                    {p.deliverables.map((del) => (
                      <li key={del}>{del}</li>
                    ))}
                  </ul>
                  <p className="mt-4 px-3.5 py-2.5 rounded-lg bg-[#F6F5F2] text-xs text-[#171614]">
                    <span className="font-semibold">Exit Gate:</span> {p.exitGate}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
