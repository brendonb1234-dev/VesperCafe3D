import { useState } from 'react';
import { Box, Coffee, Plus } from 'lucide-react';
import {
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
  type ModelKey,
} from '../data/cafeData';

interface MenuSectionProps {
  onCustomizeItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onInspect3D: (modelKey: ModelKey) => void;
}

const CATEGORIES: MenuCategory[] = [
  'All',
  'Espresso Bar',
  'Filter & Cold',
  'Viennoiserie',
  'Roastery Bags',
];

function ResilientImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#EAE6DE] text-[#524E48] p-6 text-center">
        <Coffee className="w-6 h-6 mb-2 opacity-60" />
        <span className="font-display text-base font-semibold">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
}

export function MenuSection({
  onCustomizeItem,
  onQuickAdd,
  onInspect3D,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');

  const filteredItems =
    selectedCategory === 'All'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" className="py-20 lg:py-24 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header + Functional Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-[#78736A] mb-2">
              01. Tasting Menu &amp; Roastery
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#171614] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Crafted at the fluted travertine bar, customizable to your cup.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter menu by category"
            className="flex items-center gap-1 p-1 bg-[#EAE7E0] rounded-lg overflow-x-auto max-w-full"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#FFFFFF] text-[#171614] shadow-xs'
                      : 'text-[#524E48] hover:text-[#171614]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uniform 3-Column Storefront Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col bg-[#FFFFFF] rounded-xl border border-black/8 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            >
              {/* Uniform 4:3 Product Photography */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE7E0]">
                <ResilientImage src={item.image} alt={item.name} title={item.name} />
              </div>

              {/* Card Content — Clean Zero-Pill Metadata & Identical Field Order */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#78736A]">
                  <span className="truncate">
                    {item.category} · {item.servingSpec}
                  </span>
                  <span className="shrink-0">{item.availability}</span>
                </div>

                <div className="flex items-baseline justify-between gap-4 mt-2">
                  <h3 className="font-display text-xl font-semibold text-[#171614] leading-snug">
                    {item.name}
                  </h3>
                  <span className="font-mono-tabular text-[15px] font-medium text-[#171614] shrink-0">
                    ${item.basePrice.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-[#524E48] leading-relaxed mt-2 flex-1">
                  {item.description}
                </p>

                <p className="text-xs text-[#78736A] mt-3 pt-3 border-t border-black/6">
                  Notes: {item.tastingNotes}
                </p>

                {/* Functional Actions */}
                <div className="flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onCustomizeItem(item)}
                      className="px-4 py-2 text-xs font-medium bg-[#171614] text-[#F6F5F2] rounded-lg hover:bg-[#2B2926] transition-colors whitespace-nowrap shrink-0"
                    >
                      Customize
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickAdd(item)}
                      aria-label={`Quick add ${item.name} to bag`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium border border-black/14 text-[#171614] rounded-lg hover:bg-[#F2EFE9] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {item.modelKey && (
                    <button
                      type="button"
                      onClick={() => onInspect3D(item.modelKey!)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#94632E] hover:text-[#7A4F22] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>View 3D</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
