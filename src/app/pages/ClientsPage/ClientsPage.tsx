import { useEffect, useState } from 'react';
import ClientsCard from './components/ClientsCard';
import type { Client } from './types/Client';

const ClientsPage = () => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        // Simulating data fetching
        const fetchClients = async () => {
            const response = await fetch('/api/clients'); // Replace with your API endpoint
            const data = await response.json();
            setClients(data);
        };

        fetchClients();
    }, []);

    return (
        <div>
            <h1>Clients</h1>
            <div className="clients-list">
                {clients.map(client => (
                    <ClientsCard
                        key={client.id}
                        name={client.name}
                        age={client.age}
                        therapies={client.therapies}
                        balance={client.balance}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClientsPage;