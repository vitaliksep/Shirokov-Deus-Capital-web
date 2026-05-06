import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function LeadForm({
  isOpen,
  onClose,
  formType = "Консультация",
  showMessenger = false,
  showMessage = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    messenger: "WhatsApp",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [clientId, setClientId] = useState("");

  // Получаем Яндекс.Метрика Client ID при открытии формы
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const tryGetClientId = () => {
      if (typeof window.ym === "function") {
        window.ym(108452415, "getClientID", (id) => {
          if (id) setClientId(String(id));
        });
      }
    };

    // Пробуем сразу, потом повторяем — Метрика может грузиться асинхронно
    tryGetClientId();
    const timer = setTimeout(tryGetClientId, 1500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Получение UTM-меток из URL
  const getUTMParams = () => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      utmContent: params.get("utm_content"),
      utmTerm: params.get("utm_term"),
    };
  };

  // Улучшенное форматирование телефона
  const formatPhone = (value) => {
    // Убираем все нецифровые символы
    let digits = value.replace(/\D/g, "");

    // Если пустая строка, возвращаем пустую строку
    if (digits === "") {
      return "";
    }

    // Если начинается с 8, заменяем на 7
    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    // Если пользователь ввел "89" после "+7", удаляем "8"
    // Это обработает случай когда пользователь вводит "+789..."
    if (digits.startsWith("789")) {
      digits = "7" + digits.slice(2);
    }

    // Если не начинается с 7, добавляем 7
    if (!digits.startsWith("7")) {
      digits = "7" + digits;
    }

    // Ограничиваем до 11 цифр (1 для кода страны + 10 для номера)
    digits = digits.slice(0, 11);

    // Форматируем: +7(XXX)-XXX-XX-XX
    let formatted = "+7";

    if (digits.length > 1) {
      formatted += "(" + digits.substring(1, 4);
    }
    if (digits.length >= 5) {
      formatted += ")-" + digits.substring(4, 7);
    }
    if (digits.length >= 8) {
      formatted += "-" + digits.substring(7, 9);
    }
    if (digits.length >= 10) {
      formatted += "-" + digits.substring(9, 11);
    }

    return formatted;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Если пользователь удалил всё содержимое, оставляем пустое поле
    if (value === "" || value === "+") {
      setFormData({ ...formData, phone: "" });
      return;
    }

    const formatted = formatPhone(value);
    setFormData({ ...formData, phone: formatted });
  };

  const handlePhoneFocus = (e) => {
    // При фокусе, если поле пустое, ставим +7
    if (!formData.phone) {
      setFormData({ ...formData, phone: "+7" });
    }
  };

  const handlePhoneBlur = (e) => {
    // При потере фокуса, если только "+7", очищаем поле
    if (formData.phone === "+7" || formData.phone === "+7(") {
      setFormData({ ...formData, phone: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const utmParams = getUTMParams();

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          formType,
          clientId,
          ...utmParams,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          phone: "",
          email: "",
          messenger: "WhatsApp",
          message: "",
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Декоративный элемент */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A2466] via-[#00CED1] to-[#0A2466] z-10 flex-shrink-0" />

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X size={20} className="text-[#2C2C2C]" />
        </button>

        {/* Скроллируемое содержимое */}
        <div className="overflow-y-auto flex-1 p-8 pt-9">
          <h3 className="text-2xl font-bold text-[#0A2466] mb-2 font-helvetica">
            {formType}
          </h3>
          <p className="text-[#2C2C2C] mb-6 font-inter">
            Заполните форму и наш эксперт свяжется с вами в течение 5-10 минут
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Ваше имя *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent text-[#2C2C2C] placeholder:text-[#2C2C2C]/50"
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Телефон *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                onFocus={handlePhoneFocus}
                onBlur={handlePhoneBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent text-[#2C2C2C] placeholder:text-[#2C2C2C]/50"
                placeholder="+7(___)-___-__-__"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent text-[#2C2C2C] placeholder:text-[#2C2C2C]/50"
                placeholder="your@email.com"
              />
            </div>

            {showMessenger && (
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Предпочитаемый мессенджер
                </label>
                <select
                  value={formData.messenger}
                  onChange={(e) =>
                    setFormData({ ...formData, messenger: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent text-[#2C2C2C]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="MAX">MAX</option>
                </select>
              </div>
            )}

            {showMessage && (
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Опишите свою задачу
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00CED1] focus:border-transparent resize-none text-[#2C2C2C] placeholder:text-[#2C2C2C]/50"
                  placeholder="Расскажите о своих целях и задачах..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#00CED1] to-[#0A2466] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-helvetica"
            >
              {isSubmitting ? "Отправка..." : "Отправить заявку"}
            </button>

            {submitStatus === "success" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
                ✓ Заявка успешно отправлена!
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
                Произошла ошибка. Попробуйте позже.
              </div>
            )}

            <p className="text-xs text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>

            {/* Кнопка закрытия — видна всегда, особенно важна на маленьких экранах */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all duration-200"
            >
              Закрыть
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
