'use client';

type DemoAlertButtonProps = {
  readonly children: React.ReactNode;
  readonly ariaLabel: string;
  readonly className: string;
  readonly message?: string;
};

export function DemoAlertButton(props: DemoAlertButtonProps) {
  const { children, ariaLabel, className, message = 'No disponible en la demo' } = props;

  const handleClick = () => {
    // `alert` is the PRD-specified fallback for R-L3 demo CTAs; acceptable here
    // because this component is client-only and intentionally ephemeral. If a
    // future design swaps the alert for a toast, this is the single place to
    // change. Uses `globalThis` per `unicorn/prefer-global-this`.
    globalThis.alert(message);
  };

  return (
    <button type="button" aria-label={ariaLabel} className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
