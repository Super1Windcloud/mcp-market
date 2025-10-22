import React from 'react';

interface BaseRouteComponentProps {
  title: string;
  description: string;
}

const BaseRouteComponent: React.FC<BaseRouteComponentProps> = ({ title, description }) => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default BaseRouteComponent;