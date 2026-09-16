import { useState } from "react";
import Button from "../components/common/Button";
import usePoster from "../hooks/usePoster";
import PosterForm from "../components/poster/PosterForm";
import PosterPreview from "../components/poster/PosterPreview";

export default function Posters() {
  const [form, setForm] = useState({
    eyebrow: "DriveEasy",
    headline: "Driving lessons available",
    subtitle:
      "Book Code 8, Code 10, and Code 14 lessons with a simple scheduling process.",
    cta: "Book your lesson today",
  });
  const { ref, download } = usePoster();

  return (
    <section className="poster-page">
      <div className="poster-page__grid">
        <div className="poster-panel">
          <PosterForm form={form} setForm={setForm} />
          <Button fullWidth onClick={download}>
            Download poster
          </Button>
        </div>

        <div className="poster-stage">
          <PosterPreview form={form} posterRef={ref} />
        </div>
      </div>
    </section>
  );
}
