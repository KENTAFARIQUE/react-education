import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStore, type OrderStep } from '../../store/orderStore';
import Button from '../../components/ui/button/Button';
import Header from '../../components/header/Header';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';

import GeoBlock from '../steps/GeoBlock';
import ModelBlock from '../steps/ModelBlock';
import ExtraBlock from '../steps/ExtraBlock';
import SummaryBlock from '../steps/SummaryBlock';

import styles from  './orderView.module.css'

const OrderView = () => {
	const { step: urlStep } = useParams<{ step: string }>();
	const navigate = useNavigate();
	const initializedRef = useRef(false);
	const currentStep = useOrderStore((state) => state.currentStep);
	const setStep = useOrderStore((state) => state.setStep);
	const isStepCompleted = useOrderStore((state) => state.isStepCompleted);
	const canNavigateToStep = useOrderStore((state) => state.canNavigateToStep);
	const pickupPoint = useOrderStore((state) => state.pickupPoint);
	const selectedModel = useOrderStore((state) => state.selectedModel);

	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true;
			if (urlStep && ['location', 'model', 'additional', 'total'].includes(urlStep)) {
				const step = urlStep as OrderStep;
				if (canNavigateToStep(step)) {
					setStep(step);
				} else {
					navigate('/order/location', { replace: true });
				}
			} else {
				navigate('/order/location', { replace: true });
			}
		} else if (urlStep && ['location', 'model', 'additional', 'total'].includes(urlStep)) {
			const step = urlStep as OrderStep;
			if (canNavigateToStep(step)) {
				setStep(step);
			} else {
				navigate(`/order/${currentStep}`, { replace: true });
			}
		}
	}, [urlStep, canNavigateToStep, setStep, navigate, currentStep]); 

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
		if (!isStepCompleted(currentStep)) {
			return;
		}

		switch (currentStep) {
			case 'location':
				navigate('/order/model');
				break;
			case 'model':
				navigate('/order/additional');
				break;
			case 'additional':
				navigate('/order/total');
				break;
			default:
				break;
		}
	};

	const handleBreadcrumbClick = (step: OrderStep) => {
		if (canNavigateToStep(step)) {
			navigate(`/order/${step}`);
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

	const isButtonDisabled = () => {
		return !isStepCompleted(currentStep);
	};

    return (
    <div className={styles.main}>
        <div className={styles.Container}>
            <Header></Header>
            <hr />
            <div className={styles.breadcrumbs}>
                <Breadcrumbs currentStep={currentStep} onStepClick={handleBreadcrumbClick} />
            </div>
            <hr />
                <div className={styles.MainContainer}>
                <div className={styles.orderStep} key={currentStep}>
					{renderStep()}
				</div>
                <div className={styles.OrderSummary}>
					<div className={styles.orderTextContainer}>
						<h5>Ваш заказ:</h5>

						<div className={styles.orderRow}>
							<span className={styles.label}>Пункт выдачи:</span>
							<span className={styles.dots}>....................................................................................................</span>
							<span className={styles.infoText}>{pickupPoint || 'не выбран'}</span>
						</div>

						{currentStep !== 'location' && (
							<div className={styles.orderRow}>
								<span className={styles.label}>Модель:</span>
								<span className={styles.dots}>....................................................................................................</span>
								<span className={styles.infoText}>{selectedModel?.name || 'не выбрана'}</span>
							</div>
						)}

						{currentStep !== 'location' && selectedModel && <h4>Цена: от {new Intl.NumberFormat('ru-RU').format(selectedModel.priceMin)} до {new Intl.NumberFormat('ru-RU').format(selectedModel.priceMax)} ₽</h4>}
						<Button onClick={handleNextStep} disabled={isButtonDisabled()}>
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