export const createPayment = (req, res) => {
  const { amount, item_name } = req.body;

  const url = `https://sandbox.payfast.co.za/eng/process?merchant_id=10000100&merchant_key=46f0cd694581a&amount=${amount}&item_name=${item_name}`;
  return res.json({ url });
};
