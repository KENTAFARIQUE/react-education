import { useEffect, useRef } from 'react';
import styles from './breadcrumbs.module.css';
import Triangle from '../../assets/triangle.svg?react';

export type Step = 'location' | 'model' | 'additional' | 'total';

interface BreadcrumbsProps {
	currentStep: Step;
}

const steps: { id: Step; label: string }[] = [
	{ id: 'location', label: 'Местоположение' },
	{ id: 'model', label: 'Модель' },
	{ id: 'additional', label: 'Дополнительно' },
	{ id: 'total', label: 'Итого' },
];

const Breadcrumbs = ({ currentStep }: BreadcrumbsProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const activeStepRef = useRef<HTMLDivElement>(null);

	const getStepIndex = (step: Step) => {
		return steps.findIndex(s => s.id === step);
	};

	const currentIndex = getStepIndex(currentStep);

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
				{steps.map((step, index) => (
					<div
						key={step.id}
						className={styles.step}
						ref={index === currentIndex ? activeStepRef : null}
					>
						<span className={`${styles.stepLabel} ${index <= currentIndex ? styles.activeLabel : ''}`}>
							{step.label}
						</span>
						{index < steps.length - 1 && (
							<Triangle className={styles.triangle} />
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default Breadcrumbs;