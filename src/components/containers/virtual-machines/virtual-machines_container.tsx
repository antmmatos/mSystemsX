"use client";
import { useEffect, useState } from 'react';
import styles from './virtual-machines_container.module.css';
import axios from 'axios';

const VirtualMachinesContainer = () => {
    const [vmList, setVmList] = useState([]);

    const loadVMs = async () => {
        const response = await axios.get('/api/proxmox/virtual-machines');
        const data = response.data;
        setVmList(data.list);
    }

    useEffect(() => {
        loadVMs();
    }, []);

    const statusLabel = (status: string) => {
        switch (status) {
            case 'running':
                return "Running";
            case 'stopped':
                return "Not Running";
            case 'error':
                return "Error";
            default:
                return "Unknown";
        }
    }

    return (
        <div className={styles.vm__container}>
            <div className={styles.vm__title__container}>
                <h1 className={styles.vm__title}>Virtual <span className="red"> Machines</span></h1>
                <hr className={styles.vm__titleline} />
            </div>
            <div className={styles.vm__list}>
                <div className={styles.vm__scrollable}>
                    {vmList.map((vm: any, index: number) => {
                        return (
                            <div key={index} className={styles.vm__item}>
                                <div className={styles.vm__item__header}>
                                    <div className={styles.vm__item__name}>[{vm.vmid}] {vm.name}</div>
                                    <span className={styles.vm__item__status}>
                                        <span className={styles.vm__item__status__label}>{statusLabel(vm.status)}</span>
                                        <span className={`${styles.vm__item__status__indicator} ${styles[`status-${vm.status}`]}`}></span>
                                    </span>
                                </div>
                                <div className={styles.vm__item__cpu__usage}></div>
                                <div className={styles.vm__item__ram__usage}></div>
                                <div className={styles.vm__item__disk__usage}></div>
                                <div className={styles.vm__item__network__usage}></div>
                                <div className={styles.vm__item__actions}>
                                    <button className={styles.vm__item__action}>Start</button>
                                    <button className={styles.vm__item__action}>Stop</button>
                                    <button className={styles.vm__item__action}>Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default VirtualMachinesContainer;