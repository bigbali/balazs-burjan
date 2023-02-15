import { Button } from "ui";
import FieldRangeInput from "ui/FieldRangeInput";

export default function Docs() {
    return (
        <div>
            <h1>Docs</h1>
            <Button />
            <FieldRangeInput min={1} max={2} defaultValue={1} label='gg' step={1} onChange={() => console.log('anyad')} />
        </div>
    );
}
