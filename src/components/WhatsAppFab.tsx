import { businessDetails } from "@/content/legal";

const text = "היי, הגעתי מהאתר - רציתי לשאול יותר על הסמינר";

// Mobile-only, bottom-right (RTL start); the accessibility button takes the opposite corner
export function WhatsAppFab({ aboveTabBar = false }: { aboveTabBar?: boolean }) {
  return (
    <a
      href={`${businessDetails.whatsappUrl}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שיחה בוואטסאפ"
      className={`fixed start-4 z-20 grid ${aboveTabBar ? "bottom-[5.25rem]" : "bottom-4"} size-14 place-items-center rounded-full border border-line bg-bg/90 text-fg opacity-90 shadow-md backdrop-blur sm:hidden`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.200-.3.200-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.4l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.100-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.8 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.200-1.100.2-1.200-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    </a>
  );
}
