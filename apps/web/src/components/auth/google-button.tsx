type Props = {
  href: string;
  label?: string;
};

export const GoogleButton = ({ href, label = "Continue with Google" }: Props) => {
  return (
    <a
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:border-slate-500 hover:bg-slate-800"
      href={href}
    >
      <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M21.35 11.1H12v2.98h5.35c-.23 1.52-1.75 4.46-5.35 4.46-3.22 0-5.84-2.67-5.84-5.96s2.62-5.96 5.84-5.96c1.84 0 3.07.78 3.77 1.46l2.58-2.5C16.68 3.98 14.54 3 12 3 6.93 3 2.82 7.16 2.82 12.25S6.93 21.5 12 21.5c6.93 0 9.17-4.84 9.17-7.34 0-.49-.05-.84-.12-1.06z"
          fill="#fff"
        />
      </svg>
      {label}
    </a>
  );
};
