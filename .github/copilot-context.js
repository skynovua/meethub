export default {
  /** 
   * GitHub Copilot інструкції для MeetHub
   * 
   * Цей файл служить як маркерний файл для Copilot, що допомагає визначити
   * контекст проекту та застосувати правильні інструкції для генерації коду.
   * 
   * На основі файлів в папці docs/:
   * - code-generation-instructions.md
   * - commit-message-guidelines.md
   */
  project: "meethub",
  version: "0.1.0",
  structure: "next.js app directory",
  stack: [
    "typescript",
    "react",
    "next.js",
    "prisma",
    "shadcn/ui",
    "auth.js",
    "stripe"
  ],
  conventions: {
    code: "docs/code-generation-instructions.md",
    commit: "docs/commit-message-guidelines.md"
  }
}
