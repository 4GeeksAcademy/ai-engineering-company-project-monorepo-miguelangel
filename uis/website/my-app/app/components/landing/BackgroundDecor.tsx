type BackgroundVariant = "landing" | "application";

interface BackgroundDecorProps {
  variant: BackgroundVariant;
}

export function BackgroundDecor({ variant }: BackgroundDecorProps) {
  if (variant === "application") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
    </div>
  );
}