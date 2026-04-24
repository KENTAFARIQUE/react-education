import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';


import Button from '../../components/ui/button/Button';
import Header from '../../components/header/Header';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';

import GeoBlock from '../steps/GeoBlock';
import ModelBlock from '../steps/ModelBlock';
import ExtraBlock from '../steps/ExtraBlock';
import SummaryBlock from '../steps/SummaryBlock';

import styles from  './orderView.module.css'

type Step = 'location' | 'model' | 'additional' | 'total';

const OrderView = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentStep = (searchParams.get('step') as Step) || 'location';

	const setStep = (step: Step) => {
		setSearchParams({ step });
	};

	const renderStep = () => {
		switch (currentStep) {
			case 'location':
				return <GeoBlock />;
			case 'model':
				return <ModelBlock />;
			case 'additional':
				return <ExtraBlock />;
			case 'total':
				return <SummaryBlock />;
			default:
				return <GeoBlock />;
		}
	};

	const handleNextStep = () => {
		switch (currentStep) {
			case 'location':
				setStep('model');
				break;
			case 'model':
				setStep('additional');
				break;
			case 'additional':
				setStep('total');
				break;
			default:
				break;
		}
	};

	const getButtonText = () => {
		switch (currentStep) {
			case 'location':
				return 'Выбрать модель';
			case 'model':
				return 'Дополнительно';
			case 'additional':
				return 'Итого';
			case 'total':
				return 'Забронировать';
			default:
				return 'Далее';
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
                <div className={styles.orderStep}>
						{renderStep()}
					</div>
                <div className={styles.OrderSummary}>
					<div className={styles.orderTextContainer}>
						<h5>Ваш заказ:</h5>
						<span>Пункт выдачи</span>
						<div className={styles.price}><h5>Цена:</h5><h4>от 8 000 до 12 000 ₽</h4></div>
						<Button onClick={handleNextStep}>
								<span>{getButtonText()}</span>
							</Button>
					</div>
				</div>
            </div>
        </div>
    </div>
    );
}

export default OrderView;