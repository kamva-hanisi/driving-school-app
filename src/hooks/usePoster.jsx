import { useRef } from "react";
import html2canvas from "html2canvas";

export default function usePoster() {
  const ref = useRef();

  const download = async () => {
    if (!ref.current) {
      return;
    }

    const canvas = await html2canvas(ref.current, {
      scale: 3,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return { ref, download };
}
