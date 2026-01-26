import { Button } from './ui/button';
import { RefreshCcw } from 'lucide-react';

interface ViewerControlsProps {
    onReset: () => void;
}

export default function ViewerControls({ onReset }: ViewerControlsProps) {
    return (
        <div className="absolute top-2 left-2 z-10">
            <Button variant="outline" size="icon" onClick={onReset} title="Reset Camera View">
                <RefreshCcw className="h-4 w-4" />
            </Button>
        </div>
    )
}
