import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";

/**
 * Channel Partner landing + short application form
 * - React + TailwindCSS, single-file component
 * - Responsive, centered layout
 * - Mobile-friendly, subtle shadows and rounded corners
 * - Language toggle (EN/AR) that flips page direction (LTR/RTL)
 */

const copy: any = {
    en: {
        brand: "REEF",
        langSwitch: "العربية",
        hero: "An Exclusive Opportunity to Partner With Us",
        subtitle:
            "Join our distinguished network of channel partners and unlock a world of professional growth, incentives, and support.",
        partnerPrompt: "Select how you would like to partner",
        individualTitle: "Individual",
        individualDesc:
            "For independent professionals, brokers, and licensed agents.",
        companyTitle: "Company",
        companyDesc: "For registered businesses and corporate entities.",
        applicantInfo: "Applicant Info",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone Number",
        cancel: "Cancel",
        continue: "Continue",
    },
    ar: {
        brand: "REEF",
        langSwitch: "English",
        hero: "فرصة حصرية للشراكة معنا",
        subtitle:
            "انضم إلى شبكة شركائنا المميزين واكتشف عالمًا من النمو المهني والحوافز والدعم.",
        partnerPrompt: "اختر طريقة الشراكة المناسبة لك",
        individualTitle: "فرد",
        individualDesc: "للمحترفين المستقلين والوسطاء والوكلاء المرخصين.",
        companyTitle: "شركة",
        companyDesc: "للشركات المسجلة والكيانات المؤسسية.",
        applicantInfo: "بيانات المتقدم",
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        cancel: "إلغاء",
        continue: "متابعة",
    },
};

const phoneCodes = [
    { code: "+971", label: "UAE" },
    { code: "+966", label: "KSA" },
    { code: "+20", label: "EG" },
    { code: "+1", label: "US" },
];

function OptionCard({ title, desc, selected, onClick, icon }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                "group w-full rounded-[12px] border bg-white py-6 ps-6 text-start transition border-[#0A181A33]/20 hover:border-gray-300 hover:shadow-sm "}
            aria-pressed={selected}
        >
            <div className="flex items-start gap-6">
                <img src={icon} className="w-10 h-10" />
                <div>
                    <div className=" text-black text-xl mb-2 font-sans leading-normal font-medium">{title}</div>
                    <p className=" text-[#0A181A8F]/55 text-base font-sans ">{desc}</p>
                </div>
            </div>
        </button>
    );
}

function Field({ id, label, children }: any) {
    return (
        <label htmlFor={id} className="block">
            <span className="mb-2 font-sans block text-sm font-medium text-[#0A181A]/80 leading-tight">
                {label}
            </span>
            {children}
        </label>
    );
}

export default function ChannelPartnerLanding() {
    const [lang, setLang] = useState("en");
    const t = useMemo(() => copy[lang], [lang]);
    const [partnerType, setPartnerType] = useState("individual");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneCode: phoneCodes[0].code,
        phone: "",
    });

    const update = (k: any, v: any) => setForm((s) => ({ ...s, [k]: v }));

    return (
        <div
            className="min-h-screen "
            style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
        >
            <Navbar />

            {/* Main */}
            <main className="mx-auto max-w-4xl  font-sans w-full  px-6 pb-1 pt-10">
                <h1 className="mx-auto font-bodoni mb-8 text-center text-5xl font-medium leading-[48px] uppercase  text-[#0A181A] ">
                    {t.hero}
                </h1>
                <p className="mx-auto font-sans  text-center text-base font-normal  text-[#0A181A]/60 ">
                    {t.subtitle}
                </p>

                {/* Card */}
                <section className="mt-8  bg-white ">
                    <h3 className="mx-auto  text-base font-medium  leading-tight  text-[#0A181A] ">
                        {t.partnerPrompt}
                    </h3>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <OptionCard
                            icon={"/assets/Iconuser.png"}
                            title={t.individualTitle}
                            desc={t.individualDesc}
                            selected={partnerType === "individual"}
                            onClick={() => setPartnerType("individual")}
                        />
                        <OptionCard
                            icon={"/assets/Icon23.png"}
                            title={t.companyTitle}
                            desc={t.companyDesc}
                            selected={partnerType === "company"}
                            onClick={() => setPartnerType("company")}
                        />
                    </div>

                    <div className="mt-10">
                        <h4 className="mx-auto  text-base font-medium  leading-tight  text-[#0A181A] ">{t.applicantInfo}</h4>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field id="firstName" label={t.firstName}>
                                <input
                                    id="firstName"
                                    className="w-full rounded-lg border border-[#0A181A33]/20 bg-white p-3 text-sm text-[#0A181A] placeholder-[#0A181A61]/40 outline-none transition "
                                    placeholder={t.firstName}
                                    value={form.firstName}
                                    onChange={(e) => update("firstName", e.target.value)}
                                />
                            </Field>
                            <Field id="lastName" label={t.lastName}>
                                <input
                                    id="lastName"
                                    className="w-full rounded-lg border border-[#0A181A33]/20 bg-white p-3 text-sm text-[#0A181A] placeholder-[#0A181A61]/40 outline-none transition "
                                    placeholder={t.lastName}
                                    value={form.lastName}
                                    onChange={(e) => update("lastName", e.target.value)}
                                />
                            </Field>
                            <Field id="email" label={t.email}>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full rounded-lg border border-[#0A181A33]/20 bg-white p-3 text-sm text-[#0A181A] placeholder-[#0A181A61]/40 outline-none transition "
                                    placeholder="name@example.com"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                />
                            </Field>

                            {/* Phone */}
                            <Field id="phone" label={t.phone}>
                                <div className="flex gap-2 rounded-lg border  p-3  border-[#0A181A33]/20">
                                    <select
                                        className="w-fit bg-white  text-sm text-[#0A181A61]/80 placeholder-[#0A181A61]/40 outline-none transition"
                                        value={form.phoneCode}
                                        onChange={(e) => update("phoneCode", e.target.value)}
                                    >
                                        {phoneCodes.map((p) => (
                                            <option key={p.code} value={p.code}>
                                                {p.code} 
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        id="phone"
                                        inputMode="tel"
                                    className="w-full  border-none bg-white text-sm text-[#0A181A] placeholder-[#0A181A61]/40 outline-none transition "
                                        placeholder="52 632 63 69"
                                        value={form.phone}
                                        onChange={(e) => update("phone", e.target.value)}
                                    />
                                </div>
                            </Field>
                        </div>
                    </div>
                </section>

                {/* Footer actions */}
                <div className="mt-44 flex  items-end h-full justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-[100px] bg-white  px-6 py-3 text-base font-medium text-black  transiti focus:outline-none focus:ring-4 focus:ring-teal-400/40"
                    >
                        {t.cancel}
                    </button>
                    <button
                        type="button"
                        className="rounded-[100px] bg-[#40C2CC]  px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-400/40"
                    >
                        {t.continue}
                    </button>
                </div>
            </main>
        </div>
    );
}

// Simple inline icons (no external deps)
function UserIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-5 w-5 text-gray-700"
        >
            <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 1116 0"
            />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-5 w-5 text-gray-700"
        >
            <path
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 21h18M6 21V7a2 2 0 012-2h8a2 2 0 012 2v14M9 10h.01M9 13h.01M9 16h.01M12 10h.01M12 13h.01M12 16h.01M15 10h.01M15 13h.01M15 16h.01"
            />
        </svg>
    );
}
