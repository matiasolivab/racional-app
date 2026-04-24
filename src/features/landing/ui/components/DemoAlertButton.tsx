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
    globalThis.alert(message);
  };

  return (
    <button type="button" aria-label={ariaLabel} className={`${className} cursor-pointer`} onClick={handleClick}>
      {children}
    </button>
  );
}
