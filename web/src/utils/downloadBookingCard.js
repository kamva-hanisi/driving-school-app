import html2canvas from "html2canvas";

export const downloadBookingCard = async ({
  element,
  filename = "booking-reference.png",
}) => {
  if (!element) {
    return;
  }

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
};
