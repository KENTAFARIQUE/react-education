import { useEffect, useRef } from 'react';
import styles from './breadcrumbs.module.css';
import Triangle from '../../assets/triangle.svg?react';
import { useOrderStore, type OrderStep } from '../../store/orderStore';

interface BreadcrumbsProps {
	currentStep: OrderStep;
	onStepClick?: (step: OrderStep) => void;
}

const steps: { id: OrderStep; label: string }[] = [
	{ id: 'location', label: 'Местоположение' },
	{ id: 'model', label: 'Модель' },
	{ id: 'additional', label: 'Дополнительно' },
	{ id: 'total', label: 'Итого' },
];

const Breadcrumbs = ({ currentStep, onStepClick }: BreadcrumbsProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const activeStepRef = useRef<HTMLDivElement | null>(null);
	const initialScrollDoneRef = useRef(false);
	const canNavigateToStep = useOrderStore((state) => state.canNavigateToStep);

	const getStepIndex = (step: OrderStep) => {
		return steps.findIndex(s => s.id === step);
	};

	const currentIndex = getStepIndex(currentStep);

	const handleStepClick = (step: OrderStep) => {
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

			const scrollLeft = offsetLeft - (containerWidth / 2) + (elementWidth / 2);
			const maxScroll = scrollContainer.scrollWidth - containerWidth;

			if (!initialScrollDoneRef.current) {
				scrollContainer.scrollLeft = Math.max(0, Math.min(scrollLeft, maxScroll));
				initialScrollDoneRef.current = true;
			} else {
				scrollContainer.scrollTo({
					left: Math.max(0, Math.min(scrollLeft, maxScroll)),
					behavior: 'smooth',
				});
			}
		}
	}, [currentStep]);

	return (
		<div className={styles.breadcrumbsWrapper} ref={scrollRef}>
			<div className={styles.breadcrumbs}>
				{steps.map((step, index) => {
				const isClickable = canNavigateToStep(step.id);
				const isCurrent = index === currentIndex;
				const isPrevious = index < currentIndex;
				const isDisabled = !isClickable && index > currentIndex;

					return (
						<div
							key={step.id}
							className={styles.step}
							style={{ '--i': index } as React.CSSProperties}
							ref={index === currentIndex ? activeStepRef : null}
						>
							<button
								type="button"
								className={`${styles.stepButton} ${isCurrent ? styles.activeLabel : ''} ${isPrevious ? styles.previousLabel : ''} ${isDisabled ? styles.disabledLabel : ''}`}
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