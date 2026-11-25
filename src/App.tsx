import { useEffect, useState } from 'react';
import { ArrowRight, Download, ShoppingBag } from 'lucide-react';
import {
  AESTHETIC_PRESETS,
  MENU_ITEMS,
  type AestheticPresetKey,
  type MenuItem,
  type ModelKey,
} from './data/cafeData';
import type { CartItem, ConfirmedOrder, OrderStage, ReservationRecord } from './types/commerce';
import { CafeStage3D } from './components/CafeStage3D';
import { MenuSection } from './components/MenuSection';
import { CustomizeModal } from './components/CustomizeModal';
import { ReservationSection } from './components/ReservationSection';
import { CartDrawer } from './components/CartDrawer';
import { BlueprintView } from './components/BlueprintView';
import { generateStandaloneBlueprintHtml } from './utils/blueprintHtmlGenerator';

const STORAGE_CART_KEY = 'vesper_cafe_cart_v1';
const STORAGE_ORDER_KEY = 'vesper_cafe_active_order_v1';
const STORAGE_RES_KEY = 'vesper_cafe_reservations_v1';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState<'storefront' | 'blueprint'>('storefront');
  const [activeModel, setActiveModel] = useState<ModelKey>('cortado');
  const [aesthetic, setAesthetic] = useState<AestheticPresetKey>('travertine');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStored<CartItem[]>(STORAGE_CART_KEY, []),
  );
  const [activeOrder, setActiveOrder] = useState<ConfirmedOrder | null>(() =>
    loadStored<ConfirmedOrder | null>(STORAGE_ORDER_KEY, null),
  );
  const [reservations, setReservations] = useState<ReservationRecord[]>(() =>
    loadStored<ReservationRecord[]>(STORAGE_RES_KEY, []),
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_ORDER_KEY, JSON.stringify(activeOrder));
    } catch {
      // Ignore storage quota issues
    }
  }, [activeOrder]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_RES_KEY, JSON.stringify(reservations));
    } catch {
      // Ignore storage quota issues
    }
  }, [reservations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => [...prev, newItem]);
    showToast(`Added ${newItem.name} to your bag`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    handleAddToCart({
      cartId: `${item.id}-${Date.now()}`,
      menuId: item.id,
      name: item.name,
      image: item.image,
      unitPrice: item.basePrice,
      quantity: 1,
      summary: item.subtitle,
      customization: {},
    });
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleOrderFrom3D = (menuId: string) => {
    const found = MENU_ITEMS.find((m) => m.id === menuId);
    if (found) setCustomizingItem(found);
  };

  const handleInspect3DFromMenu = (modelKey: ModelKey) => {
    setActiveModel(modelKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceOrderStage = () => {
    setActiveOrder((prev) => {
      if (!prev || prev.stage >= 3) return prev;
      return { ...prev, stage: (prev.stage + 1) as OrderStage };
    });
  };

  const handleDownloadBlueprintDirect = () => {
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
    showToast('Downloaded cafe-3d-website-ide-blueprint.html');
  };

  const navigateToSection = (sectionId: string) => {
    if (viewMode !== 'storefront') {
      setViewMode('storefront');
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const bagSubtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const activePreset = AESTHETIC_PRESETS[aesthetic];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F5F2] text-[#171614]">
      {/* Strict 3-Zone Top Bar Contract (Single-Line Wordmark — 4 Nav Links — 1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-[#F6F5F2]/95 border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand wordmark */}
          <a
            href="#experience"
            onClick={(e) => {
              e.preventDefault();
              setViewMode('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-2xl font-semibold tracking-tight text-[#171614] whitespace-nowrap shrink-0"
          >
            Vesper
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#524E48]"
          >
            <button
              type="button"
              onClick={() => navigateToSection('experience')}
              className={`hover:text-[#171614] transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'storefront' ? 'text-[#171614]' : ''
              }`}
            >
              3D Bar
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('menu')}
              className="hover:text-[#171614] transition-colors whitespace-nowrap shrink-0"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('reserve')}
              className="hover:text-[#171614] transition-colors whitespace-nowrap shrink-0"
            >
              Reserve
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('blueprint');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hover:text-[#171614] transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'blueprint'
                  ? 'text-[#94632E] underline underline-offset-4'
                  : ''
              }`}
            >
              IDE Blueprint
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#171614] text-[#F6F5F2] hover:bg-[#2B2926] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>
                {bagCount > 0 ? (
                  <>
                    Bag ({bagCount}) ·{' '}
                    <span className="font-mono-tabular">${bagSubtotal.toFixed(2)}</span>
                  </>
                ) : activeOrder ? (
                  `Track ${activeOrder.orderNumber}`
                ) : (
                  'Order Bag'
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Switcher */}
      <main className="flex-1">
        {viewMode === 'blueprint' ? (
          <BlueprintView onBackToStorefront={() => setViewMode('storefront')} />
        ) : (
          <>
            {/* SECTION 1: Hero & Interactive 3D Café Tasting Bar */}
            <section id="experience" className="pt-10 pb-16 lg:pt-14 lg:pb-20">
              <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                  {/* Editorial Storefront Column */}
                  <div className="lg:col-span-4 flex flex-col justify-between py-2">
                    <div>
                      <p className="text-xs font-medium text-[#78736A]">
                        Architectural Espresso Bar &amp; Roastery · Daily 07:00 – 22:00
                      </p>
                      <h1
                        className="font-display text-4xl sm:text-5xl font-semibold text-[#171614] leading-[1.06] tracking-tight mt-3"
                        style={{ textWrap: 'balance' }}
                      >
                        Our physical stone bar, experienced in live 3D.
                      </h1>
                      <p className="text-sm text-[#524E48] leading-relaxed mt-4">
                        Every digital texture matches our real café — honed Roman travertine,
                        oiled American walnut, brushed brass, and shifting daylight. Inspect
                        signature pours in 360°, customize your cup, or book your exact table.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-7">
                        <button
                          type="button"
                          onClick={() => navigateToSection('menu')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Order From Menu</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode('blueprint');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-black/15 text-[#171614] hover:bg-[#EAE7E0] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>IDE 3D Blueprint</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Interior Sync Readout */}
                    <div className="mt-10 pt-6 border-t border-black/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#78736A]">Active Interior Sync</span>
                        <span className="font-mono-tabular text-[#171614]">
                          {activePreset.timeWindow}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#171614]">{activePreset.name}</p>
                      <p className="text-xs text-[#524E48] leading-relaxed">
                        {activePreset.materialNote} — {activePreset.lightingSpec}.
                      </p>
                    </div>
                  </div>

                  {/* Interactive 3D WebGL Stage */}
                  <div className="lg:col-span-8">
                    <CafeStage3D
                      activeModel={activeModel}
                      onSelectModel={setActiveModel}
                      aesthetic={aesthetic}
                      onSelectAesthetic={setAesthetic}
                      onOrderModel={handleOrderFrom3D}
                    />
                  </div>
                </div>

                {/* Full-Width 4-Column Architectural Proof & Conversion Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-black/10">
                  <div>
                    <p className="font-mono-tabular text-xs text-[#78736A]">9.0 Bar · 93°C</p>
                    <p className="text-sm font-semibold text-[#171614] mt-1">
                      Calibrated Single-Origin Bar
                    </p>
                    <p className="text-xs text-[#524E48] mt-1">
                      Pulled to order on brushed brass dual-boiler groups.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono-tabular text-xs text-[#78736A]">3 Interior Presets</p>
                    <p className="text-sm font-semibold text-[#171614] mt-1">
                      Physical-to-Web Ambiance
                    </p>
                    <p className="text-xs text-[#524E48] mt-1">
                      Travertine morning, walnut dusk, and basalt evening sync.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono-tabular text-xs text-[#78736A]">9 Architectural Tables</p>
                    <p className="text-sm font-semibold text-[#171614] mt-1">
                      Exact Seat Selection
                    </p>
                    <p className="text-xs text-[#524E48] mt-1">
                      Reserve window light, counter stools, or walnut booths live.
                    </p>
                  </div>
                  <div>
                    <p className="font-mono-tabular text-xs text-[#78736A]">10 .GLB Specs Ready</p>
                    <p className="text-sm font-semibold text-[#171614] mt-1">
                      Exportable IDE Blueprint
                    </p>
                    <p className="text-xs text-[#524E48] mt-1">
                      Download the complete HTML plan &amp; 3D asset manifest anytime.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Menu & Roastery Storefront */}
            <MenuSection
              onCustomizeItem={(item) => setCustomizingItem(item)}
              onQuickAdd={handleQuickAdd}
              onInspect3D={handleInspect3DFromMenu}
            />

            {/* SECTION 3: Architectural Interior Connectivity Story */}
            <section className="py-20 lg:py-24 border-t border-black/10 bg-[#FFFFFF]">
              <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
                  <div className="lg:col-span-7 rounded-xl overflow-hidden bg-[#EAE7E0] min-h-[320px]">
                    <img
                      src="/src/assets/images/cafe_interior_architecture_1795357273042.jpg"
                      alt="Vesper Roastery sunlit fluted travertine espresso counter and smoked walnut shelving"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="lg:col-span-5 flex flex-col justify-between py-2">
                    <div>
                      <p className="text-xs font-medium text-[#78736A] mb-2">
                        Spatial &amp; Aesthetic Continuity
                      </p>
                      <h2
                        className="font-display text-3xl sm:text-4xl font-semibold text-[#171614] tracking-tight"
                        style={{ textWrap: 'balance' }}
                      >
                        From fluted Roman travertine to real-time PBR lighting.
                      </h2>
                      <p className="text-sm text-[#524E48] leading-relaxed mt-4">
                        Most café websites feel disconnected from the room they represent. Vesper
                        translates our physical space directly into the browser: the fluted stone
                        counter becomes our 3D tasting plinth, our hand-thrown speckled ceramics
                        anchor the drink inspector, and our room layout powers live seat booking.
                      </p>
                      <div className="mt-6 space-y-3 pt-6 border-t border-black/8 text-xs text-[#524E48]">
                        <div className="flex justify-between gap-4">
                          <span className="font-medium text-[#171614]">Counter Stone</span>
                          <span>Honed Roman Travertine · Fluted Joinery</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="font-medium text-[#171614]">Timber &amp; Metal</span>
                          <span>Oiled American Walnut · Brushed Brass</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="font-medium text-[#171614]">Ceramics</span>
                          <span>Kiln-fired speckled matte stoneware</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadBlueprintDirect}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-[#171614] text-[#F6F5F2] hover:bg-[#2B2926] transition-colors whitespace-nowrap shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download IDE HTML Blueprint</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('blueprint');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-medium text-[#94632E] hover:underline whitespace-nowrap shrink-0"
                      >
                        Inspect 10 Required 3D Models →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Interactive Floor Plan & Table Reservations */}
            <ReservationSection
              reservations={reservations}
              onCreateReservation={(record) => {
                setReservations((prev) => [record, ...prev]);
                showToast(`Reserved ${record.tableLabel} for ${record.timeSlot}`);
              }}
              onCancelReservation={(code) => {
                setReservations((prev) => prev.filter((r) => r.code !== code));
                showToast(`Reservation ${code} cancelled`);
              }}
            />
          </>
        )}
      </main>

      {/* Quiet Architectural Footer */}
      <footer className="border-t border-black/10 bg-[#F6F5F2] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-semibold text-[#171614]">
              Vesper Roastery &amp; Café
            </p>
            <p className="text-xs text-[#78736A] mt-1">
              412 Mercer Courtyard · Mon–Sun 07:00 – 22:00 · Promo code VESPER10 for 10% off first
              online order
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#524E48]">
            <button
              type="button"
              onClick={() => navigateToSection('menu')}
              className="hover:text-[#171614] transition-colors whitespace-nowrap"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('reserve')}
              className="hover:text-[#171614] transition-colors whitespace-nowrap"
            >
              Floor Plan Booking
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('blueprint');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#171614] transition-colors whitespace-nowrap"
            >
              IDE Blueprint &amp; 3D Assets
            </button>
            <button
              type="button"
              onClick={handleDownloadBlueprintDirect}
              className="text-[#94632E] hover:text-[#7A4F22] transition-colors whitespace-nowrap"
            >
              Export HTML Spec
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CustomizeModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        activeOrder={activeOrder}
        onPlaceOrder={(order) => {
          setActiveOrder(order);
          showToast(`Order ${order.orderNumber} sent to espresso bar`);
        }}
        onAdvanceOrderStage={handleAdvanceOrderStage}
        onClearOrder={() => setActiveOrder(null)}
      />

      {/* Subtle Bottom-Right Confirmation Toast (Non-intrusive, Auto-dismissing) */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-[#171614] text-[#F6F5F2] text-xs font-medium shadow-lg border border-white/10"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
