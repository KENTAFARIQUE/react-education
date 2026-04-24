import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Button from '../../components/button/Button';
import Header from '../../components/header/Header';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import GeoBlock from '../steps/GeoBlock';

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
                <div className={styles.OrderStep}><GeoBlock /></div>
                <div className={styles.OrderSummary}>
					<div className={styles.orderTextContainer}>
						<h5>Ваш заказ:</h5>
						<span>Пункт выдачи</span>
						<div className={styles.price}><h5>Цена:</h5><h4>от 8 000 до 12 000 ₽</h4></div>
						<Button disabled={true}><span>Выбрать модель</span></Button>
					</div>
				</div>
            </div>
        </div>
    </div>
    );
}

export default OrderView;