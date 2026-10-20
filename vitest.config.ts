import { defineConfig } from "vitest/config";

// export default здесь обязателен: так Vitest находит свою конфигурацию
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
});
