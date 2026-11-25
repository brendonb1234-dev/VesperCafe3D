import { useMemo, useState } from 'react';
import { Calendar, Check, Clock, Trash2, Users } from 'lucide-react';
import { CAFE_TABLES, RESERVATION_SLOTS, type CafeTable } from '../data/cafeData';
import type { ReservationRecord } from '../types/commerce';

interface ReservationSectionProps {
  reservations: ReservationRecord[];
  onCreateReservation: (record: ReservationRecord) => void;
  onCancelReservation: (code: string) => void;
}

export function ReservationSection({
  reservations,
  onCreateReservation,
  onCancelReservation,
}: ReservationSectionProps) {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('10:30');
  const [guests, setGuests] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<string>('W2');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [recentPass, setRecentPass] = useState<ReservationRecord | null>(null);

  const bookedTableIds = useMemo(() => {
    const booked = new Set<string>();
    CAFE_TABLES.forEach((t) => {
      if (t.busySlots.includes(timeSlot)) booked.add(t.id);
    });
    reservations.forEach((r) => {
      if (r.date === date && r.timeSlot === timeSlot) {
        booked.add(r.tableId);
      }
    });
    return booked;
  }, [date, timeSlot, reservations]);

  const selectedTable: CafeTable | undefined = CAFE_TABLES.find((t) => t.id === selectedTableId);

  const isTableSelectable = (table: CafeTable) =>
    !bookedTableIds.has(table.id) && table.seats >= guests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedTable) {
      setErrorMsg('Please select a table directly on the architectural floor plan.');
      return;
    }
    if (bookedTableIds.has(selectedTable.id)) {
      setErrorMsg(`${selectedTable.label} is already reserved at ${timeSlot}. Please pick another table.`);
      return;
    }
    if (selectedTable.seats < guests) {
      setErrorMsg(
        `${selectedTable.label} seats up to ${selectedTable.seats}. Select a larger booth or adjust party size.`,
      );
      return;
    }
    if (!guestName.trim() || !guestEmail.trim()) {
      setErrorMsg('Please enter your full name and email address to confirm.');
      return;
    }

    const code = `VSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const record: ReservationRecord = {
      code,
      tableId: selectedTable.id,
      tableLabel: selectedTable.label,
      zone: selectedTable.zone,
      date,
      timeSlot,
      guests,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    onCreateReservation(record);
    setRecentPass(record);
    setGuestName('');
    setGuestEmail('');
    setNote('');
  };

  return (
    <section id="reserve" className="py-20 lg:py-24 border-t border-black/10 bg-[#EFECE6]/55">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-medium text-[#78736A] mb-2">
            02. Spatial Table Reservations
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#171614] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Choose your exact seat inside the café floor plan.
          </h2>
          <p className="text-sm text-[#524E48] leading-relaxed mt-3">
            Every table mirrors our physical interior layout — from morning sunlight along the
            steel casement windows to front-row seats at the fluted travertine espresso bar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Architectural Floor Plan SVG */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-xl border border-black/10 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-black/8">
              <div>
                <h3 className="text-sm font-semibold text-[#171614]">
                  Architectural Floor Plan · Main Room &amp; Courtyard
                </h3>
                <p className="text-xs text-[#78736A] mt-0.5">
                  Showing availability for {date} at {timeSlot} · Party of {guests}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#524E48]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#F6F5F2] border border-[#171614]" />
                  Available
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#94632E]" />
                  Selected
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#DFDCD5] border border-black/15" />
                  Reserved / Too Small
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 680 410"
                className="w-full h-auto min-w-[540px] select-none"
                role="img"
                aria-label="Interactive café floor plan with selectable tables"
              >
                {/* Architectural Limestone Floor Shell */}
                <rect
                  x="16"
                  y="16"
                  width="648"
                  height="378"
                  rx="8"
                  fill="#FAF9F6"
                  stroke="#171614"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                />

                {/* Courtyard Partition */}
                <line
                  x1="530"
                  y1="185"
                  x2="530"
                  y2="394"
                  stroke="#171614"
                  strokeOpacity="0.18"
                  strokeDasharray="5 4"
                />
                <rect
                  x="531"
                  y="186"
                  width="132"
                  height="207"
                  fill="#F1EEE8"
                  fillOpacity="0.7"
                />

                {/* East Casement Windows Highlight */}
                <rect x="14" y="64" width="6" height="295" fill="#94632E" fillOpacity="0.45" />
                <text
                  x="30"
                  y="54"
                  fontSize="10"
                  fill="#78736A"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                >
                  EAST CASEMENT WINDOWS · MORNING SUN
                </text>

                {/* Monolithic Fluted Travertine Espresso Bar */}
                <rect
                  x="385"
                  y="32"
                  width="245"
                  height="64"
                  rx="6"
                  fill="#E4DDD0"
                  stroke="#171614"
                  strokeOpacity="0.25"
                />
                <text
                  x="507"
                  y="60"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#171614"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                >
                  FLUTED TRAVERTINE BAR
                </text>
                <text
                  x="507"
                  y="76"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#524E48"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  BRASS ESPRESSO MACHINE · POUR-OVER
                </text>

                {/* Zone Labels */}
                <text
                  x="240"
                  y="246"
                  fontSize="10"
                  fill="#78736A"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                >
                  SMOKED WALNUT BOOTHS
                </text>
                <text
                  x="546"
                  y="212"
                  fontSize="10"
                  fill="#78736A"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                >
                  COURTYARD
                </text>

                {/* Entrance Indicator */}
                <text
                  x="250"
                  y="36"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#78736A"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  MAIN ENTRANCE ↓
                </text>

                {/* Clickable Tables */}
                {CAFE_TABLES.map((table) => {
                  const isBooked = bookedTableIds.has(table.id);
                  const tooSmall = table.seats < guests;
                  const unavailable = isBooked || tooSmall;
                  const isSelected = selectedTableId === table.id && !unavailable;

                  const fill = isSelected
                    ? '#94632E'
                    : unavailable
                      ? '#E5E2DA'
                      : '#FFFFFF';
                  const stroke = isSelected
                    ? '#7A4F22'
                    : unavailable
                      ? '#C8C3B8'
                      : '#171614';
                  const textColor = isSelected
                    ? '#FFFFFF'
                    : unavailable
                      ? '#8E8980'
                      : '#171614';

                  const cx = table.x + table.w / 2;
                  const cy = table.y + table.h / 2;

                  return (
                    <g
                      key={table.id}
                      onClick={() => {
                        if (!unavailable) {
                          setSelectedTableId(table.id);
                          setErrorMsg('');
                        }
                      }}
                      className={unavailable ? 'cursor-not-allowed' : 'cursor-pointer'}
                      role="button"
                      tabIndex={unavailable ? -1 : 0}
                      aria-label={`${table.label}, ${table.zone}, seats ${table.seats}, ${
                        isBooked ? 'Reserved' : tooSmall ? 'Too small for party' : 'Available'
                      }`}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && !unavailable) {
                          e.preventDefault();
                          setSelectedTableId(table.id);
                          setErrorMsg('');
                        }
                      }}
                    >
                      {table.shape === 'round' ? (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={table.w / 2}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={isSelected ? 2 : 1.25}
                        />
                      ) : (
                        <rect
                          x={table.x}
                          y={table.y}
                          width={table.w}
                          height={table.h}
                          rx={6}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={isSelected ? 2 : 1.25}
                        />
                      )}
                      <text
                        x={cx}
                        y={cy - 3}
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="600"
                        fill={textColor}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {table.label}
                      </text>
                      <text
                        x={cx}
                        y={cy + 11}
                        textAnchor="middle"
                        fontSize="9"
                        fill={textColor}
                        fillOpacity={isSelected ? 0.9 : 0.72}
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {isBooked ? 'FULL' : `${table.seats}P`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Table Architectural Context */}
            {selectedTable && (
              <div className="mt-5 pt-4 border-t border-black/8 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#171614]">
                    {selectedTable.label} · {selectedTable.zone} · Up to {selectedTable.seats} guests
                  </p>
                  <p className="text-xs text-[#524E48] mt-0.5">{selectedTable.aestheticFeature}</p>
                </div>
                <span className="text-xs font-medium text-[#94632E]">
                  {isTableSelectable(selectedTable) ? 'Available for booking' : 'Unavailable for current slot'}
                </span>
              </div>
            )}
          </div>

          {/* Right: Booking Form + Active Passes */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-[#FFFFFF] rounded-xl border border-black/10 p-6 space-y-4"
            >
              <h3 className="font-display text-2xl font-semibold text-[#171614]">
                Reserve Your Table
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="res-date" className="flex items-center gap-1.5 text-xs font-medium text-[#171614] mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#78736A]" />
                    <span>Date</span>
                  </label>
                  <input
                    id="res-date"
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] focus:outline-none focus:border-[#94632E]"
                  />
                </div>

                <div>
                  <label htmlFor="res-guests" className="flex items-center gap-1.5 text-xs font-medium text-[#171614] mb-1.5">
                    <Users className="w-3.5 h-3.5 text-[#78736A]" />
                    <span>Party Size</span>
                  </label>
                  <select
                    id="res-guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] focus:outline-none focus:border-[#94632E]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slot Selector */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-[#171614] mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#78736A]" />
                  <span>Seating Time</span>
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {RESERVATION_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 text-xs font-mono-tabular rounded-md border transition-colors ${
                        timeSlot === slot
                          ? 'bg-[#171614] text-[#F6F5F2] border-[#171614]'
                          : 'bg-[#FAF9F7] text-[#171614] border-black/12 hover:border-black/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="res-name" className="block text-xs font-medium text-[#171614] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] placeholder:text-[#8E8980] focus:outline-none focus:border-[#94632E]"
                  />
                </div>
                <div>
                  <label htmlFor="res-email" className="block text-xs font-medium text-[#171614] mb-1.5">
                    Email for Pass
                  </label>
                  <input
                    id="res-email"
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="elena@studio.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] placeholder:text-[#8E8980] focus:outline-none focus:border-[#94632E]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="res-note" className="block text-xs font-medium text-[#171614] mb-1.5">
                  Seating / Tasting Note (optional)
                </label>
                <input
                  id="res-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Pour-over flight tasting, laptop outlet preferred..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-black/14 bg-[#FAF9F7] text-[#171614] placeholder:text-[#8E8980] focus:outline-none focus:border-[#94632E]"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-[#A33622] bg-[#A33622]/8 px-3 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-5 text-xs font-medium rounded-lg bg-[#94632E] hover:bg-[#7A4F22] text-white transition-colors"
              >
                Confirm {selectedTable ? selectedTable.label : 'Table'} · {timeSlot}
              </button>

              {recentPass && (
                <div className="p-3.5 rounded-lg bg-[#244235]/8 border border-[#244235]/20 text-xs text-[#171614]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#244235]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Reservation Confirmed · {recentPass.code}</span>
                  </div>
                  <p className="mt-1 text-[#524E48]">
                    {recentPass.tableLabel} ({recentPass.zone}) on {recentPass.date} at{' '}
                    {recentPass.timeSlot} for {recentPass.guests}.
                  </p>
                </div>
              )}
            </form>

            {/* Saved Reservations List */}
            {reservations.length > 0 && (
              <div className="bg-[#FFFFFF] rounded-xl border border-black/10 p-5">
                <p className="text-xs font-semibold text-[#171614] mb-3">
                  Your Upcoming Reservations ({reservations.length})
                </p>
                <div className="divide-y divide-black/8">
                  {reservations.map((res) => (
                    <div
                      key={res.code}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#171614] truncate">
                          <span className="font-mono-tabular">{res.code}</span> · {res.tableLabel} ·{' '}
                          {res.date} at {res.timeSlot}
                        </p>
                        <p className="text-[11px] text-[#78736A] truncate">
                          {res.guestName} · {res.guests} {res.guests === 1 ? 'guest' : 'guests'} ·{' '}
                          {res.zone}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCancelReservation(res.code)}
                        aria-label={`Cancel reservation ${res.code}`}
                        className="p-1.5 text-[#78736A] hover:text-[#A33622] transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
