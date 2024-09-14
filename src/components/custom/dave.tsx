export interface DaveIconProps {
    size?: number;  // Optional size prop to control the icon's size
    color?: string; // Optional color prop to control the text color
}

const DaveIcon: React.FC<DaveIconProps> = ({ size = 24, color = '#000000' }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11.5" fill="white" stroke="#000000" />
            <text x="50%" y="50%" dy=".3em" fill={color} fontSize="12" fontFamily="Arial, sans-serif" textAnchor="middle" alignmentBaseline="central">
                D
            </text>
        </svg>
    );
};
export default DaveIcon