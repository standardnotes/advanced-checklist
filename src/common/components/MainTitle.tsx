import styled from 'styled-components'

const Header1 = styled.h1`
  color: var(--sn-stylekit-paragraph-text-color);
  display: inline;
  font-size: 1.125rem !important;
  margin-right: 10px !important;
`

type MainTitleProps = {
  highlight?: boolean
}

export const MainTitle: React.FC<MainTitleProps> = ({
  children,
  highlight = false,
}) => {
  return (
    <Header1 className={`sk-h1 ${highlight ? 'info' : ''}`}>{children}</Header1>
  )
}
