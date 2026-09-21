interface StudentToastProps {
  message: string
}

// Bottom-right notice for a useTransientMessage() value; renders nothing when empty.
function StudentToast({ message }: StudentToastProps) {
  if (!message) return null
  return (
    <div
      role="status"
      className="fixed right-6 bottom-6 z-80 max-w-[min(360px,calc(100vw-32px))] rounded-[14px] border border-line-brand bg-surface px-3.5 py-3 text-[13px] leading-[1.45] font-extrabold text-text-emphasis shadow-[0_18px_40px_rgba(17,24,58,0.16)]"
    >
      {message}
    </div>
  )
}

export default StudentToast
