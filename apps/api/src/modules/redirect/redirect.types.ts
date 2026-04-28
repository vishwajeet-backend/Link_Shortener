export type RedirectResolution =
  | {
      outcome: "ACTIVE";
      targetUrl: string;
    }
  | {
      outcome: "PAUSED";
      message: string;
    }
  | {
      outcome: "NOT_FOUND";
      message: string;
    };
