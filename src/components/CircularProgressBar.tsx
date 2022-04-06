import React, { useEffect, useState } from 'react'

type CircularProgressBarProps = {
  size: number
  percentage: number
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  percentage,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(percentage)
  }, [percentage])

  const viewBox = `0 0 ${size} ${size}`
  const strokeWidth = size * (0.1 / 100) * 100 + 1
  const radius = (size - strokeWidth) / 2
  const circumference = radius * Math.PI * 2
  const dash = (progress * circumference) / 100

  return (
    <svg
      className="circular-progress-bar"
      height={size}
      viewBox={viewBox}
      width={size}
      data-testid="circular-progress-bar"
    >
      <circle
        fill="none"
        className="background"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        fill="none"
        className="stroke"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        style={{ transition: 'all 0.5s' }}
      />
    </svg>
  )
}

export default CircularProgressBar
