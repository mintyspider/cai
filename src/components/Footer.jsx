// src/components/Footer.jsx
export function Footer() {
  return (
    <footer className=" border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p>© 2025 CAI. Все права защищены.</p>
        <div className="mt-2">
          <a href="#" className="hover:text-blue-600 mx-2">О нас</a>
          <a href="#" className="hover:text-blue-600 mx-2">Документация</a>
        </div>
      </div>
    </footer>
  );
}