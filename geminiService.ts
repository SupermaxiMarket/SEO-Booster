import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AnalysisType, Keyword, Competitor } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "API_KEY_NOT_SET" });

const getKeywordsSchema = (lang: string) => {
    const descriptions = {
        en: {
            list: "List of SEO keywords",
            word: "The keyword phrase.",
            category: "Can be 'primary', 'secondary', or 'long-tail'.",
            reason: "Brief reason why this is a good keyword."
        },
        fr: {
            list: "Liste de mots-clés SEO",
            word: "L'expression du mot-clé.",
            category: "Peut être 'primaire', 'secondaire', ou 'longue traîne' (long-tail).",
            reason: "Brève explication de la pertinence de ce mot-clé."
        }
    };
    const d = lang === 'fr' ? descriptions.fr : descriptions.en;

    return {
        type: Type.OBJECT,
        properties: {
            keywords: {
                type: Type.ARRAY,
                description: d.list,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        word: { type: Type.STRING, description: d.word },
                        category: { type: Type.STRING, description: d.category },
                        reason: { type: Type.STRING, description: d.reason }
                    },
                    required: ["word", "category", "reason"]
                }
            }
        },
        required: ["keywords"]
    };
};

const getCompetitorsSchema = (lang: string) => {
    const descriptions = {
        en: {
            list: "List of competitors",
            name: "Name of the competitor or archetype.",
            strategy: "Their likely SEO strategy.",
            keywords: "Main keywords they might target.",
            weakness: "A weakness in their approach that can be exploited."
        },
        fr: {
            list: "Liste des concurrents",
            name: "Nom du concurrent ou de l'archétype.",
            strategy: "Leur stratégie SEO probable.",
            keywords: "Principaux mots-clés qu'ils pourraient cibler.",
            weakness: "Une faiblesse dans leur approche qui peut être exploitée."
        }
    };
    const d = lang === 'fr' ? descriptions.fr : descriptions.en;

    return {
        type: Type.OBJECT,
        properties: {
            competitors: {
                type: Type.ARRAY,
                description: d.list,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: d.name },
                        strategy: { type: Type.STRING, description: d.strategy },
                        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: d.keywords },
                        weakness: { type: Type.STRING, description: d.weakness }
                    },
                    required: ["name", "strategy", "keywords", "weakness"]
                }
            }
        },
        required: ["competitors"]
    };
};


const getSystemInstruction = (type: AnalysisType, tone: string, lang: string): string => {
    const languageMap = {
        en: 'English',
        fr: 'French'
    };
    const targetLanguage = languageMap[lang] || 'English';

    switch (type) {
        case AnalysisType.IMPROVE:
        case AnalysisType.SUGGESTION:
            return `You are an expert SEO copywriter. Rewrite the user's text to be engaging, persuasive, and optimized for search engines in ${targetLanguage}. Maintain the core message but enhance the language, structure, and keyword density naturally. The desired tone is: ${tone}.`;
        case AnalysisType.KEYWORDS:
            return `You are an SEO specialist. Analyze the user's text/topic and provide the best SEO keywords in ${targetLanguage}. The entire response, including all fields in the JSON schema, must be in ${targetLanguage}.`;
        case AnalysisType.COMPETITOR:
            return `You are a market analyst specializing in SEO. Analyze the user's topic and provide a competitive analysis in ${targetLanguage}. The entire response, including all fields in the JSON schema, must be in ${targetLanguage}.`;
        default:
            return `You are a helpful AI assistant writing in ${targetLanguage}.`;
    }
};


export const generateSeoContent = async (
    type: AnalysisType,
    input: string,
    lang: string,
    tone: string = 'professional'
): Promise<any> => {
    
    if (!process.env.API_KEY || process.env.API_KEY === "API_KEY_NOT_SET") {
        console.error("Gemini API key is not configured.");
        // Return mock data for development
        await new Promise(res => setTimeout(res, 1000));
        if (type === AnalysisType.KEYWORDS) {
            return { keywords: [{ word: 'mock keyword', category: 'primary', reason: 'This is a mock response.' }] };
        }
        if (type === AnalysisType.IMPROVE || type === AnalysisType.SUGGESTION) {
            return { improvedText: `This is a mock improved text for: "${input}"` };
        }
        if (type === AnalysisType.COMPETITOR) {
            return { competitors: [{ name: 'Mock Competitor', strategy: 'Mock strategy', keywords: ['mock kw1', 'mock kw2'], weakness: 'Mock weakness' }] };
        }
    }

    const systemInstruction = getSystemInstruction(type, tone, lang);
    let response: GenerateContentResponse;
    
    try {
        if (type === AnalysisType.IMPROVE || type === AnalysisType.SUGGESTION) {
            response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: input }] }],
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            return { improvedText: response.text };
        } else {
             const schema = type === AnalysisType.KEYWORDS ? getKeywordsSchema(lang) : getCompetitorsSchema(lang);
             response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{ role: "user", parts: [{ text: input }] }],
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });

            try {
                // The response text is a stringified JSON, so we need to parse it.
                return JSON.parse(response.text);
            } catch (e) {
                console.error("Failed to parse Gemini JSON response:", e);
                console.error("Raw response:", response.text);
                throw new Error("Received malformed JSON from API.");
            }
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from AI service.");
    }
};