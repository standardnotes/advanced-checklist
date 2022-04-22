type ProgressBarProps = {
  value: number
  max: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ ...props }) => {
  return <progress style={{ marginTop: '10px', width: '100%' }} {...props} />
}
