/** Small marker shown on an EventCard when the event has a Google Calendar counterpart (event.googleEventId is set). */
export function GoogleEventBadge() {
  return (
    <span
      title="ซิงก์กับ Google Calendar"
      aria-label="Google Calendar"
      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#4285F4]"
    >
      G
    </span>
  );
}
