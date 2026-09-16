// Frontend-only payment navigation. Provider-neutral on purpose: the backend
// decides which provider generated paymentUrl (VNPay today, SePay once its
// contract is finalized) and this file must never construct, parse, or guess
// provider-specific details - it only redirects to whatever URL the backend
// returned.
//
// TODO: Integrate SePay-specific payment response when backend contract is finalized.

export function openPaymentUrl(paymentUrl: string) {
  if (!paymentUrl) return
  window.location.href = paymentUrl
}
