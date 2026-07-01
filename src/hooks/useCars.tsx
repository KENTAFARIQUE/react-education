import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';

export type Car = {
    id: number;
    name: string;
    priceMax: number;
    priceMin: number;
    thumbnail: { path: string; };
    description: string;
    number: string | null;
    tank: string | null;
    colors: string | string[];
    createdAt: string;
    updatedAt: string;
    categoryId: {
        id: number;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    };
};

type CarsResponse = {
    data: Car[];
    count: number;  
};

export function useCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchCars = async () => {
            try {
                setLoading(true);
                setError(null);

                const response: CarsResponse =
                    await carApi.getAllCars(abortController.signal);

                setCars(response.data || []);
            } catch (err: unknown) {
                if (err instanceof DOMException && err.name === 'AbortError') return;

                setError(
                    err instanceof Error ? err.message : 'Произошла ошибка при загрузке автомобилей'
                );

                setCars([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();

        return () => abortController.abort();
    }, []);

    return {
        cars,
        loading,
        error,
        setCars,
    };
}