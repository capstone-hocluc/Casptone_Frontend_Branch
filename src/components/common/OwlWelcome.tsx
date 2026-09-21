import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface OwlWelcomeProps {
  className?: string
  ariaLabel?: string
}

function OwlWelcome({ className, ariaLabel }: OwlWelcomeProps) {
  return (
    <DotLottieReact
      src="/mascots/owl-welcome-wave-exact.lottie"
      autoplay
      loop
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  )
}

export { OwlWelcome }
export default OwlWelcome
