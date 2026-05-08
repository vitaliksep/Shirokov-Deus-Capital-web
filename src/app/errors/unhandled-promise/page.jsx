<<<<<<< HEAD
"use client";
import { useEffect } from "react";
=======
'use client';
import { useEffect } from 'react';
>>>>>>> 704a5b5d00475b279f7dc72c74c8b05ce837d5dd

// Тестовая страница: намеренно вызывает необработанное отклонение Promise
// Используется для проверки работы error boundary / мониторинга ошибок
export default function UnhandledPromisePage() {
  useEffect(() => {
    // Намеренно не добавляем .catch() — тест для unhandledrejection
    fetch("/unknown");
  }, []);

  return <div>unhandled promise test page</div>;
}
