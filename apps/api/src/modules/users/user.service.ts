export class UserService {
  async getModuleHealth(): Promise<{ module: string; status: string }> {
    return { module: "users", status: "ready-for-implementation" };
  }
}

export const userService = new UserService();
