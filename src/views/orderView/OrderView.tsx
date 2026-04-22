import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';


import Header from '../../components/header/Header';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import styles from  './orderView.module.css'

const OrderView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
	const currentStep = (searchParams.get('step') as Step) || 'location';

	const setStep = (step: Step) => {
		setSearchParams({ step });
	};

	const renderStep = () => {
		switch (currentStep) {
			case 'location':
				return <LocationStep onNext={() => setStep('model')} />;
			case 'model':
				return null;
			case 'additional':
				return null;
			case 'total':
				return null;
			default:
				return null;
		}
	};

    return (
    <div className={styles.main}>
        <div className={styles.Container}>
            <Header></Header>
            <hr />
            <div className={styles.breadcrumbs}>
                <Breadcrumbs currentStep={currentStep} />
            </div>
            <hr />
            <div className={styles.MainContainer}>
                <div className={styles.OrderStep}></div>
                <div className={styles.OrderSummary}></div>
            </div>
        </div>
    </div>
    );
}

export default OrderView;