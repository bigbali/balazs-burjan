import { useRouter } from 'next/router';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui-react19/Select';
import { Mode } from '../pages/[mode]';

export default function ModeSelector() {
    const router = useRouter();

    return (
        <div className='w-full'>
            <Select
                value={router.query.mode as Mode}
                onValueChange={(value)  => router.push(`/${value}`)}
            >
                <SelectTrigger className='w-full capitalize'>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.values(Mode).map((mode) => (
                        <SelectItem
                            className='capitalize'
                            value={mode}
                            key={mode}
                        >
                            {mode}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}