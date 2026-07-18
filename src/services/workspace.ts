import { getAccessToken } from './firebase.ts';

export interface WorkspaceExportResult {
  fileId: string;
  title: string;
  url: string;
}

/**
 * Service to handle Google Docs, Sheets, and Slides integrations via direct REST calls using
 * the user's cached Google OAuth access token.
 */
export const WorkspaceService = {
  /**
   * Generates a structural Vulnerability Assessment document in Google Docs
   */
  createGoogleDoc: async (title: string, summaryMarkdown: string): Promise<WorkspaceExportResult> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Authentication required. Please sign in via Google.");
    }

    // Step 1: Create empty document
    const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create Google Doc: ${err}`);
    }

    const docData = await createRes.json();
    const documentId = docData.documentId;
    const url = `https://docs.google.com/document/d/${documentId}/edit`;

    // Step 2: Content parsing & batch update
    // We will append a title, metadata block, and sections
    const requests: any[] = [];
    
    let index = 1; // start index
    
    // Header Section
    const formattedText = 
      `RED_REDTE_SYSTEMS SECURITY INTEL AUDIT\n` +
      `======================================\n` +
      `Report Title: ${title}\n` +
      `Export Timestamp: ${new Date().toISOString()}\n\n` +
      `AUDIT CODENAME: PROJECT_REDAEYE_STRESS\n\n` +
      `1. OVERVIEW AND SUMMARY OF ALIGNMENT BREACHES\n` +
      `----------------------------------------------\n` +
      `Through rigorous adversarial alignment fuzzing and mechanistics stress tests, ` +
      `we have probed active language models using advanced semantic vectors and logical recursion.\n\n` +
      `${summaryMarkdown}\n\n` +
      `2. COMPLIANCE ASSESSMENT & RECOMMENDATIONS\n` +
      `----------------------------------------------\n` +
      `* Recommended mitigation paths encompass strict instruction tuning, multi-turn system prompt anchors, ` +
      `and automated validation on key output tokens.\n` +
      `* Ensure defensive boundaries are audited recursively at least every 48 hours.\n\n` +
      `----------------------------------------------\n` +
      `[CONFIDENTIAL - ADVERSARIAL COMPLIANCE RESEARCH ONLY]\n`;

    requests.push({
      insertText: {
        location: { index: 1 },
        text: formattedText
      }
    });

    // Update styling for Title and headers
    // Since we inserted all text at index 1, we can apply stylish formatting to sections
    // Simple block style:
    const stylingRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    if (!stylingRes.ok) {
      console.warn("Doc created, but failed to write initial styling batch.", await stylingRes.text());
    }

    return {
      fileId: documentId,
      title,
      url
    };
  },

  /**
   * Generates a matrix spreadsheet with audit metrics in Google Sheets
   */
  createGoogleSheet: async (title: string, metricsRows: string[][]): Promise<WorkspaceExportResult> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Authentication required. Please sign in via Google.");
    }

    // Step 1: Create spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title }
      })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create Google Sheet: ${err}`);
    }

    const sheetData = await createRes.json();
    const spreadsheetId = sheetData.spreadsheetId;
    const url = `https://sheets.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Step 2: Prepare columns
    const headers = ["Index", "Technique Code", "Trigger Strategy", "Breach Success Rate (%)", "Log Entropy Score", "Threat Tier", "Status"];
    const valuePayload = [headers, ...metricsRows];

    // Append cells
    const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: valuePayload
      })
    });

    if (!appendRes.ok) {
      const err = await appendRes.text();
      throw new Error(`Failed to populate Google Sheet cells: ${err}`);
    }

    return {
      fileId: spreadsheetId,
      title,
      url
    };
  },

  /**
   * Appends rows of data to an existing Google Sheet
   */
  appendToGoogleSheet: async (spreadsheetId: string, rows: string[][]): Promise<any> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Authentication required. Please sign in via Google.");
    }

    const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: rows
      })
    });

    if (!appendRes.ok) {
      const err = await appendRes.text();
      throw new Error(`Failed to append to Google Sheet: ${err}`);
    }

    return await appendRes.json();
  },

  /**
   * Generates an Executive Security Briefing Deck in Google Slides
   */
  createGoogleSlide: async (title: string, slidesContent: { title: string; bullets: string[] }[]): Promise<WorkspaceExportResult> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error("Authentication required. Please sign in via Google.");
    }

    // Step 1: Create presentation
    const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(`Failed to create Google Slide Presentation: ${err}`);
    }

    const slideData = await createRes.json();
    const presentationId = slideData.presentationId;
    const url = `https://slides.google.com/presentation/d/${presentationId}/edit`;

    const requests: any[] = [];

    // Title slide is slide 0 (created by default). Let's edit title text.
    // Google Slides slides by default have predefined shape IDs on default layout 'TITLE'.
    // Better way: Create new slides with specific layout, then insert shapes.
    
    slidesContent.forEach((slide, index) => {
      const slideId = `slide_page_${index}`;
      const titleBoxId = `title_box_${index}`;
      const bodyBoxId = `body_box_${index}`;

      // Create Slide
      requests.push({
        createSlide: {
          objectId: slideId,
          insertionIndex: index,
          slideLayoutReference: {
            predefinedLayout: 'TITLE_AND_BODY'
          }
        }
      });

      // We can fetch or insert text boxes. Using default layout, we can just replace shape text or insert.
      // For precision, since TITLE_AND_BODY layout auto-provisions two placeholders, 
      // we can target them if we know their object IDs, or simply create standard text boxes!
      // Let's create two shapes: Title block & Content block on our slide.
      const titleBoxObjectId = `title_textbox_${index}`;
      const bodyBoxObjectId = `body_textbox_${index}`;

      requests.push({
        createShape: {
          objectId: titleBoxObjectId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 600, unit: 'PT' },
              height: { magnitude: 60, unit: 'PT' }
            },
            transform: {
              scaleX: 1, scaleY: 1, translateX: 50, translateY: 40, unit: 'PT'
            }
          }
        }
      });

      requests.push({
        insertText: {
          objectId: titleBoxObjectId,
          text: slide.title
        }
      });

      requests.push({
        createShape: {
          objectId: bodyBoxObjectId,
          shapeType: 'TEXT_BOX',
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 600, unit: 'PT' },
              height: { magnitude: 250, unit: 'PT' }
            },
            transform: {
              scaleX: 1, scaleY: 1, translateX: 50, translateY: 120, unit: 'PT'
            }
          }
        }
      });

      const listText = slide.bullets.map(b => `• ${b}`).join('\n');
      requests.push({
        insertText: {
          objectId: bodyBoxObjectId,
          text: listText
        }
      });
    });

    if (requests.length > 0) {
      const batchRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      });

      if (!batchRes.ok) {
        console.warn("Created presentation, but slide batch insertion failed.", await batchRes.text());
      }
    }

    return {
      fileId: presentationId,
      title,
      url
    };
  }
};
