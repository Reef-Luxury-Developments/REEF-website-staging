import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "react-toastify";

export const useRecaptchaToken = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = async (
    action: string = "website_register_interest"
  ): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.error("reCAPTCHA is not available. Please check your configuration.");
      toast.error("reCAPTCHA verification is not available. Please refresh the page and try again.");
      return null;
    }

    try {
      const token = await executeRecaptcha(action);
      if (!token) {
        toast.error("reCAPTCHA verification failed. Please try again.");
        return null;
      }
      return token;
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      toast.error("reCAPTCHA verification failed. Please try again.");
      return null;
    }
  };

  return { getRecaptchaToken };
};
