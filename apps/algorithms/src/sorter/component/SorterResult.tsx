import Input from 'ui-react19/Input';
import Label from 'ui-react19/Label';
import type { Result } from '../../type';
import { State } from '../../type';

type SorterResultProps = {
    state: State,
    result: Result<number[]> | null
};

export default function SorterResult({ state, result }: SorterResultProps) {
    let value = '';

    if (state === State.RUNNING) {
        value = 'Awaiting result...';
    } else {
        if (result) {
            if ('result' in result) {
                value = result.result.join(', ');
            }

            if (result.state === 'paused') {
                value += ' (paused)';
            }

            if (result.state === 'cancelled') {
                value += ' (cancelled)';
            }

        } else {
            value = 'You\'ll see the result here';
        }
    }

    return (
        <Label className='flex flex-col gap-[0.5rem]'>
            <span className='text-muted-foreground'>
                    Result
            </span>
            <Input
                type='text'
                value={value}
                className='font-mono text-base'
                contentEditable={false}
            />
        </Label>
    );
}