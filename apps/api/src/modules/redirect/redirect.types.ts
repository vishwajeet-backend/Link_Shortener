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
      outcome: "HIDDEN";
      message: string;
    }
  | {
      outcome: "DELETED";
      message: string;
    }
  | {
      outcome: "NOT_FOUND";
      message: string;
    };
