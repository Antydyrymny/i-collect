import TagCloud, { TagCloudOptions } from '@frank-mayer/react-tag-cloud';
import { Col, Container, Row } from 'react-bootstrap';
import { SearchBar } from '../../components';
import styles from './homeStyles.module.scss';

function Home() {
    return (
        <>
            <Row>
                <Col className='d-flex justify-content-center'>
                    <TagCloud
                        className={styles.tagCloud}
                        options={(w: Window & typeof globalThis): TagCloudOptions => ({
                            radius: Math.min(500, w.innerWidth, w.innerHeight) / 2.5,
                            maxSpeed: 'fast',
                        })}
                        onClick={(tag: string, ev: MouseEvent) => alert(tag)}
                        onClickOptions={{ passive: true }}
                    >
                        {[
                            'VSCode',
                            'TypeScript',
                            'React',
                            'Preact',
                            'Parcel',
                            'Jest',
                            'Next',
                            'ESLint',
                            'Framer Motion',
                            'Three.js',
                        ]}
                    </TagCloud>
                </Col>
            </Row>
            <Row className='d-flex justify-content-center'>
                <Col xl={5} lg={6} md={9} sm={12}>
                    <SearchBar
                        searchQuery=''
                        handleSearchChange={() => {}}
                        clearSearch={() => {}}
                        submitSearch={() => {}}
                        label='Search'
                        placeholder='Enter search'
                        hideFloatingLabel
                    />
                </Col>
            </Row>
        </>
    );
}

export default Home;
