import Header from '@/components/header/header';
import styles from './virtual-machines.module.css';
import Footer from '@/components/footer/footer';
import VirtualMachinesContainer from '@/components/containers/virtual-machines/virtual-machines_container';

const SoundSystem = async () => {
    return (
        <div className={styles.page}>
            <Header />
            <VirtualMachinesContainer />
            <Footer />
        </div>
    );
}

export default SoundSystem;