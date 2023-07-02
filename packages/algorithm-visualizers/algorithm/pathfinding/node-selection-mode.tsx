import { create } from 'zustand';

export const enum NodeSelectionMode {
    MENU = 'Show Node Context Menu',
    DRAW_OBSTRUCTION = 'Draw Obstruction'
};

type NodeSelectionModeStore = {
    nodeSelectionMode: NodeSelectionMode,
    setNodeSelectionMode: (nodeSelectionMode: NodeSelectionModeStore['nodeSelectionMode']) => void,
    getNodeSelectionMode: () => NodeSelectionModeStore['nodeSelectionMode']
};

export const useNodeSelectionMode = create<NodeSelectionModeStore>((set, get) => ({
    nodeSelectionMode: NodeSelectionMode.MENU,
    setNodeSelectionMode: (nodeSelectionMode) => set({ nodeSelectionMode }),
    getNodeSelectionMode: () => get().nodeSelectionMode
}));

export const NodeSelectionModeSelector = () => {
    const { setNodeSelectionMode } = useNodeSelectionMode();

    return (
        <div>
            <label htmlFor='node-selection-mode'>
                Node Selection Mode
            </label>
            <select
                id='node-selection-mode'
                defaultValue={NodeSelectionMode.MENU}
                onChange={(e) => {
                    setNodeSelectionMode(e.currentTarget.value as NodeSelectionMode);
                }}
            >
                <option value={NodeSelectionMode.MENU}>
                    {NodeSelectionMode.MENU}
                </option>
                <option value={NodeSelectionMode.DRAW_OBSTRUCTION}>
                    {NodeSelectionMode.DRAW_OBSTRUCTION}
                </option>
            </select>
        </div>
    );
};