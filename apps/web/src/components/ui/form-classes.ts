/** Shared Tailwind classes for accessible, responsive forms (dark theme). */

export const formLabelClass = "block text-sm font-medium text-slate-300";

export const formInputClass =
  "w-full min-h-[2.75rem] rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60";

export const formTextareaClass =
  "w-full min-h-[6.5rem] rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-60";

export const formSelectClass = formInputClass;

export const formButtonPrimaryClass =
  "inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60";

export const formButtonSecondaryClass =
  "inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-slate-600 bg-slate-900 px-4 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/30";

export const formCardClass =
  "rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm sm:p-6";

export const formFieldGroupClass = "space-y-4 sm:space-y-5";
