import { formatCoursePrice } from '../../lib/courseFormat'

interface CartSummaryProps {
  itemCount: number
  totalAmount: number
  onCheckout: () => void
}

function CartSummary({ itemCount, totalAmount, onCheckout }: CartSummaryProps) {
  return (
    <div className="hl-cart-summary">
      <h2>Tóm tắt đơn hàng</h2>

      <div className="hl-cart-summary-row">
        <span>Số khóa học</span>
        <strong>{itemCount}</strong>
      </div>
      <div className="hl-cart-summary-row is-total">
        <span>Tổng cộng</span>
        <strong>{formatCoursePrice(totalAmount)}</strong>
      </div>

      <button type="button" className="hl-cart-checkout-cta" onClick={onCheckout}>
        Tiến hành thanh toán
      </button>
    </div>
  )
}

export default CartSummary
