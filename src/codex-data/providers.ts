import { LLMProvider, ProviderConfig } from '../types';

export const ALL_PROVIDERS: ProviderConfig[] = [
    {
        id: LLMProvider.GOOGLE,
        name: 'Google Gemini',
        docsUrl: 'https://ai.google.dev/gemini-api/docs',
        description: 'Direct access to Google\'s Gemini series (Flash, Pro, Ultra).'
    },
    {
        id: LLMProvider.OPENAI,
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        docsUrl: 'https://platform.openai.com/docs/api-reference',
        description: 'The standard-bearer for LLMs (GPT-4o, o1, o3).'
    },
    {
        id: LLMProvider.ANTHROPIC,
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        docsUrl: 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api',
        description: 'Claude 3.5 Sonnet, Opus, and Haiku models.'
    },
    {
        id: LLMProvider.OPENROUTER,
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        docsUrl: 'https://openrouter.ai/docs',
        description: 'Unified interface for almost every model on earth.'
    },
    {
        id: LLMProvider.GROQ,
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        docsUrl: 'https://wow.groq.com/docs/',
        description: 'Ultra-fast inference for Llama, Mixtral, and Gemma.'
    },
    {
        id: LLMProvider.DEEPSEEK,
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com/v1',
        docsUrl: 'https://api-docs.deepseek.com/',
        description: 'High-performance reasoning models from China.'
    },
    {
        id: LLMProvider.MISTRAL,
        name: 'Mistral AI',
        baseUrl: 'https://api.mistral.ai/v1',
        docsUrl: 'https://docs.mistral.ai/',
        description: 'European frontier models (Large, Medium, Small).'
    },
    {
        id: LLMProvider.TOGETHER,
        name: 'Together AI',
        baseUrl: 'https://api.together.xyz/v1',
        docsUrl: 'https://docs.together.ai/',
        description: 'Massive library of open-source models.'
    },
    {
        id: LLMProvider.SAMBANOVA,
        name: 'SambaNova',
        baseUrl: 'https://api.sambanova.ai/v1',
        docsUrl: 'https://docs.sambanova.ai/',
        description: 'Next-gen hardware-accelerated inference.'
    },
    {
        id: LLMProvider.XAI,
        name: 'xAI (Grok)',
        baseUrl: 'https://api.x.ai/v1',
        docsUrl: 'https://docs.x.ai/',
        description: 'Elon Musk\'s Grok series models.'
    },
    {
        id: LLMProvider.PERPLEXITY,
        name: 'Perplexity',
        baseUrl: 'https://api.perplexity.ai',
        docsUrl: 'https://docs.perplexity.ai/',
        description: 'Search-grounded LLM access.'
    },
    {
        id: LLMProvider.COHERE,
        name: 'Cohere',
        baseUrl: 'https://api.cohere.ai/v1',
        docsUrl: 'https://docs.cohere.com/reference/about',
        description: 'Enterprise-grade Command and Embed models.'
    },
    {
        id: LLMProvider.AI21,
        name: 'AI21 Labs',
        baseUrl: 'https://api.ai21.com/studio/v1',
        docsUrl: 'https://docs.ai21.com/reference/api-reference',
        description: 'Jurassic-2 and Jamba models.'
    },
    {
        id: LLMProvider.HUGGINGFACE,
        name: 'Hugging Face',
        baseUrl: 'https://api-inference.huggingface.co/models',
        docsUrl: 'https://huggingface.co/docs/api-inference/index',
        description: 'Access to thousands of community models.'
    },
    {
        id: LLMProvider.FIREWORKS,
        name: 'Fireworks AI',
        baseUrl: 'https://api.fireworks.ai/inference/v1',
        docsUrl: 'https://readme.fireworks.ai/',
        description: 'Fast, production-ready open model inference.'
    },
    {
        id: LLMProvider.LEPTON,
        name: 'Lepton AI',
        baseUrl: 'https://api.lepton.ai/api/v1',
        docsUrl: 'https://www.lepton.ai/docs',
        description: 'Simplified AI deployment and inference.'
    },
    {
        id: LLMProvider.OCTOAI,
        name: 'OctoAI',
        baseUrl: 'https://api.octoai.cloud/v1',
        docsUrl: 'https://docs.octoai.cloud/',
        description: 'Compute service for high-performance models.'
    },
    {
        id: LLMProvider.REPLICATE,
        name: 'Replicate',
        baseUrl: 'https://api.replicate.com/v1',
        docsUrl: 'https://replicate.com/docs/reference/http',
        description: 'Run open-source models with a cloud API.'
    },
    {
        id: LLMProvider.VOYAGE,
        name: 'Voyage AI',
        baseUrl: 'https://api.voyageai.com/v1',
        docsUrl: 'https://docs.voyageai.com/reference/embeddings-api',
        description: 'Specialized embedding and rerank models.'
    },
    {
        id: LLMProvider.JINA,
        name: 'Jina AI',
        baseUrl: 'https://api.jina.ai/v1',
        docsUrl: 'https://jina.ai/embeddings/',
        description: 'Search and embedding specialized models.'
    },
    {
        id: LLMProvider.UPSTAGE,
        name: 'Upstage',
        baseUrl: 'https://api.upstage.ai/v1',
        docsUrl: 'https://developers.upstage.ai/',
        description: 'Solar LLM and document AI specialists.'
    },
    {
        id: LLMProvider.FRIENDLI,
        name: 'FriendliAI',
        baseUrl: 'https://api.friendli.ai/v1',
        docsUrl: 'https://docs.friendli.ai/',
        description: 'Optimized inference for generative AI.'
    },
    {
        id: LLMProvider.MINIMAX,
        name: 'MiniMax',
        baseUrl: 'https://api.minimax.chat/v1',
        docsUrl: 'https://platform.minimaxi.com/document/introduction',
        description: 'Advanced Chinese LLM provider.'
    },
    {
        id: LLMProvider.MOONSHOT,
        name: 'Moonshot AI',
        baseUrl: 'https://api.moonshot.cn/v1',
        docsUrl: 'https://platform.moonshot.cn/docs/guide/start',
        description: 'Kimi and long-context specialists.'
    },
    {
        id: LLMProvider.LINGYI,
        name: '01.AI (Lingyi)',
        baseUrl: 'https://api.lingyiwanwu.com/v1',
        docsUrl: 'https://platform.lingyiwanwu.com/docs',
        description: 'Yi series models from Dr. Kai-Fu Lee.'
    },
    {
        id: LLMProvider.BAICHUAN,
        name: 'Baichuan AI',
        baseUrl: 'https://api.baichuan-ai.com/v1',
        docsUrl: 'https://platform.baichuan-ai.com/docs',
        description: 'Leading Chinese large language models.'
    },
    {
        id: LLMProvider.ZHIPU,
        name: 'Zhipu AI',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        docsUrl: 'https://open.bigmodel.cn/dev/api',
        description: 'GLM-4 and ChatGLM series models.'
    },
    {
        id: LLMProvider.NOVITA,
        name: 'Novita AI',
        baseUrl: 'https://api.novita.ai/v1',
        docsUrl: 'https://novita.ai/docs/',
        description: 'Serverless GPU and AI model inference.'
    },
    {
        id: LLMProvider.CLOUDFLARE,
        name: 'Cloudflare Workers AI',
        baseUrl: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run',
        docsUrl: 'https://developers.cloudflare.com/workers-ai/',
        description: 'Run models on Cloudflare\'s global edge network.'
    }
];
