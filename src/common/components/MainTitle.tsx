import styled from 'styled-components'

const Header1 = styled.h1`
  color: var(--sn-stylekit-paragraph-text-color);
  display: inline;
  font-size: 1.125rem;
  margin-right: 10px !important;
`

const MainTitle: React.FC = ({ children }) => {
  return <Header1 className="sk-h1">{children}</Header1>
}

export default MainTitle
