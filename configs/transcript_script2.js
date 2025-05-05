(function fixBrokenCharacters() {
    console.log("[EncodingFix] Running corrupted character fix...");

    const replacements = [
        { broken: /â/g, fixed: '’' },  // right single quote
        { broken: /â/g, fixed: '“' },  // left double quote
        { broken: /â/g, fixed: '”' },  // right double quote
        { broken: /â¦/g, fixed: '…' },  // ellipsis
        { broken: /â/g, fixed: '–' },  // en dash
        { broken: /â”/g, fixed: '—' },  // em dash
        { broken: /â¢/g, fixed: '•' },  // bullet
        { broken: /â/g, fixed: '‘' },  // left single quote
        { broken: /Ã¼/g, fixed: 'ü' },
        { broken: /Ã¶/g, fixed: 'ö' },
        { broken: /Ã©/g, fixed: 'é' },
        { broken: /Ã¨/g, fixed: 'è' },
        { broken: /Ãª/g, fixed: 'ê' },
        { broken: /Ã«/g, fixed: 'ë' },
        { broken: /Ã§/g, fixed: 'ç' },
        { broken: /Ã±/g, fixed: 'ñ' },
        { broken: /Ã¢/g, fixed: 'â' },
        { broken: /Ã¤/g, fixed: 'ä' },
        { broken: /Ã /g,  fixed: 'à' },
        { broken: /Ã/g, fixed: 'ß' },
        { broken: /Ã¹/g, fixed: 'ù' },
        { broken: /Ã¡/g, fixed: 'á' },
        { broken: /Ã³/g, fixed: 'ó' },
    ];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    let count = 0;

    while ((node = walker.nextNode())) {
        let original = node.nodeValue;
        let fixed = original;

        for (const { broken, fixed: replacement } of replacements) {
            fixed = fixed.replace(broken, replacement);
        }

        if (fixed !== original) {
            console.log(`[EncodingFix] Fixed: "${original}" → "${fixed}"`);
            node.nodeValue = fixed;
            count++;
        }
    }

    console.log(`[EncodingFix] Completed. Fixed ${count} text nodes.`);
})();



(function() {
    // Define the decodeUTF8 function
    function decodeUTF8(s) {
        let l = s.length;
        let b, sumb = 0, i, more = -1;
        let sbuf = "";

        console.log("[decodeUTF8] Starting to decode string...");

        for (i = 0; i < l; i++) {
            b = s.charCodeAt(i);

            // Continuation byte of a multi-byte character
            if ((b & 0xc0) === 0x80) {
                sumb = (sumb << 6) | (b & 0x3f);
                if (--more === 0) {
                    sbuf += String.fromCharCode(sumb);
                    console.log(`[decodeUTF8] Decoded character: ${String.fromCharCode(sumb)}`);
                }
            } 
            // ASCII character (single-byte)
            else if ((b & 0x80) === 0x00) {
                sbuf += String.fromCharCode(b);
                console.log(`[decodeUTF8] ASCII character: ${String.fromCharCode(b)}`);
            }
            // Start of a 2-byte character
            else if ((b & 0xe0) === 0xc0) {
                sumb = b & 0x1f;
                more = 1;
            } 
            // Start of a 3-byte character
            else if ((b & 0xf0) === 0xe0) {
                sumb = b & 0x0f;
                more = 2;
            }
            // Start of a 4-byte character
            else if ((b & 0xf8) === 0xf0) {
                sumb = b & 0x07;
                more = 3;
            }
            // Start of a 5-byte character
            else if ((b & 0xfc) === 0xf8) {
                sumb = b & 0x03;
                more = 4;
            }
            // Start of a 6-byte character
            else {
                sumb = b & 0x01;
                more = 5;
            }
        }

        console.log("[decodeUTF8] Decoding complete.");
        return sbuf;
    }

    // Function to loop through all text nodes and decode them
    function fixTextInDocument() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let count = 0;

        while ((node = walker.nextNode())) {
            const originalText = node.nodeValue;
            
            // Only process if the text looks "corrupt" (check if it contains common corrupted patterns)
            if (/Â|Ã|â/.test(originalText)) {
                console.log("[fixTextInDocument] Corrupted text found:", originalText);
                const fixedText = decodeUTF8(originalText); // Decode corrupted text
                node.nodeValue = fixedText;
                console.log("[fixTextInDocument] Replaced with decoded text:", fixedText);
                count++;
            }
        }

        console.log(`[fixTextInDocument] Total decoded text nodes: ${count}`);
    }

    // Trigger the function to fix all text in the HTML document
    console.log("[trigger] Starting document-wide corruption fix...");
    fixTextInDocument();
    console.log("[trigger] Document-wide corruption fix completed.");
})();


(function() {
    // Function to decode corrupted UTF-8 text
    function decodeUTF8(s) {
        let l = s.length;
        let b, sumb = 0, i, more = -1;
        let sbuf = "";

        console.log("[decodeUTF8] Starting to decode string...");

        for (i = 0; i < l; i++) {
            b = s.charCodeAt(i);

            // Continuation byte of a multi-byte character
            if ((b & 0xc0) === 0x80) {
                sumb = (sumb << 6) | (b & 0x3f);
                if (--more === 0) {
                    sbuf += String.fromCharCode(sumb);
                    console.log(`[decodeUTF8] Decoded character: ${String.fromCharCode(sumb)}`);
                }
            } 
            // ASCII character (single-byte)
            else if ((b & 0x80) === 0x00) {
                sbuf += String.fromCharCode(b);
                console.log(`[decodeUTF8] ASCII character: ${String.fromCharCode(b)}`);
            }
            // Start of a 2-byte character
            else if ((b & 0xe0) === 0xc0) {
                sumb = b & 0x1f;
                more = 1;
            } 
            // Start of a 3-byte character
            else if ((b & 0xf0) === 0xe0) {
                sumb = b & 0x0f;
                more = 2;
            }
            // Start of a 4-byte character
            else if ((b & 0xf8) === 0xf0) {
                sumb = b & 0x07;
                more = 3;
            }
            // Start of a 5-byte character
            else if ((b & 0xfc) === 0xf8) {
                sumb = b & 0x03;
                more = 4;
            }
            // Start of a 6-byte character
            else {
                sumb = b & 0x01;
                more = 5;
            }
        }

        console.log("[decodeUTF8] Decoding complete.");
        return sbuf;
    }

    // Function to loop through all text nodes and decode them, handling both common and Asian languages
    function fixTextInDocument() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let count = 0;

        while ((node = walker.nextNode())) {
            const originalText = node.nodeValue;

            // Match common corrupted patterns (Cyrillic, Chinese, Japanese, etc.)
            if (/Â|Ã|â|å|é|ç|æ|è|é|ā|ǎ|å¥³|æµ·|è|ç¥|å|å°|æ¢|ã/.test(originalText)) {
                console.log("[fixTextInDocument] Corrupted text found:", originalText);
                const fixedText = decodeUTF8(originalText); // Decode corrupted text
                node.nodeValue = fixedText;
                console.log("[fixTextInDocument] Replaced with decoded text:", fixedText);
                count++;
            }
        }

        console.log(`[fixTextInDocument] Total decoded text nodes: ${count}`);
    }

    // Trigger the function to fix all text in the HTML document
    console.log("[trigger] Starting document-wide corruption fix...");
    fixTextInDocument();
    console.log("[trigger] Document-wide corruption fix completed.");
})();





console.log("___________________________");


(function() {
    // Renamed function to decode corrupted UTF-8 text
    function customDecodeUTF8(s) {
        let l = s.length;
        let b, sumb = 0, i, more = -1;
        let sbuf = "";

        console.log("[customDecodeUTF8] Starting to decode string...");

        for (i = 0; i < l; i++) {
            b = s.charCodeAt(i);

            // Continuation byte of a multi-byte character
            if ((b & 0xc0) === 0x80) {
                sumb = (sumb << 6) | (b & 0x3f);
                if (--more === 0) {
                    sbuf += String.fromCharCode(sumb);
                    console.log(`[customDecodeUTF8] Decoded character: ${String.fromCharCode(sumb)}`);
                }
            } 
            // ASCII character (single-byte)
            else if ((b & 0x80) === 0x00) {
                sbuf += String.fromCharCode(b);
                console.log(`[customDecodeUTF8] ASCII character: ${String.fromCharCode(b)}`);
            }
            // Start of a 2-byte character
            else if ((b & 0xe0) === 0xc0) {
                sumb = b & 0x1f;
                more = 1;
            } 
            // Start of a 3-byte character
            else if ((b & 0xf0) === 0xe0) {
                sumb = b & 0x0f;
                more = 2;
            }
            // Start of a 4-byte character
            else if ((b & 0xf8) === 0xf0) {
                sumb = b & 0x07;
                more = 3;
            }
            // Start of a 5-byte character
            else if ((b & 0xfc) === 0xf8) {
                sumb = b & 0x03;
                more = 4;
            }
            // Start of a 6-byte character
            else {
                sumb = b & 0x01;
                more = 5;
            }
        }

        console.log("[customDecodeUTF8] Decoding complete.");
        return sbuf;
    }

    // Renamed function to loop through all text nodes and decode them
    function processTextNodesWithDelay() {
        setTimeout(() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            let count = 0;

            while ((node = walker.nextNode())) {
                const originalText = node.nodeValue;

                // Match common corrupted patterns (Cyrillic, Chinese, Japanese, etc.)
                if (/Â|Ã|â|å|é|ç|æ|è|é|ā|ǎ|å¥³|æµ·|è|ç¥|å|å°|æ¢|ã/.test(originalText)) {
                    console.log("[processTextNodesWithDelay] Corrupted text found:", originalText);
                    const fixedText = customDecodeUTF8(originalText); // Decode corrupted text
                    node.nodeValue = fixedText;
                    console.log("[processTextNodesWithDelay] Replaced with decoded text:", fixedText);
                    count++;
                }
            }

            console.log(`[processTextNodesWithDelay] Total decoded text nodes: ${count}`);
        }, 2000); // Delay of 2 seconds before executing
    }

    // Trigger the function with a 2-second delay
    console.log("[trigger] Starting document-wide corruption fix with 2-second delay...");
    processTextNodesWithDelay();
    console.log("[trigger] Document-wide corruption fix triggered (delayed).");
})();

























(function() {
    // Define the decodeUTF8 function
    function decodeUTF8(s) {
        let l = s.length;
        let b, sumb = 0, i, more = -1;
        let sbuf = "";

        console.log("[decodeUTF8] Starting to decode string...");

        for (i = 0; i < l; i++) {
            b = s.charCodeAt(i);

            // Continuation byte of a multi-byte character
            if ((b & 0xc0) === 0x80) {
                sumb = (sumb << 6) | (b & 0x3f);
                if (--more === 0) {
                    sbuf += String.fromCharCode(sumb);
                    console.log(`[decodeUTF8] Decoded character: ${String.fromCharCode(sumb)}`);
                }
            } 
            // ASCII character (single-byte)
            else if ((b & 0x80) === 0x00) {
                sbuf += String.fromCharCode(b);
                console.log(`[decodeUTF8] ASCII character: ${String.fromCharCode(b)}`);
            }
            // Start of a 2-byte character
            else if ((b & 0xe0) === 0xc0) {
                sumb = b & 0x1f;
                more = 1;
            } 
            // Start of a 3-byte character
            else if ((b & 0xf0) === 0xe0) {
                sumb = b & 0x0f;
                more = 2;
            }
            // Start of a 4-byte character
            else if ((b & 0xf8) === 0xf0) {
                sumb = b & 0x07;
                more = 3;
            }
            // Start of a 5-byte character
            else if ((b & 0xfc) === 0xf8) {
                sumb = b & 0x03;
                more = 4;
            }
            // Start of a 6-byte character
            else {
                sumb = b & 0x01;
                more = 5;
            }
        }

        console.log("[decodeUTF8] Decoding complete.");
        return sbuf;
    }

    // Function to fix all text in the document
    function fixTextInDocument() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        let count = 0;

        while ((node = walker.nextNode())) {
            const originalText = node.nodeValue;
            
            // Only process if the text looks "corrupt" (check if it contains common corrupted patterns)
            if (/Â|Ã|â/.test(originalText)) {
                console.log("[fixTextInDocument] Corrupted text found:", originalText);
                const fixedText = decodeUTF8(originalText); // Decode corrupted text
                node.nodeValue = fixedText;
                console.log("[fixTextInDocument] Replaced with decoded text:", fixedText);
                count++;
            }
        }

        console.log(`[fixTextInDocument] Total decoded text nodes: ${count}`);
    }

    // Function to process and fix text of embedded messages (using XPath)
    function fixEmbedsUsingXPath(xpath) {
        const nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        let count = 0;

        for (let i = 0; i < nodes.snapshotLength; i++) {
            const node = nodes.snapshotItem(i);
            if (node) {
                const originalText = node.textContent;
                // Process the text at the given XPath node if it contains corrupted characters
                if (/Â|Ã|â/.test(originalText)) {
                    console.log(`[fixEmbedsUsingXPath] Corrupted text found at path: ${xpath}`, originalText);
                    const fixedText = decodeUTF8(originalText); // Decode corrupted text
                    node.textContent = fixedText;
                    console.log(`[fixEmbedsUsingXPath] Replaced with decoded text: ${fixedText}`);
                    count++;
                }
            }
        }

        console.log(`[fixEmbedsUsingXPath] Total decoded embedded message nodes: ${count}`);
    }

    // Function to process the document and fix corrupted characters
    function processDocument() {
        // Start by fixing text nodes in the document
        console.log("[processDocument] Fixing general text nodes in the document...");
        fixTextInDocument();

        // After general text nodes are fixed, check specific embedded messages or paths
        console.log("[processDocument] Checking for embedded messages at specific XPath paths...");
        const xpaths = [
            "//*[@id='message-1368155593185034263']/div[2]/div[2]/div/div/div[2]/span/ul/li[8]", // Example XPath
            "//*[@id='message-1378223745827382791']/div[2]/div[2]/div/div/div[2]/span/ul/li[4]"  // Another example XPath
        ];

        // Check each XPath path for embedded message corruption
        xpaths.forEach(xpath => fixEmbedsUsingXPath(xpath));

        console.log("[processDocument] Document processing complete.");
    }

    // Retry mechanism with a 2-second delay
    function retryProcessDocument() {
        setTimeout(() => {
            // Check if the document is fully loaded before processing
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                console.log("[retryProcessDocument] Document is ready. Starting processing...");
                processDocument();
            } else {
                console.log("[retryProcessDocument] Document not ready yet, retrying...");
                retryProcessDocument(); // Retry after 2 seconds
            }
        }, 2000); // Retry after 2 seconds
    }

    // Trigger the retry process
    retryProcessDocument();

})();
