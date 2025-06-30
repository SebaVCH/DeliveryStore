import React from 'react';

interface BotonVerdeProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    style?: React.CSSProperties;
    type?: 'button' | 'submit' | 'reset';
}

export const BotonVerde: React.FC<BotonVerdeProps> = ({onClick, children, disabled = false, style = {}, type = 'button'}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: disabled ? '#cccccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style
            }}
        >
            {children}
        </button>
    );
};