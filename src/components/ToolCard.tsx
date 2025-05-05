
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  title, 
  description, 
  icon, 
  path,
  color = "bg-pdf-blue"
}) => {
  return (
    <Card className="overflow-hidden tool-card border-0 shadow-md">
      <CardContent className="p-0">
        <div className={`${color} p-6 text-white flex justify-center`}>
          <div className="h-16 w-16 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button className="w-full" asChild>
          <Link to={path}>Use Tool</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
