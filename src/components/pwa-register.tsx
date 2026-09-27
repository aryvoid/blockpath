import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "blockpath-pwa-dismiss";

export function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      };
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
    }

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed === "1") return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      // @ts-expect-error iOS standalone
      !window.navigator.standalone;
    if (isIos && !dismissed) {
      const t = window.setTimeout(() => setShow(true), 2500);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBip);
        window.clearTimeout(t);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = () => {
    setShow(false);
    setDeferred(null);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      dismiss();
    }
  };

  if (!show) return null;

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md animate-in fade-in">
      <div className="glass-card flex items-start gap-3 rounded-2xl p-3.5 shadow-2xl">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fg">Install Blockpath</p>
          <p className="mt-0.5 text-xs leading-snug text-muted">
            {isIos && !deferred
              ? "Tap Share → Add to Home Screen for offline tools."
              : "Add to your home screen — works offline."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          {deferred && (
            <button
              type="button"
              onClick={install}
              className="accent-pill rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              Install
            </button>
          )}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted hover:text-fg"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
