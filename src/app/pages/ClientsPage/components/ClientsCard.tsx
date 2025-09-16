import React from "react";

interface ClientsCardProps {
  name: string;
  age: number;
  therapies: string[];
  balance: number;
}

const ClientsCard: React.FC<ClientsCardProps> = ({
  name,
  age,
  therapies,
  balance,
}) => {
  return (
    <div className="clients-card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Therapies: {therapies.join(", ")}</p>
      <p>Balance: ${balance.toFixed(2)}</p>
    </div>
  );
};

export default ClientsCard;
