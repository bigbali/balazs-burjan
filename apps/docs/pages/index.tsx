import FieldRangeInput from "ui/FieldRangeInput";

export default function Docs() {
    return (
        <div>
            <h1>Docs</h1>
            <FieldRangeInput min={1} max={2} defaultValue={1} label='gg' step={1} onChange={() => console.log('hey')} />
        </div>
    );
}
