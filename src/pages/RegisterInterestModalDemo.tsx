import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../i18n/LanguageProvider";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTheme } from "../theme";
import { GoArrowUpRight } from "react-icons/go";
import { CountryCodes } from "../components/country";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";
import { trackEvent } from "../utils/analytics";

export default function RegisterInterestModalDemo({
  trigger,
  isWhite,
  project_name,
}: {
  trigger?: boolean;
  isWhite?: boolean;
  project_name?: string;
}) {
  const { t, language, setLanguage } = useLanguage();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [dialCode, setDialCode] = useState("+971");
  const isArabic = language === "ar";
  return (
    <div>
      {trigger ? (
        <button
          onClick={() => {
            trackEvent("register_interest_click");
            setOpen(true);
          }}
          className="inline-flex max-sm:hidden  transition-all duration-300  gap-2 px-2 py-2 rounded-full items-center border "
          aria-label={isArabic ? "تواصل معنا" : "Get In Touch"}
          style={{
            borderColor: isWhite
              ? theme?.colors?.surface ?? "#ffffff40"
              : "#0A181A40",
          }}
        >
          <label
            className="font-sans hover:!text-[#40C2CC] ms-1 whitespace-nowrap cursor-pointer"
            style={{
              fontWeight: 500,
              fontSize: "1rem",
              lineHeight: "1.5rem",
              color: isWhite ? theme?.colors?.surface ?? "#fff" : "#0A181A",
            }}
          >
            {t("about.Get_in_touch")}
          </label>

          <span
            className="w-[2rem] h-[2rem] p-1 rounded-full flex items-center justify-center"
            style={{ background: theme.colors.primary }}
          >
            <GoArrowUpRight className="text-white text-2xl" />
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            setOpen(true);
            trackEvent("register_interest_click");
          }}
          className="font-general font-medium text-white text-center text-nowrap px-6 py-3 rounded-full bg-[#40C2CC] hover:bg-[#32B0B9] transition ease-in-out"
        >
          {t("Navbar.register")}
        </button>
      )}

      {open
        ? createPortal(
            <RegisterInterestModal
              open={open}
              onClose={() => setOpen(false)}
              project_name={project_name}
            />,
            document.body
          )
        : null}
    </div>
  );
}

function RegisterInterestModal({
  open,
  onClose,
  project_name,
}: {
  open: boolean;
  onClose: () => void;
  project_name?: string;
}) {
  const { t, language } = useLanguage();
  const { getRecaptchaToken } = useRecaptchaToken();
  const dialogRef = useRef(null);
  const firstFieldRef: any = useRef(null);
  const [phoneError, setPhoneError] = useState("");
  const formViewedRef = useRef(false);
  const formStartedRef = useRef(false);

  // Prevent page scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus first field on open; ESC to close
  useEffect(() => {
    if (open && firstFieldRef.current) firstFieldRef.current.focus();
    function onKey(e: any) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Track form view when modal opens
  useEffect(() => {
    if (open && !formViewedRef.current) {
      formViewedRef.current = true;
      trackEvent("lead_form_view", {
        project_name: project_name || "",
      });
    }
  }, [open, project_name]);

  // Track when user starts filling the form
  const handleFormStart = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("lead_form_start", {
        project_name: project_name || "",
      });
    }
  };

  // React Query mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.post("/Website/AddInterest", payload);
      return res.data;
    },
    onSuccess: () => {
      trackEvent("lead_form_success", {
        project_name: project_name || "",
      });
      toast.success(String(t("register.success")));
      onClose();
    },
    onError: () => {
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        error_type: "submission_failed",
      });
      toast.error(String(t("register.failure")));
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const fullName = String(data.get("fullName") || "").trim();
    const dialCode = String(data.get("dialCode") || "");
    const phoneNumber = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();

    // Reset error
    setPhoneError("");

    // Phone validation only
    if (!phoneNumber) {
      setPhoneError("Phone number is required");
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        error_type: "validation_failed",
      });
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      setPhoneError("Phone number must contain digits only");
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        error_type: "validation_failed",
      });
      return;
    }
    const selectedCountry = CountryCodes.find((c) => c.code === dialCode);
    if (selectedCountry) {
      if (phoneNumber.length !== selectedCountry.length) {
        setPhoneError(
          `Phone number must be ${selectedCountry.length} digits for ${dialCode}`
        );
        trackEvent("lead_form_error", {
          project_name: project_name || "",
          error_type: "validation_failed",
        });
        return;
      }

      if (
        selectedCountry.startsWith &&
        !phoneNumber.startsWith(selectedCountry.startsWith)
      ) {
        setPhoneError(`Invalid phone number for selected country`);
        trackEvent("lead_form_error", {
          project_name: project_name || "",
          error_type: "validation_failed",
        });
        return;
      }
    }

    // Track form submit
    trackEvent("lead_form_submit", {
      project_name: project_name || "",
    });

    // Execute reCAPTCHA
    const token = await getRecaptchaToken("website_register_interest");
    if (!token) {
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        error_type: "recaptcha_failed",
      });
      return;
    }

    const payload = {
      fullName,
      dialCode,
      phoneNumber,
      email,
      projectId: null,
      token,
    };
    mutate(payload);
  }
  return (
    <div
      className="flex fixed items-center justify-center bg-black/20 backdrop-blur-sm inset-0 z-[9999999999] p-12"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className=" flex flex-col md:w-2/3 lg:w-1/3 overflow-hidden rounded-2xl"
      >
        <div className="relative flex justify-end w-full bg-trasparent mb-[-1px]">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label={String(t("common.close"))}
            className="absolute top-1 right-2 h-8 w-8 pt-[0.1rem] place-items-center rounded-full hover:bg-black/5 focus:outline-none"
          >
            <span className="text-3xl text-[#0A181A8F]/50 leading-none">×</span>
          </button>

          <img src="/assets/brand_shape_lg.svg" className="bottom-0" alt="" />
        </div>

        <div className="flex flex-col rounded-l-2xl overflow-hidden bg-white gap-12 pt-16 px-8 pb-8">
          <h1 className="uppercase font-bodoni text-5xl text-center text-[#0A181A] leading-[1] w-full">
            {t("register.text2")}
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="font-general flex flex-col gap-8 flex-1 outline-2 outline-white outline-solid"
          >
            <input
              ref={firstFieldRef}
              id="fullName"
              name="fullName"
              type="text"
              placeholder={String(t("register.fullName"))}
              required
              onFocus={handleFormStart}
              className="w-full text-md outline-none border-b py-4 border-[#0A181A]/10 focus:border-[#40C2CC]"
            />

            {/* Phone */}
            <div className="grid grid-cols-[100px,1fr] gap-4">
              <select
                name="dialCode"
                defaultValue="+971"
                className="rtl:text-end w-full text-md outline-none border-b py-2 border-[#0A181A]/10 focus:border-[#40C2CC]"
                aria-label={String(t("register.countryCode"))}
              >
                {CountryCodes.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.code}
                  </option>
                ))}
              </select>
              <input
                id="phone"
                name="phone"
                type="tel"
                dir={language === "ar" ? "rtl" : "ltr"}
                inputMode="tel"
                placeholder={String(t("register.phoneNumber"))}
                required
                className={`w-full text-md outline-none border-b py-2 border-[#0A181A]/10 focus:border-[#40C2CC] ${
                  phoneError ? "border-red-500" : ""
                }`}
              />
            </div>

            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}

            {/* Email */}
            <input
              id="email"
              name="email"
              type="email"
              placeholder={String(t("register.emailOptional"))}
              className="w-full text-md outline-none border-b py-2 border-[#0A181A]/10 focus:border-[#40C2CC]"
            />

            <button
              disabled={isPending}
              className="mt-8 font-general font-medium text-white text-center text-nowrap px-6 py-3 rounded-full bg-[#40C2CC] hover:bg-[#32B0B9] disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out"
            >
              {isPending
                ? String(t("register.submitting"))
                : t("Navbar.register")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
