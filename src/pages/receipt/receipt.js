'use client';

import { useEffect, useState } from 'react';
import Bill from '../../components/Bill';

const ReceiptPage = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const payment = JSON.parse(sessionStorage.getItem('payment'));
        const register = JSON.parse(sessionStorage.getItem('register'));
        setData({ payment, register });
    }, []);
    if (!data) return <div>Loading receipt...</div>;

    return <Bill payment={data.payment} register={data.register} />;
};

export default ReceiptPage;
