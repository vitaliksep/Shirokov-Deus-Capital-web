import { Phone, MapPin } from "lucide-react";

const LOGO_URL =
  "https://ucarecdn.com/69133131-b620-4701-b0c0-4bd748d24f2a/-/format/auto/";

export function Footer({ projects, messengers, logoUrl }) {
  const src = logoUrl || LOGO_URL;

  return (
    <footer
      id="footer"
      className="relative aurora-footer border-t border-[#00CED1]/20 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            {/* Логотип в футере */}
            <img
              src={src}
              alt="Shirokov Deus Capital"
              className="h-[72px] w-auto object-contain"
              style={{ maxWidth: "280px" }}
            />
          </div>
          <div>
            <h4 className="font-bold mb-4 font-helvetica">Навигация</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "#for-whom", label: "Для кого подходит" },
                { href: "#guarantees", label: "Гарантии" },
                { href: "#projects", label: "Объекты" },
                { href: "#reviews", label: "Отзывы" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-gray-400 hover:text-[#00CED1] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-helvetica">Проекты</h4>
            <ul className="space-y-2 text-sm">
              {projects.map((project) => (
                <li key={project.id}>
                  <a
                    href={`/${project.id}`}
                    className="text-gray-400 hover:text-[#00CED1] transition-colors"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-helvetica">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} className="text-[#00CED1]" />
                <span>г. Сочи, ул. Юных Ленинцев, д.10</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} className="text-[#00CED1]" />
                <a
                  href="tel:+79384444288"
                  className="hover:text-[#00CED1] transition-colors"
                >
                  8(938)-444-42-88
                </a>
              </li>
              <li>
                <div className="flex space-x-3">
                  {messengers.map((messenger) => (
                    <a
                      key={messenger.name}
                      href={messenger.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={messenger.icon}
                        alt={messenger.name}
                        className="w-8 h-8"
                      />
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#00CED1]/20 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 Shirokov Deus Capital. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
