type RoundButtonProps = {
  onClick: () => void
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  onClick,
  children,
}) => {
  return (
    <button className="sn-icon-button border-contrast" onClick={onClick}>
      {children}
    </button>
  )
}
