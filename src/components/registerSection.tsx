import { useEffect, useRef, useState } from "react";
import "../style/register.css";
import { IoChevronDownOutline } from "react-icons/io5";
import { useLanguage } from "../i18n/LanguageProvider";
import { useMutation } from "@tanstack/react-query";
import axios from "../axios";
import { toast } from "react-toastify";
import { CountryCodes } from "./country";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";
import { trackEvent } from "../utils/analytics";

// Types expected by the API
interface AddInterestBody {
  fullName: string;
  dialCode: string;
  phoneNumber: string;
  email: string;
  projectId: string | null; // currently null per spec
  token?: string;
}

async function postAddInterest(body: AddInterestBody) {
  const res = await axios.post("/Website/AddInterest", body);
  return res.data;
}

const RegisterSection = ({
  project_name,
  source,
}: {
  project_name?: string;
  source?: string;
}) => {
  const { t, language } = useLanguage();
  const { getRecaptchaToken } = useRecaptchaToken();
  const [phoneError, setPhoneError] = useState("");
  const tStr = (key: string) => {
    const val = t(key) as unknown;
    return Array.isArray(val) ? val.join(" ") : ((val ?? "") as string);
  };

  // UI state
  const [selectedCode, setSelectedCode] = useState("+971");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [projectId] = useState<string | null>(null);

  // Tracking refs
  const formViewedRef = useRef(false);
  const formStartedRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const errorTrackedRef = useRef(false);

  const { mutate, isPending, isSuccess, isError, error, reset } = useMutation({
    mutationFn: (payload: AddInterestBody) => postAddInterest(payload),
    onError: (error: any) => {
      if (!errorTrackedRef.current) {
        errorTrackedRef.current = true;
        const errorType =
          error?.response?.status === 500
            ? "server_error_500"
            : error?.response?.status
              ? `http_error_${error.response.status}`
              : "submission_failed";

        trackEvent("lead_form_error", {
          project_name: project_name || "",
          form_source: source || "",
          error_type: errorType,
        });
      }
    },
  });

  const handleSelectCode = (code: string) => {
    setSelectedCode(code);
    setOpenDropdown(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    if (openDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDropdown]);

  // const validate = () => {
  //   if (!fullName.trim()) return t("errors.requiredName") || "Full name is required";
  //   if (!phoneNumber.trim()) return t("errors.requiredPhone") || "Phone number is required";
  //   // Optional basic email check if provided
  //   if (email && !/^\S+@\S+\.\S+$/.test(email)) return t("errors.invalidEmail") || "Enter a valid email";
  //   return null;
  // };

  // const validate = () => {
  //   if (!fullName.trim()) {
  //     toast.error("Full name is required");
  //     return false;
  //   }

  //   if (!phoneNumber.trim()) {
  //     toast.error("Phone number is required");
  //     return false;
  //   }

  //   if (!/^\d+$/.test(phoneNumber.trim())) {
  //     toast.error("Phone number must contain digits only");
  //     return false;
  //   }

  //   const selectedCountry = CountryCodes.find(c => c.code === selectedCode);
  //   if (selectedCountry && phoneNumber.trim().length !== selectedCountry.length) {
  //     toast.error(
  //      `Phone number must be ${selectedCountry.length} digits for ${selectedCode}`
  //     );
  //     return false;
  //   }

  //   if (email && !/^\S+@\S+\.\S+$/.test(email)) {
  //     toast.error("Enter a valid email");
  //     return false;
  //   }

  //   return true;
  // };

  // const validate = () => {
  //   setPhoneError("");
  //   if (!fullName.trim()) {
  //     toast.error("Full name is required");
  //     return false;
  //   }

  //   if (!phoneNumber.trim()) {
  //     setPhoneError("Phone number is required");
  //     return false;
  //   }

  //   if (!/^\d+$/.test(phoneNumber.trim())) {
  //     setPhoneError("Phone number must contain digits only");
  //     return false;
  //   }

  //   const selectedCountry = CountryCodes.find(c => c.code === selectedCode);
  //   if (selectedCountry && phoneNumber.trim().length !== selectedCountry.length) {
  //     setPhoneError(
  //       `Phone number must be ${selectedCountry.length} digits for ${selectedCode}`
  //     );
  //     return false;
  //   }

  //   if (email && !/^\S+@\S+\.\S+$/.test(email)) {
  //     toast.error("Enter a valid email");
  //     return false;
  //   }

  //   return true;
  // };
  const validate = () => {
    setPhoneError("");
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      return false;
    }

    if (!/^\d+$/.test(phoneNumber.trim())) {
      setPhoneError("Phone number must contain digits only");
      return false;
    }

    const selectedCountry = CountryCodes.find((c) => c.code === selectedCode);
    if (selectedCountry) {
      if (phoneNumber.trim().length !== selectedCountry.length) {
        setPhoneError(
          `Phone number must be ${selectedCountry.length} digits for ${selectedCode}`,
        );
        return false;
      }
      if (
        selectedCountry.startsWith &&
        !phoneNumber.trim().startsWith(selectedCountry.startsWith)
      ) {
        setPhoneError(`Invalid phone number for selected country`);
        return false;
      }
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }

    return true;
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // Reset error tracking for new submission attempt
    errorTrackedRef.current = false;

    // const message = validate();
    // if (message) {
    //   alert(message);
    //   return;
    // }
    const isValid = validate();
    if (!isValid) {
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        form_source: source || "",
        error_type: "validation_failed",
      });
      return;
    }

    // Track form submit
    trackEvent("lead_form_submit", {
      project_name: project_name || "",
      form_source: source || "",
    });

    // Execute reCAPTCHA
    const token = await getRecaptchaToken("website_register_interest");
    if (!token) {
      trackEvent("lead_form_error", {
        project_name: project_name || "",
        form_source: source || "",
        error_type: "recaptcha_failed",
      });
      return;
    }

    const payload: AddInterestBody = {
      fullName: fullName.trim(),
      dialCode: selectedCode,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      projectId,
      token,
    };
    mutate(payload, {
      onSuccess(data, variables, context) {
        toast.success("register.success");
        // lead_form_success is tracked in useEffect above
      },
    });
  };

  // Track form view when form section comes into viewport
  useEffect(() => {
    if (!formViewedRef.current && formRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !formViewedRef.current) {
            formViewedRef.current = true;
            trackEvent("lead_form_view", {
              project_name: project_name || "",
              form_source: source || "",
            });
          }
        },
        { threshold: 0.3 },
      );
      observer.observe(formRef.current);
      return () => observer.disconnect();
    }
  }, []);

  // Track when user starts filling the form (first field focus)
  const handleFormStart = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("lead_form_start", {
        project_name: project_name || "",
        form_source: source || "",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      trackEvent("lead_form_success", {
        project_name: project_name || "",
        form_source: source || "",
      });
      reset();
    }
  }, [isSuccess, project_name]);

  // Reset error tracking ref when form is reset or new submission starts
  useEffect(() => {
    if (isSuccess) {
      errorTrackedRef.current = false;
    }
  }, [isSuccess]);

  return (
    <section className="flex flex-col gap-12 items-center w-full px-4 mx-auto my-24 md:px-0 md:my-32 md:flex-row md:justify-between md:w-5/6">
      {/* Left Section */}
      <div className="flex flex-col justify-cneter gap-4 md:gap-8 md:justify-start w-full md:pe-16">
        {/* Overtitle */}
        <div className="flex items-center gap-4">
          <div className="w-[7rem] h-[1px] max-sm:hidden rtl:hidden bg-[rgba(10,24,26,0.2)]" />
          <p className="font-general text-md md:text-lg italic text-center md:text-start text-black/55 w-full">
            {t("register.text1")}
          </p>
        </div>
        {/* Headline */}
        <h2 className="uppercase font-bodoni text-[clamp(3rem,5vw,5rem)] text-[rgb(10,24,26,1)] leading-[1] text-center md:text-start w-full">
          {t("register.text2")}
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex justify-center md:justify-end w-full md:w-3/4">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex flex-col gap-[1rem] w-full"
        >
          {/* Full Name */}
          <div className="w-full border-b border-[rgba(10,24,26,0.2)] focus-within:border-[rgba(10,24,26,0.5)] transition">
            <input
              type="text"
              placeholder={t("register.fullName") as string}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={handleFormStart}
              className="w-full h-12 text-[1rem] font-general font-normal leading-[1.25rem] placeholder-[rgba(10,24,26,0.38)] text-[rgba(10,24,26,0.9)] bg-transparent focus:outline-none"
              aria-label="Full Name"
              required
            />
          </div>

          <div
            className="w-full flex gap-4 sm:flex-row relative"
            ref={dropdownRef}
          >
            {/* Prefix */}
            <div
              className="sm:w-[6rem] border-b border-[rgba(10,24,26,0.2)] flex items-center justify-between pe-2 focus-within:border-[rgba(10,24,26,0.5)] transition cursor-pointer relative"
              onClick={() => setOpenDropdown((o) => !o)}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={openDropdown}
            >
              <span className="text-[1rem] font-general font-medium text-[rgba(10,24,26)] ps-1">
                {selectedCode}
              </span>
              <IoChevronDownOutline className="text-[rgba(10,24,26,0.2)] w-4 h-4" />

              {/* Dropdown */}
              {openDropdown && (
                <div
                  className="absolute w-max top-full left-0 font-sans z-20 bg-white shadow-md border border-gray-200 mt-2 rounded-md max-h-48 overflow-y-auto"
                  role="listbox"
                >
                  {CountryCodes.map((country) => (
                    <div
                      key={country.code}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
                      onClick={() => handleSelectCode(country.code)}
                      role="option"
                      aria-selected={selectedCode === country.code}
                    >
                      {country.name} ({country.code})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div className="flex-1 border-b border-[rgba(10,24,26,0.2)] focus-within:border-[rgba(10,24,26,0.5)] transition">
              <input
                type="tel"
                dir={language === "ar" ? "rtl" : "ltr"}
                placeholder={t("register.phoneNumber") as string}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-12 text-[1rem] font-general font-normal leading-[1.25rem] placeholder-[rgba(10,24,26,0.38)] text-[rgba(10,24,26,0.9)] bg-transparent focus:outline-none"
                aria-label="Phone Number"
                required
              />
            </div>
          </div>
          {phoneError && (
            <p className="text-red-500 text-sm mt-1 font-general ">
              {phoneError}
            </p>
          )}
          {/* Email */}
          <div className="w-full border-b border-[rgba(10,24,26,0.2)] focus-within:border-[rgba(10,24,26,0.5)] transition">
            <input
              type="email"
              placeholder={t("register.emailOptional") as string}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 text-[1rem] font-general font-normal leading-[1.25rem] placeholder-[rgba(10,24,26,0.38)] text-[rgba(10,24,26,0.9)] bg-transparent focus:outline-none"
              aria-label="Email"
            />
          </div>

          {/* Submit Button & Policy */}
          <div className="flex flex-col gap-4 mt-2">
            <button
              type="submit"
              disabled={isPending}
              className={`w-full h-10 rounded-full text-white font-general font-medium text-[1rem] leading-[1.5rem] transition ${
                isPending
                  ? "bg-[#40C2CC]/60 cursor-not-allowed"
                  : "bg-[#40C2CC] hover:bg-[#00b8bd]"
              }`}
            >
              {isPending
                ? t("register.submitting") || "Submitting..."
                : t("register.submit")}
            </button>
            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
                {t("register.error")}
                <div className="opacity-70 mt-1">
                  {(error as Error)?.message}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterSection;

// countryCodes.ts
