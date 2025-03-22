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
            if (data.status === 200) {
                console.log("This is the data", data.result);
            }
            else{
                console.log("Error while analyzing the email", data.result);
            }
        } catch (error: any) {
            console.log("An error occurred", error);
        }
    }
};
