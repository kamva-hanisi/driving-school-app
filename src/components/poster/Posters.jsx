import { useRef, useState } from "react";
import html2canvas from "html2canvas";

import PosterForm from "./PosterForm";
import PosterPreview from "./PosterPreview";
import TemplateSelector from "./TemplateSelector";

export default function Posters() {
  const [form, setForm] = useState({
    eyebrow: "DriveEasy campaign",
    headline: "Driving lessons made simple",
    subtitle: "Book Code 8, Code 10, and Code 14 lessons with a clean digital experience built for speed and trust.",
    cta: "Book your lesson today",
  });
  const [template, setTemplate] = useState("emerald");

  const posterRef = useRef();

  const downloadPoster = async () => {
    if (!posterRef.current) {
      return;
    }

    const canvas = await html2canvas(posterRef.current, {
      scale: 3,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <section className="poster-page">
      <div className="poster-page__grid">
        <div className="poster-panel">
          <TemplateSelector setTemplate={setTemplate} template={template} />
          <PosterForm form={form} setForm={setForm} />
          <button
            className="button button--primary poster-download"
            onClick={downloadPoster}
            type="button"
          >
            Download poster
          </button>
        </div>

        <div className="poster-stage">
          <PosterPreview form={form} posterRef={posterRef} template={template} />
        </div>
      </div>
    </section>
  );
}
