import styles from './breadcrumbs.module.css';
import Triangle from '../../assets/triangle.svg?react'
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
	const getStepIndex = (step: Step) => {
		return steps.findIndex(s => s.id === step);
	};

	const currentIndex = getStepIndex(currentStep);

	return (
		<div className={styles.breadcrumbs}>
			{steps.map((step, index) => (
				<div key={step.id} className={styles.step}>
					<span className={`${styles.stepLabel} ${index <= currentIndex ? styles.activeLabel : ''}`}>
						{step.label}
					</span>
					{index < steps.length - 1 && (
						<Triangle className={styles.triangle}/>
					)}
				</div>
			))}
		</div>
	);
};

export default Breadcrumbs;