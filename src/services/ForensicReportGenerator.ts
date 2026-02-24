import { ExploitResult, PhaseSettings, ExploitStrategy } from '../types';

/**
 * RED A EYE STUDIO - Zero-Day PoC Generator
 * Synthesizes cryptographically verifiable exploit reports for broker acquisition (e.g., Zerodium).
 */

export interface ForensicPoC {
    id: string;
    timestamp: string;
    targetModel: string;
    strategy: ExploitStrategy;
    baseSettings: PhaseSettings;
    vectorIntensity: number;
    rawTargetQuery: string;
    fusedPayload: string;
    modelOutput: string;
    cryptographicHash: string;
}

export class ForensicReportGenerator {
    
    public static async generatePoC(
        targetModel: string,
        targetQuery: string,
        strategy: ExploitStrategy,
        result: ExploitResult
    ): Promise<ForensicPoC> {
        const timestamp = new Date().toISOString();
        const id = `Z-DAY-${Date.now().toString(16).toUpperCase()}`;
        
        const pocData = {
            id,
            timestamp,
            targetModel,
            strategy,
            baseSettings: result.settings,
            vectorIntensity: result.vectorIntensity,
            rawTargetQuery: targetQuery,
            fusedPayload: result.generatedPrompt || "UNKNOWN_PAYLOAD",
            modelOutput: result.response
        };

        const hash = await this.generateSHA256(JSON.stringify(pocData));

        return {
            ...pocData,
            cryptographicHash: hash
        };
    }

    public static exportAsJSON(poc: ForensicPoC): void {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(poc, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `RED_A_EYE_PoC_${poc.id}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    public static exportAsText(poc: ForensicPoC): void {
        const textContent = `
====================================================================
RED A EYE STUDIO - CLASSIFIED FORENSIC EXPLOIT REPORT (PoC)
====================================================================
ID: ${poc.id}
TIMESTAMP: ${poc.timestamp}
TARGET SUBSTRATE: ${poc.targetModel}
VECTOR STRATEGY: ${poc.strategy}
INTENSITY: ${poc.vectorIntensity}/100
HASH: ${poc.cryptographicHash}
--------------------------------------------------------------------
TARGET OBJECTIVE (RAW):
${poc.rawTargetQuery}

P-H-A-S-E FUSED PAYLOAD (INJECTED):
${poc.fusedPayload}

SUBSTRATE OUTPUT (UNREDACTED):
${poc.modelOutput}
====================================================================
CONFIDENTIAL - DO NOT DISTRIBUTE - RED A EYE SOVEREIGN ASSET
====================================================================
        `.trim();

        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `RED_A_EYE_PoC_${poc.id}.txt`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    private static async generateSHA256(message: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}
