import { APP_NAME } from "./config/constants";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { app } from "./app";

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.info(`${APP_NAME} is running on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
