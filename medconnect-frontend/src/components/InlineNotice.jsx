const InlineNotice = ({ type = 'success', message, actions = [] }) => {
  if (!message) return null

  const isError = type === 'error'
  const toneClasses = isError
    ? 'bg-red-50 border-red-100 text-red-600'
    : 'bg-green-50 border-green-100 text-green-700'

  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm flex items-center justify-between gap-3 ${toneClasses}`}>
      <span>{message}</span>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="text-xs px-3 py-1.5 rounded-md bg-white/80 border border-current"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default InlineNotice
