import getPromts from "../components/prompts";
let queue = [];
import { getUser, setUser } from "./user";
async function generate_details(type, details, encodedContext) {
    try {
        let user = await getUser(encodedContext);
        if(user.charCount < 0) return;
        for (let i = 0; i < details.length; i++) {
            queue.push(details[i].id);
        }
        for (let i = 0; i < details.length; i++) {
            let description_prompt = getPromts(details[i].name, type, 'description');
            let meta_description_prompt = getPromts(details[i].name, type, 'meta_description');
            let search_keywords_prompt = getPromts(details[i].name, type, 'search_keywords');
            let meta_keywords_prompt = getPromts(details[i].name, type, 'meta_keywords');
            let description_response;
            if (type !== 'Brand') {
                description_response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: description_prompt, type: 'description', model: 'gpt' }),
                });
            }
            const meta_description_response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: meta_description_prompt, type: 'meta_description' }),
            });
            const search_keywords_response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: search_keywords_prompt, type: 'search_keywords' }),
            });
            const meta_keywords_response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: meta_keywords_prompt, type: 'meta_keywords' }),
            });
            let apiFormattedData = { ...details[i] };
            let responses = {
                description: description_response ? await (description_response || {}).json() : { data: '' },
                meta_description: await meta_description_response.json(),
                search_keywords: await search_keywords_response.json(),
                meta_keywords: await meta_keywords_response.json(),
            };
            apiFormattedData.description = responses.description.data ? responses.description.data : null;
            if (type == 'Brand') delete apiFormattedData.description;
            apiFormattedData.meta_description = responses.meta_description.data;
            apiFormattedData.search_keywords = responses.search_keywords.data;
            apiFormattedData.meta_keywords = responses.meta_keywords.data?.split(',');
            let route = type === 'Product' ? 'products' : type === 'Brand' ? 'brands' : 'categories';
            let addedCharCount = 0;
            if (apiFormattedData.description) {
                addedCharCount += apiFormattedData.description.length;
            }
            if (apiFormattedData.meta_description) {
                addedCharCount += apiFormattedData.meta_description.length;
            }
            if (apiFormattedData.search_keywords) {
                addedCharCount += apiFormattedData.search_keywords.length;
            }
            if (apiFormattedData.meta_keywords) {
                addedCharCount += apiFormattedData.meta_keywords.length;
            }
            user.charCount -= addedCharCount;
            console.log(`user: in generate_details ${JSON.stringify(user)}`);
            await setUser(encodedContext, user);
            let res = await fetch(`/api/${route}/${details[i].id}?context=${encodedContext}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(apiFormattedData),
            });
            queue = queue.filter((id) => id !== details[i].id);
        }
    } catch (err) {
        console.log(`Error in generate_details: ${err}`);
    }
}
export default { generate_details, queue };