import { useContext } from 'react';
import { ThemeContext } from '../../contexts/theme/themeContext';
import { Container } from 'react-bootstrap';
// import styles from './homeStyles.module.scss';

function Home() {
    const { toggleTheme } = useContext(ThemeContext);

    return <Container onClick={toggleTheme}>Home</Container>;
}

export default Home;
