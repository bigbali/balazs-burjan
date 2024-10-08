import { useRouter } from 'next/router';
import { Select, SelectItem } from 'ui-react19';
import { Mode } from '../pages/[mode]';

export default function ModeSelector() {
    const router = useRouter();

    return (
        <div className='flex-1 w-full'>
            <Select
                value={router.query.mode as Mode}
                onValueChange={(value)  => router.push(`/${value}`)}
            >
                {Object.values(Mode).map((mode) => (
                    <SelectItem
                        className='capitalize'
                        value={mode}
                        key={mode}
                    >
                        {mode}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}