import getPromts from "../components/prompts";
let queue = [];
async function generate_details(type, details, encodedContext) {
    for(let i = 0; i < details.length; i++){
        queue.push(details[i].id);
    }
    for (let i = 0; i < details.length; i++) {
        let description_prompt = getPromts(details[i].name, type, 'description');
        let meta_description_prompt = getPromts(details[i].name, type, 'meta_description');
        let search_keywords_prompt = getPromts(details[i].name, type, 'search_keywords');
        let meta_keywords_prompt = getPromts(details[i].name, type, 'meta_keywords');
        let description_response;
        if(type !== 'Brand'){
            description_response = await fetch(`/api/gptprompt?context=${encodedContext}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: description_prompt, type: 'description' }),
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
            description: description_response ? await (description_response || {} ).json() : {data: ''},
            meta_description: await meta_description_response.json(),
            search_keywords: await search_keywords_response.json(),
            meta_keywords: await meta_keywords_response.json(),
        };
        apiFormattedData.description = responses.description.data ? responses.description.data : null;
        if(type == 'Brand') delete apiFormattedData.description;
        apiFormattedData.meta_description = responses.meta_description.data;
        apiFormattedData.search_keywords = responses.search_keywords.data;
        apiFormattedData.meta_keywords = responses.meta_keywords.data?.split(',');
        let route = type === 'Product' ? 'products' : type === 'Brand' ? 'brands' : 'categories';
        let res = await fetch(`/api/${route}/${details[i].id}?context=${encodedContext}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiFormattedData),
        });
        queue = queue.filter((id) => id !== details[i].id);

    }
}
export default {generate_details, queue};