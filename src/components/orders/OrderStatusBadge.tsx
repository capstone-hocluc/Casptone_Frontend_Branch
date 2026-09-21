import { getOrderStatusLabel, getOrderStatusTone } from '../../lib/orderStatus'
import Status from '../ui/Status'

interface OrderStatusBadgeProps {
  status: string
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Status tone={getOrderStatusTone(status)}>{getOrderStatusLabel(status)}</Status>
}

export default OrderStatusBadge
