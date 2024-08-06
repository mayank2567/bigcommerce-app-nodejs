import { get } from "http";
//Add with html tags line ul li br h1 h2 p etc for formatting to be to be redered on website, 
let getPromts = (name, type, sub_type) => {
  let prompts = {
    Product:{
      description: `Enrich plagiarism free persuasive product description for
      brand "${name}". The description should demonstrate Expertise, Authoritativeness and Trustworthiness. The description should be comprehensive and should have a transactional intent. The description should be in an engaging format. Highlight Key features, offer detailed specifications, include factual ballistics and performance analysis. Add sections such as Overview, Key Features, Detailed Specifications with actual values, Ballistics and Performance Analysis, Benefits of this particular ammunition, Usage scenarios of this ammunition, Compatibility, Quality Assurance followed by the manufacturer, Accuracy and Precision metrics of this ammunition and Finally Expert Insights. To allow the product description is detailed enough, please include any other external information that may not be requested here to reach to a total word length of at least 1500 words and maximum of 3000 words. Include a compelling call to action encouraging customers to purchase now!`,
      meta_description: `Generate meta description for product "${name}", only retrun one sentence which i can use as meta description`,
      search_keywords: `Generate search keywords for product "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as search keywords directly. return nothing but keywords`,
      meta_keywords: `Generate meta keywords for product "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as meta keywords directly. return nothing but keywords`
    },
    Brand:{
      description: `Generate and enrich plagiarism free brand description for brand "${name}". 
      The description should demonstrate Expertise, Authoritativeness and Trustworthiness. The description should be comprehensive and should have a transactional intent. Use long tail, high intent, high search volume low competition keywords in the write up.`,
      meta_description: `Generate meta description for brand "${name}", only retrun one sentence which i can use as meta description`,
      search_keywords: `Generate search keywords for brand "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as search keywords directly. return nothing but keywords`,
      meta_keywords: `Generate meta keywords for brand "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as meta keywords directly. return nothing but keywords`
    },
    Category:{
      description: `Generate and enrich plagiarism free category description for category ${name}. The description should demonstrate Expertise, Authoritativeness and Trustworthiness. The description should be comprehensive and should have a transactional intent. Use long tail, high intent, high search volume low competition keywords in the write up.`,
      meta_description: `Generate meta description for category "${name}", only retrun one sentence which i can use as meta description`,
      search_keywords: `Generate search keywords for category "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as search keywords directly. return nothing but keywords`,
      meta_keywords: `Generate meta keywords for category "${name}" which are long tail high intent, high volume, low competition and comma separated. return 15 keywords whiich i can use as meta keywords directly. return nothing but keywords`
    }
    }
  return prompts[type][sub_type];
}

export default getPromts;