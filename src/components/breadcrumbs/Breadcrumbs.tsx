import { useEffect, useRef } from 'react';
import styles from './breadcrumbs.module.css';
import Triangle from '../../assets/triangle.svg?react';
import { useOrderStore } from '../../store/orderStore';

export type Step = 'location' | 'model' | 'additional' | 'total';

interface BreadcrumbsProps {
	currentStep: Step;
	onStepClick?: (step: Step) => void;
}

const steps: { id: Step; label: string }[] = [
	{ id: 'location', label: 'Местоположение' },
	{ id: 'model', label: 'Модель' },
	{ id: 'additional', label: 'Дополнительно' },
	{ id: 'total', label: 'Итого' },
];

const Breadcrumbs = ({ currentStep, onStepClick }: BreadcrumbsProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const activeStepRef = useRef<HTMLDivElement>(null);
	const canNavigateToStep = useOrderStore((state) => state.canNavigateToStep);
	const isStepCompleted = useOrderStore((state) => state.isStepCompleted);

	const getStepIndex = (step: Step) => {
		return steps.findIndex(s => s.id === step);
	};

	const currentIndex = getStepIndex(currentStep);

	const handleStepClick = (step: Step) => {
		if (canNavigateToStep(step) && onStepClick) {
			onStepClick(step);
		}
	};

	useEffect(() => {
		if (window.innerWidth <= 768 && scrollRef.current && activeStepRef.current) {
			const scrollContainer = scrollRef.current;
			const activeElement = activeStepRef.current;

			const offsetLeft = activeElement.offsetLeft;
			const containerWidth = scrollContainer.clientWidth;
			const elementWidth = activeElement.clientWidth;

			scrollContainer.scrollTo({
				left: offsetLeft - (containerWidth / 2) + (elementWidth / 2),
				behavior: 'smooth',
			});
		}
	}, [currentStep]);

	return (
		<div className={styles.breadcrumbsWrapper}>
			<div className={styles.breadcrumbs} ref={scrollRef}>
				{steps.map((step, index) => {
					const isClickable = canNavigateToStep(step);
					const isCompleted = isStepCompleted(step);
					const isCurrent = index === currentIndex;
					const isPrevious = index < currentIndex;
					const isDisabled = !isClickable && index > currentIndex;

					return (
						<div key={step.id} className={styles.step}>
							<button
								type="button"
								className={`${styles.stepButton} ${isCurrent ? styles.activeLabel : ''} ${isPrevious ? styles.previousLabel : ''} ${isDisabled ? styles.disabledLabel : ''}`}
								ref={index === currentIndex ? activeStepRef : null}
								onClick={() => handleStepClick(step.id)}
								disabled={!isClickable}
								aria-current={isCurrent ? 'step' : undefined}
							>
								{step.label}
							</button>
							{index < steps.length - 1 && (
								<Triangle className={`${styles.triangle} ${index < currentIndex ? styles.activeTriangle : ''}`} />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Breadcrumbs;