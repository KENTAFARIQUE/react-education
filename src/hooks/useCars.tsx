import { useState, useEffect } from 'react';
import { carApi } from '../services/Api';

export function useCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                setError(null);
                let data = await carApi.getAllCars();
                setCars(data || [])
            } catch (err: any) {
                setError(err.message || 'Произошла ошибка при загрузке автомобилей');
                setCars([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    });
    return { cars, loading, error };
}