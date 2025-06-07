import { ChevronDown, ChevronUp } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface AccordionItemProps {
    title: string, 
    children: ReactNode, 
    isOpen: boolean, 
    onClick: () => void,
}

export const AccordionItem: FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-300 py-4">
        <button className="flex justify-between items-center w-full text-left focus:outline-none"
                onClick={onClick}>
                <h3 className="text-xl font-inter text-gray-800">{title}</h3>
                {isOpen ? (<ChevronUp className="h-6 w-6 text-gray-600" />) : (<ChevronDown className="h-6 w-6 text-gray-600" />)}
        </button>
        {isOpen && (<div className="mt-2 text-gray-600 font-inter text-base">{children} </div>)}
    </div>
  );
};