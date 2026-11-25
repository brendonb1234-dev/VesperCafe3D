import { useState } from 'react';
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CAFE_TABLES } from '../data/cafeData';
import type { CartItem, ConfirmedOrder, OrderStage } from '../types/commerce';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  activeOrder: ConfirmedOrder | null;
  onPlaceOrder: (order: ConfirmedOrder) => void;
  onAdvanceOrderStage: () => void;
  onClearOrder: () => void;
}

const ORDER_STAGES: { stage: OrderStage; label: string; detail: string }[] = [
  { stage: 0, label: 'Order Confirmed', detail: 'Ticket received at travertine espresso bar' },
  { stage: 1, label: 'Grinding & Extracting', detail: 'Barista pulling single-origin shots & steaming milk' },
  { stage: 2, label: 'Plating & Check', detail: 'Warming viennoiserie & finishing rosetta pour' },
  { stage: 3, label: 'Ready to Enjoy', detail: 'Waiting at the fluted pickup pass or en route to table' },
];

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  activeOrder,
  onPlaceOrder,
  onAdvanceOrderStage,
  onClearOrder,
}: CartDrawerProps) {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'table'>('pickup');
  const [tableNumber, setTableNumber] = useState(CAFE_TABLES[0].label);
  const [pickupWindow, setPickupWindow] = useState('ASAP (6–8 min)');
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [tipRate, setTipRate] = useState(0.15);
  const [step, setStep] = useState<'bag' | 'checkout'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'counter'>('card');

  if (!open) return null;

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * 0.0825;
  const tip = taxable * tipRate;
  const total = taxable + tax + tip;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'VESPER10') {
      setPromoApplied(true);
      setPromoMessage('10% first-order roastery discount applied.');
    } else {
      setPromoApplied(false);
      setPromoMessage('Invalid code. Try VESPER10 for 10% off.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || items.length === 0) return;

    const order: ConfirmedOrder = {
      orderNumber: `VSP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      fulfillment,
      tableNumber: fulfillment === 'table' ? tableNumber : undefined,
      pickupWindow,
      paymentMethod,
      items: [...items],
      subtotal,
      discount,
      tax,
      tip,
      total,
      stage: 0,
    };

    onPlaceOrder(order);
    onClearCart();
    setStep('bag');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45"
      role="dialog"
      aria-modal="true"
      aria-label="Order Bag & Live Tracker"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-[#FFFFFF] flex flex-col border-l border-black/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#171614]">
              {activeOrder && items.length === 0
                ? `Order ${activeOrder.orderNumber}`
                : step === 'checkout'
                  ? 'Checkout'
                  : 'Your Order Bag'}
            </h2>
            <p className="text-xs text-[#78736A]">
              {items.length > 0
                ? `${items.reduce((s, i) => s + i.quantity, 0)} items · Prepared to order`
                : activeOrder
                  ? 'Live barista preparation tracker'
                  : 'Counter pickup or tableside delivery'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag drawer"
            className="p-2 rounded-lg text-[#524E48] hover:bg-[#F2EFE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Active Confirmed Order Tracker */}
          {activeOrder && items.length === 0 ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#F6F5F2] border border-black/8">
                <div className="flex items-center justify-between text-xs text-[#78736A]">
                  <span>Confirmed at {activeOrder.createdAt}</span>
                  <span className="font-mono-tabular font-medium text-[#171614]">
                    ${activeOrder.total.toFixed(2)}
                  </span>
                </div>
                <p className="font-display text-xl font-semibold text-[#171614] mt-1">
                  {activeOrder.fulfillment === 'table'
                    ? `Serving to ${activeOrder.tableNumber}`
                    : `Counter Pickup · ${activeOrder.pickupWindow}`}
                </p>
                <p className="text-xs text-[#524E48] mt-1">
                  Guest: {activeOrder.customerName} ·{' '}
                  {activeOrder.paymentMethod === 'counter' ? 'Pay at Counter' : 'Paid via Card'}
                </p>
              </div>

              {/* Preparation Stages */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#171614]">Barista Status</p>
                {ORDER_STAGES.map((s) => {
                  const done = activeOrder.stage >= s.stage;
                  const current = activeOrder.stage === s.stage;
                  return (
                    <div
                      key={s.stage}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        current
                          ? 'border-[#94632E] bg-[#94632E]/6'
                          : done
                            ? 'border-black/8 bg-[#FAF9F7]'
                            : 'border-black/6 opacity-55'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0 mt-0.5 ${
                          done
                            ? 'bg-[#244235] text-white'
                            : 'border border-black/25 text-[#78736A]'
                        }`}
                      >
                        {done ? <Check className="w-3 h-3" /> : s.stage + 1}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#171614]">{s.label}</p>
                        <p className="text-[11px] text-[#524E48] mt-0.5">{s.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Receipt */}
              <div className="border-t border-black/8 pt-4 space-y-2">
                <p className="text-xs font-semibold text-[#171614]">Receipt Summary</p>
                {activeOrder.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between gap-3 text-xs">
                    <div className="text-[#524E48]">
                      <span className="font-medium text-[#171614]">
                        {item.quantity}x {item.name}
                      </span>
                      <p className="text-[11px] text-[#78736A]">{item.summary}</p>
                    </div>
                    <span className="font-mono-tabular text-[#171614] shrink-0">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                {activeOrder.stage < 3 && (
                  <button
                    type="button"
                    onClick={onAdvanceOrderStage}
                    className="flex-1 py-2.5 px-4 text-xs font-medium rounded-lg bg-[#171614] text-[#F6F5F2] hover:bg-[#2B2926] transition-colors"
                  >
                    Simulate Next Barista Step
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClearOrder}
                  className="py-2.5 px-4 text-xs font-medium rounded-lg border border-black/14 text-[#171614] hover:bg-[#F2EFE9] transition-colors"
                >
                  New Order
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-8 h-8 text-[#78736A] mb-3 opacity-60" />
              <p className="font-display text-xl font-semibold text-[#171614]">
                Your bag is empty
              </p>
              <p className="text-xs text-[#78736A] max-w-xs mt-1.5">
                Inspect a drink in 3D or customize single-origin espresso and viennoiserie from our
                menu.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#171614] text-[#F6F5F2] hover:bg-[#2B2926] transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-6">
              {/* Fulfillment Mode */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAE7E0] rounded-lg">
                <button
                  type="button"
                  onClick={() => setFulfillment('pickup')}
                  className={`py-2 text-xs font-medium rounded-md transition-colors ${
                    fulfillment === 'pickup'
                      ? 'bg-[#FFFFFF] text-[#171614] shadow-xs'
                      : 'text-[#524E48]'
                  }`}
                >
                  Counter Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment('table')}
                  className={`py-2 text-xs font-medium rounded-md transition-colors ${
                    fulfillment === 'table'
                      ? 'bg-[#FFFFFF] text-[#171614] shadow-xs'
                      : 'text-[#524E48]'
                  }`}
                >
                  Serve to Table
                </button>
              </div>

              {fulfillment === 'table' ? (
                <div>
                  <label htmlFor="bag-table" className="block text-xs font-medium text-[#171614] mb-1.5">
                    Select Your Cafe Table
                  </label>
                  <select
                    id="bag-table"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614]"
                  >
                    {CAFE_TABLES.map((t) => (
                      <option key={t.id} value={t.label}>
                        {t.label} — {t.zone}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label htmlFor="bag-pickup" className="block text-xs font-medium text-[#171614] mb-1.5">
                    Pickup Window
                  </label>
                  <select
                    id="bag-pickup"
                    value={pickupWindow}
                    onChange={(e) => setPickupWindow(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614]"
                  >
                    <option value="ASAP (6–8 min)">ASAP (6–8 min)</option>
                    <option value="In 15 minutes">In 15 minutes</option>
                    <option value="In 30 minutes">In 30 minutes</option>
                  </select>
                </div>
              )}

              {/* Itemized List */}
              <div className="divide-y divide-black/8">
                {items.map((item) => (
                  <div key={item.cartId} className="py-4 first:pt-0 flex gap-3.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-[#EAE7E0] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-[#171614] leading-snug">
                          {item.name}
                        </p>
                        <span className="font-mono-tabular text-xs font-medium text-[#171614] shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78736A] mt-1 leading-relaxed">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="inline-flex items-center border border-black/12 rounded-md">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartId, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="p-1.5 text-[#171614] hover:bg-[#F2EFE9]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono-tabular px-2.5 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.cartId, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="p-1.5 text-[#171614] hover:bg-[#F2EFE9]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartId)}
                          aria-label={`Remove ${item.name}`}
                          className="p-1.5 text-[#78736A] hover:text-[#A33622] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-2 border-t border-black/8">
                <label htmlFor="promo-code" className="block text-xs font-medium text-[#171614] mb-1.5">
                  Promo Code (try VESPER10)
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo-code"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="VESPER10"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-black/14 text-[#171614] hover:bg-[#F2EFE9] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      promoApplied ? 'text-[#244235]' : 'text-[#A33622]'
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Barista Tip */}
              <div>
                <p className="text-xs font-medium text-[#171614] mb-2">Barista Gratuity</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 0.1, 0.15, 0.2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setTipRate(rate)}
                      className={`py-2 text-xs font-mono-tabular rounded-md border transition-colors ${
                        tipRate === rate
                          ? 'bg-[#171614] text-[#F6F5F2] border-[#171614]'
                          : 'border-black/12 text-[#171614] hover:border-black/30'
                      }`}
                    >
                      {Math.round(rate * 100)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="text-xs font-medium text-[#94632E] hover:underline"
              >
                ← Back to Bag
              </button>

              <div>
                <label htmlFor="chk-name" className="block text-xs font-medium text-[#171614] mb-1.5">
                  Name for Order
                </label>
                <input
                  id="chk-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Marcus Chen"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614]"
                />
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-medium text-[#171614] mb-1.5">
                  Mobile Number (SMS ready alert)
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 234-8910"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#171614] mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'card' as const, label: 'Card / Apple Pay' },
                    { id: 'counter' as const, label: 'Pay at Counter' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`py-2.5 px-3 text-xs font-medium rounded-lg border transition-colors ${
                        paymentMethod === opt.id
                          ? 'bg-[#171614] text-[#F6F5F2] border-[#171614]'
                          : 'border-black/14 text-[#171614] hover:border-black/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F6F5F2] border border-black/8 text-xs text-[#524E48]">
                {fulfillment === 'table'
                  ? `Your drinks and pastries will be delivered directly to ${tableNumber}.`
                  : `Pickup at the fluted travertine counter · ${pickupWindow}.`}
              </div>
            </form>
          )}
        </div>

        {/* Footer Totals & CTA */}
        {items.length > 0 && (
          <div className="border-t border-black/10 px-6 py-5 bg-[#FAF9F7] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#524E48]">
                <span>Subtotal</span>
                <span className="font-mono-tabular">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#244235]">
                  <span>VESPER10 (10%)</span>
                  <span className="font-mono-tabular">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#524E48]">
                <span>Sales Tax (8.25%)</span>
                <span className="font-mono-tabular">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#524E48]">
                <span>Barista Tip ({Math.round(tipRate * 100)}%)</span>
                <span className="font-mono-tabular">${tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#171614] pt-2 border-t border-black/8">
                <span>Total</span>
                <span className="font-mono-tabular">${total.toFixed(2)}</span>
              </div>
            </div>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors"
              >
                Continue to Checkout · <span className="font-mono-tabular">${total.toFixed(2)}</span>
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 px-5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors"
              >
                Place Order · <span className="font-mono-tabular">${total.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
