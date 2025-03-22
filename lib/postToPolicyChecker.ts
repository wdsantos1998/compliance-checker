// utils/policyChecker.ts

export interface PolicyPayload {
    [key: string]: any;
}

export const postToPolicyChecker = async (
    baseUrl: string,
    jsonArray: PolicyPayload[]
) => {
    const endpoint = `${baseUrl}/api/policy-checker`;
    const results = [];

    for (let i = 0; i < jsonArray.length; i++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonArray[i]),
            });

            const data = await response.json();
            // Ensure we process the array of results inside `data.result`
            const dataArray = Array.isArray(data.result) ? data.result : [];

            for (let j = 0; j < dataArray.length; j++) {
                const item = dataArray[j];

                const dbResponse = await fetch(`${baseUrl}/api/db`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item),
                });

                if (dbResponse.status === 200) {
                    console.log(`Inserted item ${i}.${j} into DB`);
                } else {
                    console.error(`Failed to insert item ${i}.${j} into DB`);
                }
            }
        }catch (error) {
            console.error(`Error processing item ${i}:`, error);
        }
    }
};
