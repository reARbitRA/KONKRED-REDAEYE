import { ExploitResult, PhaseSettings, ExploitStrategy } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    public static async exportLabReport(
        targetModel: string,
        targetQuery: string,
        results: Record<string, string>,
        matrixElement: HTMLElement
    ): Promise<void> {
        const doc = new jsPDF('p', 'mm', 'a4');
        const timestamp = new Date().toLocaleString();
        
        // Branded Header
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(255, 0, 60); // Red A Eye Danger Red
        doc.setFontSize(22);
        doc.setFont('courier', 'bold');
        doc.text('RED A EYE STUDIO', 15, 15);
        
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.text('FORENSIC_EXPLOIT_LAB_SCAN_REPORT', 15, 23);
        doc.text(`TIMESTAMP: ${timestamp}`, 150, 23);

        // Target Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('courier', 'bold');
        doc.text('TARGET CONFIGURATION:', 15, 45);
        
        doc.setFont('courier', 'normal');
        doc.text(`SUBSTRATE ID: ${targetModel}`, 15, 52);
        doc.text(`OBJECTIVE:`, 15, 59);
        
        // Wrap objective text
        const splitObjective = doc.splitTextToSize(targetQuery, 180);
        doc.text(splitObjective, 15, 66);
        
        // Summary Stats
        const entries = Object.values(results);
        const successes = entries.filter(r => r === 'SUCCESS').length;
        const total = entries.length;
        
        let y = 66 + (splitObjective.length * 5);
        doc.setFont('courier', 'bold');
        doc.text('SCAN SUMMARY:', 15, y);
        doc.setFont('courier', 'normal');
        doc.text(`VECTORS TESTED: ${total}`, 15, y + 7);
        doc.text(`FRACTURE POINTS DETECTED: ${successes}`, 15, y + 14);
        
        // Capture Matrix Status via html2canvas
        y += 25;
        doc.setFont('courier', 'bold');
        doc.text('VECTOR_MATRIX_SNAPSHOT:', 15, y);
        
        try {
            const canvas = await html2canvas(matrixElement, {
                backgroundColor: '#0a0a0a',
                scale: 2
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            doc.addImage(imgData, 'PNG', 15, y + 5, imgWidth, imgHeight);
            
            y += imgHeight + 15;
        } catch (e) {
            console.error('Failed to capture matrix snapshot', e);
            y += 10;
            doc.text('[SNAPSHOT_CAPTURE_FAILED]', 15, y);
        }

        // List successful vectors
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFont('courier', 'bold');
        doc.text('SUCCESSFUL VECTORS IDENTIFIED:', 15, y);
        y += 10;
        
        const successList = Object.entries(results).filter(([_, s]) => s === 'SUCCESS');
        doc.setFontSize(8);
        doc.setFont('courier', 'normal');
        
        successList.forEach(([strategy], index) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(`- ${strategy}`, 20, y);
            y += 5;
        });

        // Confidential Footer
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('CONFIDENTIAL - RED A EYE SOVEREIGN ASSET - DO NOT DISTRIBUTE', 105, 290, { align: 'center' });

        doc.save(`RED_A_EYE_LAB_REPORT_${Date.now()}.pdf`);
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
