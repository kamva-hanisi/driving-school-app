export const createPayment = (req, res) => {
  const { amount, item_name } = req.body;
  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;

  if (!merchantId || !merchantKey) {
    return res.json({
      configured: false,
      message: "Booking captured successfully. Payment gateway is not configured yet.",
    });
  }

  const url = `https://www.payfast.co.za/eng/process?merchant_id=${merchantId}&merchant_key=${merchantKey}&amount=${amount}&item_name=${encodeURIComponent(item_name)}`;
  return res.json({ configured: true, url });
};
