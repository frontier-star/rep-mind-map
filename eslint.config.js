import eslintJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "typescript-eslint";

// export default здесь обязателен: так ESLint находит свою конфигурацию
export default typescriptEslint.config(
  {
    ignores: ["dist/", "node_modules/", "test/fixtures/"],
  },
  eslintJs.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      // Двойные кавычки, обязательные точки с запятой, отступ 2 пробела
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      // Типы через type, без interface
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      // { [key: string]: T } вместо Record<K, V>
      "@typescript-eslint/consistent-indexed-object-style": ["error", "index-signature"],
      // any запрещён
      "@typescript-eslint/no-explicit-any": "error",
      // Переменные через const, let — только когда значение меняется
      "prefer-const": "error",
      // Только именованные экспорты
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message: "Используйте именованный экспорт вместо export default.",
        },
      ],
    },
  },
  {
    // Конфигурационным файлам инструментов export default нужен по их правилам
    files: ["eslint.config.js", "vitest.config.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
);
