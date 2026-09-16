import { getOrderStatusLabel, getOrderStatusTone } from '../../lib/orderStatus'

interface OrderStatusBadgeProps {
  status: string
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`hl-order-status is-${getOrderStatusTone(status)}`}>
      {getOrderStatusLabel(status)}
    </span>
  )
}

export default OrderStatusBadge
