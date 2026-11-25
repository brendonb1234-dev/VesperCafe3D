import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { MenuItem } from '../data/cafeData';
import type { CartItem } from '../types/commerce';

interface CustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

const MILK_OPTIONS = [
  { label: 'Organic Whole Milk', delta: 0 },
  { label: 'Barista Oat Milk', delta: 0.75 },
  { label: 'House Almond Milk', delta: 0.75 },
  { label: 'No Milk / Black', delta: 0 },
];

const SIZE_OPTIONS = [
  { label: 'Standard', delta: 0 },
  { label: 'Large (+4 oz)', delta: 1.0 },
];

const ROAST_OPTIONS = [
  { label: 'House Reserve Blend', delta: 0 },
  { label: 'Ethiopia Yirgacheffe', delta: 0.75 },
  { label: 'Swiss Water Decaf', delta: 0 },
];

const GRIND_OPTIONS = ['Whole Bean', 'Espresso Fine', 'Pour-Over Medium', 'French Press Coarse'];

export function CustomizeModal({ item, onClose, onAddToCart }: CustomizeModalProps) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [milkIdx, setMilkIdx] = useState(0);
  const [roastIdx, setRoastIdx] = useState(0);
  const [temperature, setTemperature] = useState<'Hot' | 'Iced'>('Hot');
  const [extraShot, setExtraShot] = useState(false);
  const [warmed, setWarmed] = useState(true);
  const [grind, setGrind] = useState(GRIND_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!item) return;
    setSizeIdx(0);
    setMilkIdx(item.id === 'velvet-flat-white' ? 1 : item.id === 'ethiopia-pourover' || item.id === 'yuzu-espresso-tonic' ? 3 : 0);
    setRoastIdx(item.id === 'ethiopia-pourover' ? 1 : 0);
    setTemperature(item.id === 'yuzu-espresso-tonic' ? 'Iced' : 'Hot');
    setExtraShot(false);
    setWarmed(true);
    setGrind(GRIND_OPTIONS[0]);
    setQuantity(1);
    setNotes('');
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const isDrink = item.customizable === 'drink';
  const isPastry = item.customizable === 'pastry';
  const isBeans = item.customizable === 'beans';

  const unitPrice =
    item.basePrice +
    (isDrink
      ? SIZE_OPTIONS[sizeIdx].delta +
        MILK_OPTIONS[milkIdx].delta +
        ROAST_OPTIONS[roastIdx].delta +
        (extraShot ? 1.5 : 0)
      : 0);

  const lineTotal = unitPrice * quantity;

  const handleConfirm = () => {
    const parts: string[] = [];
    if (isDrink) {
      parts.push(SIZE_OPTIONS[sizeIdx].label);
      parts.push(temperature);
      parts.push(MILK_OPTIONS[milkIdx].label);
      parts.push(ROAST_OPTIONS[roastIdx].label);
      if (extraShot) parts.push('+ Extra Espresso Shot');
    } else if (isPastry) {
      parts.push(warmed ? 'Warmed in stone oven' : 'Room temperature');
    } else if (isBeans) {
      parts.push(`Grind: ${grind}`);
    }
    if (notes.trim()) parts.push(`Note: ${notes.trim()}`);

    onAddToCart({
      cartId: `${item.id}-${Date.now()}`,
      menuId: item.id,
      name: item.name,
      image: item.image,
      unitPrice,
      quantity,
      summary: parts.join(' · '),
      customization: {
        size: isDrink ? SIZE_OPTIONS[sizeIdx].label : undefined,
        milk: isDrink ? MILK_OPTIONS[milkIdx].label : undefined,
        roast: isDrink ? ROAST_OPTIONS[roastIdx].label : undefined,
        temperature: isDrink ? temperature : undefined,
        extraShot: isDrink ? extraShot : undefined,
        warmed: isPastry ? warmed : undefined,
        grind: isBeans ? grind : undefined,
        notes: notes.trim() || undefined,
      },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F6F5F2] rounded-xl border border-black/12 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Preview Column */}
          <div className="md:col-span-5 bg-[#EAE7E0] p-6 flex flex-col justify-between">
            <div>
              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#DDD6C7]">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-[#78736A] mt-4">
                {item.category} · {item.servingSpec}
              </p>
              <h3
                id="customize-modal-title"
                className="font-display text-2xl font-semibold text-[#171614] mt-1"
              >
                {item.name}
              </h3>
              <p className="text-xs text-[#524E48] leading-relaxed mt-2">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-black/8">
              <p className="text-[11px] text-[#78736A]">Tasting Profile</p>
              <p className="text-xs font-medium text-[#171614] mt-0.5">{item.tastingNotes}</p>
            </div>
          </div>

          {/* Right Contiguous Purchase Configurator */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between bg-[#FFFFFF]">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-medium text-[#78736A]">
                  Barista Customization
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close customizer"
                  className="p-1.5 rounded-md text-[#524E48] hover:bg-[#F2EFE9] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {isDrink && (
                  <>
                    {/* Size + Temp */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-[#171614] mb-2">Cup Size</p>
                        <div className="flex flex-col gap-1.5">
                          {SIZE_OPTIONS.map((opt, idx) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setSizeIdx(idx)}
                              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-colors ${
                                sizeIdx === idx
                                  ? 'border-[#171614] bg-[#171614] text-[#F6F5F2]'
                                  : 'border-black/12 text-[#171614] hover:border-black/30'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {opt.delta > 0 && (
                                <span className="font-mono-tabular opacity-80">
                                  +${opt.delta.toFixed(2)}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#171614] mb-2">Temperature</p>
                        <div className="flex flex-col gap-1.5">
                          {(['Hot', 'Iced'] as const).map((temp) => (
                            <button
                              key={temp}
                              type="button"
                              onClick={() => setTemperature(temp)}
                              className={`px-3 py-2 text-xs text-left rounded-lg border transition-colors ${
                                temperature === temp
                                  ? 'border-[#171614] bg-[#171614] text-[#F6F5F2]'
                                  : 'border-black/12 text-[#171614] hover:border-black/30'
                              }`}
                            >
                              {temp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Milk Choice */}
                    <div>
                      <p className="text-xs font-medium text-[#171614] mb-2">Milk Pairing</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {MILK_OPTIONS.map((opt, idx) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setMilkIdx(idx)}
                            className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-colors ${
                              milkIdx === idx
                                ? 'border-[#94632E] bg-[#94632E]/10 text-[#171614] font-medium'
                                : 'border-black/12 text-[#524E48] hover:border-black/30'
                            }`}
                          >
                            <span className="truncate">{opt.label}</span>
                            {opt.delta > 0 && (
                              <span className="font-mono-tabular text-[11px] shrink-0 ml-1">
                                +${opt.delta.toFixed(2)}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Roast Origin */}
                    <div>
                      <p className="text-xs font-medium text-[#171614] mb-2">Espresso / Roast Origin</p>
                      <div className="space-y-1.5">
                        {ROAST_OPTIONS.map((opt, idx) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setRoastIdx(idx)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg border transition-colors ${
                              roastIdx === idx
                                ? 'border-[#94632E] bg-[#94632E]/10 text-[#171614] font-medium'
                                : 'border-black/12 text-[#524E48] hover:border-black/30'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {opt.delta > 0 && (
                              <span className="font-mono-tabular text-[11px]">
                                +${opt.delta.toFixed(2)}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extra Shot Toggle */}
                    <label className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-black/12 cursor-pointer hover:bg-[#FAF9F7]">
                      <span className="text-xs font-medium text-[#171614]">
                        Add Extra Ristretto Shot
                      </span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono-tabular text-xs text-[#524E48]">+$1.50</span>
                        <input
                          type="checkbox"
                          checked={extraShot}
                          onChange={(e) => setExtraShot(e.target.checked)}
                          className="w-4 h-4 accent-[#94632E]"
                        />
                      </div>
                    </label>
                  </>
                )}

                {isPastry && (
                  <div>
                    <p className="text-xs font-medium text-[#171614] mb-2">Preparation</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Warmed in Stone Oven', val: true },
                        { label: 'Room Temperature', val: false },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setWarmed(opt.val)}
                          className={`px-3 py-2.5 text-xs rounded-lg border transition-colors ${
                            warmed === opt.val
                              ? 'border-[#171614] bg-[#171614] text-[#F6F5F2]'
                              : 'border-black/12 text-[#171614] hover:border-black/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isBeans && (
                  <div>
                    <p className="text-xs font-medium text-[#171614] mb-2">Grind Calibration</p>
                    <div className="grid grid-cols-2 gap-2">
                      {GRIND_OPTIONS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrind(g)}
                          className={`px-3 py-2.5 text-xs rounded-lg border transition-colors ${
                            grind === g
                              ? 'border-[#171614] bg-[#171614] text-[#F6F5F2]'
                              : 'border-black/12 text-[#171614] hover:border-black/30'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Notes */}
                <div>
                  <label htmlFor="barista-notes" className="block text-xs font-medium text-[#171614] mb-1.5">
                    Barista Notes (optional)
                  </label>
                  <input
                    id="barista-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Light foam, extra hot, side of sparkling water..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] placeholder:text-[#8E8980] focus:outline-none focus:border-[#94632E]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Quantity + Add CTA */}
            <div className="flex items-center justify-between gap-4 pt-5 mt-6 border-t border-black/10">
              <div className="inline-flex items-center border border-black/14 rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="p-2.5 text-[#171614] hover:bg-[#F2EFE9] rounded-l-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono-tabular px-3 text-xs font-medium text-[#171614]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                  aria-label="Increase quantity"
                  className="p-2.5 text-[#171614] hover:bg-[#F2EFE9] rounded-r-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 px-5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors whitespace-nowrap"
              >
                Add to Bag · <span className="font-mono-tabular">${lineTotal.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
