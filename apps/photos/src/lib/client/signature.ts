export const fetchSignature = async (properties: Record<string, string>): Promise<{ timestamp: string, signature: string }> => {
    const response = await fetch('/api/signature', {
        body: JSON.stringify(properties),
        method: 'POST'
    });

    return await response.json();
};

