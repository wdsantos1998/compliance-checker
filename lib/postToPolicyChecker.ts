// utils/policyChecker.ts

export interface PolicyPayload {
    [key: string]: any;
}

export const postToPolicyChecker = async (
    baseUrl: string,
    jsonArray: PolicyPayload[]
) => {
    const endpoint = `${baseUrl}/api/policy-checker`;

    for (let i = 0; i < jsonArray.length; i++) {
        console.log(`Processing item ${i}...`, jsonArray[i]);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonArray[i]),
            });

            const data = await response.json();
            const dataArray = Array.isArray(data.result) ? data.result : [];

            if (dataArray.length > 0) {
                // ✅ Found violations, store the first one or all — up to you
                for (let j = 0; j < dataArray.length; j++) {
                    const item = dataArray[j];
                    const dbResponse = await fetch(`${baseUrl}/api/db`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item),
                    });

                    if (dbResponse.status === 200) {
                        console.log(`Inserted item ${i}.${j} into DB`);
                        // ✅ Optional: Stop completely after first violation stored
                        return; // ✅ Exits the entire function
                    } else {
                        console.error(`Failed to insert item ${i}.${j} into DB`);
                    }
                }
            }

        } catch (error) {
            console.error(`Error processing item ${i}:`, error);
        }
    }
};
