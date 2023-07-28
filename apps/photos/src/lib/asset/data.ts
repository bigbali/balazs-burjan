export type Image = {
    title?: string,
    description?: string,
    path: string
};

export type Album = Image[];

export default [
    {
        title: 'hello',
        path: 'yo'
    },
    {
        title: 'hjgb',
        path: 'yo1'
    },
    {
        title: 'zuogo',
        path: 'y2',
        description: 'jajaja'
    },
    {
        path: 'yo3'
    }
] satisfies Album;