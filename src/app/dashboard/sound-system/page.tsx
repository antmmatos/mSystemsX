import Header from '@/components/header/header';
import styles from './sound-system.module.css';
import Footer from '@/components/footer/footer';
import SoundSystemContainer from '@/components/containers/sound/sound-system_container';

const SoundSystem = async () => {
    return (
        <div className={styles.page}>
            <Header />
            <SoundSystemContainer />
            <Footer />
        </div>
    );
}

export default SoundSystem;