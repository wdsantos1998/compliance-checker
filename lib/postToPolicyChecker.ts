// utils/policyChecker.ts

export interface PolicyPayload {
    [key: string]: any;
}

export const postToPolicyChecker = async (
    baseUrl: string,
    jsonArray: PolicyPayload[]
) =>{
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
            for (let i = 0; i < jsonArray.length; i++) {
                const dbResponse = await fetch('/api/db', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonArray[i]),  // Send each string as body
                });

                if (!dbResponse.ok) {
                    console.error(`Failed to insert item ${i}:`);
                } else {
                    console.log(`Inserted item ${i}`);
                }
            }
        } catch (error: any) {
            console.log("An error occurred", error);
        }
    }
};
