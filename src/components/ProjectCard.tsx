import React from "react";
import { useNavigate } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { PiBed } from "react-icons/pi";
import { useLanguage } from "../i18n/LanguageProvider";
import { useLocalizedPath } from "../i18n/localePath";
import { trackEvent } from "../utils/analytics";

export interface ProjectCardProps {
  image: string;
  id: string;
  name: string;
  countOfRooms?: number[];
  congregationContent?: string[];
  location: string;
  type: string;
  handover: string;
}

const ProjectCard = ({ project }: { project: ProjectCardProps }) => {
  const { t } = useLanguage();
  const { to: localizedTo } = useLocalizedPath();
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer group"
      onClick={() => {
        navigate(localizedTo(`/project-details/${project.id}`));
        trackEvent("project_click", {
          project_name: project.name,
          project_id: project.id,
        });
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        {/* Image */}
        <img
          src={project.image}
          alt={project.name}
          width={800}
          height={600}
          className="aspect-[4/3] w-full object-cover"
          decoding="async"
        />
        {/* Hover Overlay */}
        <div
          className="
          flex justify-center items-center
          absolute bottom-0 left-0 w-full h-full 
          bg-[#40C2CC]
          group-hover:translate-y-0
          translate-y-full
          transition-transform duration-1000 ease-in-out z-10"
        >
          <span className="text-white font-bodoni uppercase text-[clamp(2rem,2vw,3rem)]">
            {t("projects.viewProject")}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-2 py-4">
        {/* Handover Date */}
        <div className="flex items-center gap-4 font-general text-sm text-[#0A181A]/50 uppercase">
          <span>{t("projects.card.handover")}</span>
          <span className="bg-[#0A181A]/15 h-[1px] flex-1"></span>
          <span>{project.handover}</span>
        </div>

        {/* Project Name */}
        <h3 className="font-bodoni uppercase text-[clamp(2rem,2vw,3rem)] text-[#0A181A]">
          {project.name}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-1 font-general tex-sm">
          {/* Location */}
          <div className="flex gap-2 items-start md:items-center">
            <CiLocationOn className="text-[#0A181A]/50 mt-1 md:mt-0" />
            <span className="text-[#0A181A]/55">{project.location}</span>
          </div>

          {/* Configration */}
          <div className="flex gap-2 items-start md:items-center">
            <PiBed className="fill-[#0A181A]/30 mt-1 md:mt-0" />
            <div className="flex gap-0 md:gap-1 text-[#0A181A]/55 flex-wrap">
              {Array.isArray(project.congregationContent) &&
              project.congregationContent.length > 0
                ? project.congregationContent.map(
                    (text: string, i: number, arr: string[]) => (
                      <div key={i}>
                        {text}
                        {i % 2 === 0 && i !== arr.length - 1 ? "," : ""}
                      </div>
                    )
                  )
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
